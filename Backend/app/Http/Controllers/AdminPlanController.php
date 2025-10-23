<?php

namespace App\Http\Controllers;

use App\Models\AdminPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminPlanController extends Controller
{
    /**
     * Get all admin plans.
     */
    public function index()
    {
        $plans = AdminPlan::active()
            ->with('admin')
            ->orderBy('price')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plans,
        ]);
    }

    /**
     * Get a specific admin plan.
     */
    public function show($id)
    {
        $plan = AdminPlan::with('admin')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $plan,
        ]);
    }

    /**
     * Create a new admin plan (admin only).
     */
    public function store(Request $request)
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'type' => 'required|in:monthly,annual',
            'price' => 'required|numeric|min:0',
            'annual_price' => 'nullable|numeric|min:0',
            'billing_cycle' => 'nullable|array',
            'billing_cycle.*' => 'string|in:monthly,annual',
            'stripe_price_id' => 'nullable|array',
            'stripe_price_id.*' => 'string',
            'course_nos' => 'required|integer|min:1',
            'lectures_nos' => 'required|integer|min:1',
            'platform_fee' => 'required|numeric|min:0|max:100',
        ]);

        $plan = AdminPlan::create([
            'name' => $request->name,
            'icon' => $request->icon,
            'type' => $request->type,
            'price' => $request->price,
            'annual_price' => $request->annual_price,
            'billing_cycle' => $request->billing_cycle,
            'stripe_price_id' => $request->stripe_price_id,
            'user_id' => $request->user()->id,
            'course_nos' => $request->course_nos,
            'lectures_nos' => $request->lectures_nos,
            'platform_fee' => $request->platform_fee,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin plan created successfully',
            'data' => $plan,
        ], 201);
    }

    /**
     * Update an admin plan (admin only).
     */
    public function update(Request $request, $id)
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $plan = AdminPlan::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'icon' => 'nullable|string',
            'type' => 'sometimes|in:monthly,annual',
            'price' => 'sometimes|numeric|min:0',
            'annual_price' => 'nullable|numeric|min:0',
            'billing_cycle' => 'nullable|array',
            'billing_cycle.*' => 'string|in:monthly,annual',
            'stripe_price_id' => 'nullable|array',
            'stripe_price_id.*' => 'string',
            'course_nos' => 'sometimes|integer|min:1',
            'lectures_nos' => 'sometimes|integer|min:1',
            'platform_fee' => 'sometimes|numeric|min:0|max:100',
            'is_active' => 'sometimes|boolean',
        ]);

        $plan->update($request->only([
            'name',
            'icon',
            'type',
            'price',
            'annual_price',
            'billing_cycle',
            'stripe_price_id',
            'course_nos',
            'lectures_nos',
            'platform_fee',
            'is_active',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Admin plan updated successfully',
            'data' => $plan->fresh(),
        ]);
    }

    /**
     * Delete an admin plan (admin only).
     */
    public function destroy(Request $request, $id)
    {
        // Check if user is admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
            ], 403);
        }

        $plan = AdminPlan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin plan deleted successfully',
        ]);
    }

    /**
     * Calculate platform fee for a given course price.
     */
    public function calculateFee(Request $request, $id)
    {
        $request->validate([
            'course_price' => 'required|numeric|min:0',
        ]);

        $plan = AdminPlan::findOrFail($id);
        $coursePrice = $request->course_price;

        $platformFee = $plan->calculatePlatformFee($coursePrice);
        $creatorEarnings = $plan->calculateCreatorEarnings($coursePrice);

        return response()->json([
            'success' => true,
            'data' => [
                'course_price' => $coursePrice,
                'platform_fee_percentage' => $plan->platform_fee,
                'platform_fee_amount' => round($platformFee, 2),
                'creator_earnings' => round($creatorEarnings, 2),
            ],
        ]);
    }
}
