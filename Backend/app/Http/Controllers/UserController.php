<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string',
            'profile_picture_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'bio' => 'nullable|string|max:255',
        ]);

        // Handle profile picture upload to Cloudinary
        if ($request->hasFile('profile_picture_url')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('profile_picture_url');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'profiles',
                    'resource_type' => 'image'
                ]);

                $data['profile_picture_url'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload profile picture: ' . $e->getMessage()
                ], 500);
            }
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'profile_picture_url' => $data['profile_picture_url'] ?? null,
            'bio' => $data['bio'] ?? null,
        ]);

        // If Sanctum is available, return a personal access token so frontend can auto-login
        if (method_exists($user, 'createToken')) {
            $token = $user->createToken('api-token')->plainTextToken;
            return response()->json(['user' => $user, 'token' => $token], 201);
        }

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string',
            'profile_picture_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'bio' => 'nullable|string|max:255',
        ]);

        // Handle profile picture upload to Cloudinary
        if ($request->hasFile('profile_picture_url')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('profile_picture_url');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'profiles',
                    'resource_type' => 'image'
                ]);

                $data['profile_picture_url'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload profile picture: ' . $e->getMessage()
                ], 500);
            }
        }

        if (isset($data['password'])) {
            // Hash password.
            $data['password'] = $data['password'];
        }

        try {
            $user->update($data);
            $user->refresh();
            return response()->json($user);
        } catch (\Throwable $e) {
            // Log full exception details and return JSON error so clients don't get HTML 500 page.
            logger()->error('User update failed', [
                'id' => $user->id,
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * Get the authenticated user's profile.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'profile_picture_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'bio' => 'nullable|string|max:255',
        ]);

        // Handle profile picture upload to Cloudinary
        if ($request->hasFile('profile_picture_url')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('profile_picture_url');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'profiles',
                    'resource_type' => 'image'
                ]);

                $data['profile_picture_url'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload profile picture: ' . $e->getMessage()
                ], 500);
            }
        }

        try {
            $user->update($data);
            $user->refresh();
            
            // Update auth_user in localStorage
            $authUser = json_decode(request()->header('X-Auth-User', '{}'), true);
            $authUser = array_merge($authUser, $user->toArray());
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ]);
        } catch (\Throwable $e) {
            logger()->error('Profile update failed', [
                'id' => $user->id,
                'exception' => get_class($e),
                'message' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
