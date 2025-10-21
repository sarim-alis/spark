<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PortfolioController extends Controller
{
    /**
     * Display a listing of portfolios.
     */
    public function index(Request $request)
    {
        $query = Portfolio::query();

        // Filter by user_email if provided
        if ($request->has('user_email')) {
            $query->where('user_email', $request->user_email);
        }

        // Filter by custom_slug if provided
        if ($request->has('custom_slug')) {
            $query->where('custom_slug', $request->custom_slug);
        }

        // Filter by is_public if provided
        if ($request->has('is_public')) {
            $query->where('is_public', $request->is_public);
        }

        $portfolios = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $portfolios
        ]);
    }

    /**
     * Store a newly created portfolio.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_email' => 'required|email|exists:users,email',
            'custom_slug' => 'required|string|max:191|unique:portfolio,custom_slug',
            'display_name' => 'required|string|max:191',
            'headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|string',
            'featured_projects' => 'nullable|array',
            'skills' => 'nullable|array',
            'certificates' => 'nullable|array',
            'social_links' => 'nullable|array',
            'is_public' => 'nullable|boolean',
            'view_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $portfolio = Portfolio::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Portfolio created successfully',
            'data' => $portfolio
        ], 201);
    }

    /**
     * Display the specified portfolio.
     */
    public function show(Portfolio $portfolio)
    {
        return response()->json([
            'success' => true,
            'data' => $portfolio
        ]);
    }

    /**
     * Display portfolio by custom slug.
     */
    public function showBySlug($slug)
    {
        $portfolio = Portfolio::where('custom_slug', $slug)->first();

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found'
            ], 404);
        }

        // Increment view count
        $portfolio->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => $portfolio
        ]);
    }

    /**
     * Update the specified portfolio.
     */
    public function update(Request $request, Portfolio $portfolio)
    {
        $validator = Validator::make($request->all(), [
            'user_email' => 'sometimes|email|exists:users,email',
            'custom_slug' => 'sometimes|string|max:191|unique:portfolio,custom_slug,' . $portfolio->id,
            'display_name' => 'sometimes|string|max:191',
            'headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|string',
            'featured_projects' => 'nullable|array',
            'skills' => 'nullable|array',
            'certificates' => 'nullable|array',
            'social_links' => 'nullable|array',
            'is_public' => 'nullable|boolean',
            'view_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $portfolio->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Portfolio updated successfully',
            'data' => $portfolio
        ]);
    }

    /**
     * Remove the specified portfolio.
     */
    public function destroy(Portfolio $portfolio)
    {
        $portfolio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portfolio deleted successfully'
        ]);
    }

    /**
     * Get portfolio for the authenticated user.
     */
    public function getMyPortfolio(Request $request)
    {
        $user = $request->user();
        
        $portfolio = Portfolio::where('user_email', $user->email)->first();

        if (!$portfolio) {
            return response()->json([
                'success' => true,
                'data' => null
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $portfolio
        ]);
    }
}
