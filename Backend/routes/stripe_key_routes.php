<?php

use App\Http\Controllers\StripeKeyController;
use Illuminate\Support\Facades\Route;

// All Stripe key routes require authentication
Route::middleware('auth:sanctum')->prefix('stripe-keys')->group(function () {
    // Get all Stripe keys for authenticated user
    Route::get('/', [StripeKeyController::class, 'index']);
    
    // Get a specific Stripe key
    Route::get('/{id}', [StripeKeyController::class, 'show']);
    
    // Create new Stripe keys
    Route::post('/', [StripeKeyController::class, 'store']);
    
    // Update Stripe keys
    Route::put('/{id}', [StripeKeyController::class, 'update']);
    Route::patch('/{id}', [StripeKeyController::class, 'update']);
    
    // Delete Stripe keys
    Route::delete('/{id}', [StripeKeyController::class, 'destroy']);
    
    // Get key history
    Route::get('/{id}/history', [StripeKeyController::class, 'history']);
});
