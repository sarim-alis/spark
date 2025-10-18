<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
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
        ]);

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
}
