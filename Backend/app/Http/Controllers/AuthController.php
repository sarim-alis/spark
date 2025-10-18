<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        try {
            // Get bearer token from header
            $bearerToken = $request->bearerToken();
            
            if ($bearerToken) {
                // Find and delete the specific token
                $tokenModel = config('sanctum.personal_access_token_model', \Laravel\Sanctum\PersonalAccessToken::class);
                $token = $tokenModel::findToken($bearerToken);
                if ($token) {
                    $token->delete();
                    return response()->json(['message' => 'Logged out successfully']);
                }
            }
            
            // If we have an authenticated user, delete all their tokens
            if ($request->user()) {
                $request->user()->tokens()->delete();
                return response()->json(['message' => 'Logged out successfully']);
            }

            return response()->json(['message' => 'Already logged out']);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['message' => 'Failed to logout', 'error' => $e->getMessage()], 500);
        }
    }
}
