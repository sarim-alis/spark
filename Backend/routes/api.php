<?php
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Users.
Route::post('users', [UserController::class, 'store'])->middleware(\App\Http\Middleware\ForceJson::class);
Route::post('login', [AuthController::class, 'login'])->middleware(\App\Http\Middleware\ForceJson::class);
Route::post('logout', [AuthController::class, 'logout'])->middleware(\App\Http\Middleware\ForceJson::class);
Route::get('users', [UserController::class, 'index']);
Route::get('users/{user}', [UserController::class, 'show']);
Route::put('users/{user}', [UserController::class, 'update']);
Route::patch('users/{user}', [UserController::class, 'update']);
Route::delete('users/{user}', [UserController::class, 'destroy']);

// Authenticated routes.
Route::middleware('auth:sanctum')->group(function () {
    // Profile routes
    Route::get('users/profile/me', [UserController::class, 'getProfile']);
    Route::put('users/profile/me', [UserController::class, 'updateProfile']);
    Route::post('users/profile/me', [UserController::class, 'updateProfile']);
    
    // Courses
    Route::get('courses', [CourseController::class, 'index']);
    Route::post('courses', [CourseController::class, 'store']);
    Route::get('courses/{course}', [CourseController::class, 'show']);
    Route::put('courses/{course}', [CourseController::class, 'update']);
    Route::patch('courses/{course}', [CourseController::class, 'update']);
    Route::delete('courses/{course}', [CourseController::class, 'destroy']);
    Route::post('courses/{course}/toggle-publish', [CourseController::class, 'togglePublish']);
});