<?php

use App\Http\Controllers\AdminPlanController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Plan API Routes
|--------------------------------------------------------------------------
|
| These routes handle admin plan management.
|
*/

// Public routes - Get all plans
Route::prefix('admin-plans')->group(function () {
    Route::get('/', [AdminPlanController::class, 'index']);
    Route::get('/{id}', [AdminPlanController::class, 'show']);
    Route::post('/{id}/calculate-fee', [AdminPlanController::class, 'calculateFee']);
});

// Protected routes - Admin only
Route::middleware('auth:sanctum')->prefix('admin-plans')->group(function () {
    Route::post('/', [AdminPlanController::class, 'store']);
    Route::put('/{id}', [AdminPlanController::class, 'update']);
    Route::delete('/{id}', [AdminPlanController::class, 'destroy']);
});
