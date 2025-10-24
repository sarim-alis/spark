<?php

namespace App\Http\Controllers;

use App\Models\StripeKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StripeKeyController extends Controller
{
    /**
     * Get all Stripe keys for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isAdmin()) {
            // Admin can see all their managed keys
            $keys = StripeKey::where('admin_id', $user->id)
                ->orWhere(function ($query) use ($user) {
                    $query->where('role', 'admin')
                          ->where('user_id', $user->id);
                })
                ->with(['user', 'admin'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            // Creator can only see their own keys
            $keys = StripeKey::where('user_id', $user->id)
                ->where('role', 'creator')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $keys,
        ]);
    }

    /**
     * Get a specific Stripe key.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        
        $key = StripeKey::findOrFail($id);

        // Check authorization
        if ($user->isAdmin()) {
            if ($key->admin_id !== $user->id && !($key->role === 'admin' && $key->user_id === $user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        } else {
            if ($key->user_id !== $user->id || $key->role !== 'creator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $key,
        ]);
    }

    /**
     * Store new Stripe keys.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'stripe_secret_key' => 'required|string',
            'stripe_api_key' => 'required|string',
            'title' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Determine role and ownership
        $role = $user->isAdmin() ? 'admin' : 'creator';
        $userId = null;
        $adminId = null;

        if ($user->isAdmin()) {
            // If admin is creating keys for a user
            if ($request->has('user_id')) {
                $userId = $request->user_id;
                $adminId = $user->id;
                $role = 'creator'; // Keys for a creator managed by admin
            } else {
                // Admin's own keys
                $userId = $user->id;
                $adminId = null;
                $role = 'admin';
            }
        } else {
            // Creator's own keys
            $userId = $user->id;
            $adminId = null;
            $role = 'creator';
        }

        $key = StripeKey::create([
            'id' => Str::uuid(),
            'stripe_secret_key' => $request->stripe_secret_key,
            'stripe_api_key' => $request->stripe_api_key,
            'title' => $request->title,
            'key_history' => [[
                'action' => 'created',
                'timestamp' => now()->toISOString(),
                'by_user_id' => $user->id,
            ]],
            'user_id' => $userId,
            'role' => $role,
            'admin_id' => $adminId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stripe keys stored successfully.',
            'data' => $key,
        ], 201);
    }

    /**
     * Update existing Stripe keys.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $key = StripeKey::findOrFail($id);

        // Check authorization
        if ($user->isAdmin()) {
            if ($key->admin_id !== $user->id && !($key->role === 'admin' && $key->user_id === $user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        } else {
            if ($key->user_id !== $user->id || $key->role !== 'creator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        }

        $request->validate([
            'stripe_secret_key' => 'sometimes|required|string',
            'stripe_api_key' => 'sometimes|required|string',
            'title' => 'sometimes|required|string|max:255',
        ]);

        // Track changes in history
        $changes = [];
        if ($request->has('stripe_secret_key') && $request->stripe_secret_key !== $key->stripe_secret_key) {
            $changes[] = 'stripe_secret_key';
        }
        if ($request->has('stripe_api_key') && $request->stripe_api_key !== $key->stripe_api_key) {
            $changes[] = 'stripe_api_key';
        }
        if ($request->has('title') && $request->title !== $key->title) {
            $changes[] = 'title';
        }

        if (!empty($changes)) {
            $key->addToHistory([
                'action' => 'updated',
                'fields' => $changes,
                'by_user_id' => $user->id,
            ]);
        }

        $key->update($request->only(['stripe_secret_key', 'stripe_api_key', 'title']));

        return response()->json([
            'success' => true,
            'message' => 'Stripe keys updated successfully.',
            'data' => $key,
        ]);
    }

    /**
     * Delete Stripe keys.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $key = StripeKey::findOrFail($id);

        // Check authorization
        if ($user->isAdmin()) {
            if ($key->admin_id !== $user->id && !($key->role === 'admin' && $key->user_id === $user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        } else {
            if ($key->user_id !== $user->id || $key->role !== 'creator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        }

        $key->delete();

        return response()->json([
            'success' => true,
            'message' => 'Stripe keys deleted successfully.',
        ]);
    }

    /**
     * Get key history.
     */
    public function history(Request $request, $id)
    {
        $user = $request->user();
        $key = StripeKey::findOrFail($id);

        // Check authorization
        if ($user->isAdmin()) {
            if ($key->admin_id !== $user->id && !($key->role === 'admin' && $key->user_id === $user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        } else {
            if ($key->user_id !== $user->id || $key->role !== 'creator') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access.',
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $key->id,
                'title' => $key->title,
                'history' => $key->key_history ?? [],
            ],
        ]);
    }
}
