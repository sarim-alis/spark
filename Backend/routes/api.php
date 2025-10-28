<?php
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InterviewPrepController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\NoteController;
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
    Route::post('courses/{course}/upload-powerpoint', [CourseController::class, 'uploadPowerPoint']);
    
    // Admin - Get all courses
    Route::get('admin/courses', [CourseController::class, 'adminIndex']);
    
    // Interview Prep
    Route::get('interview-prep', [InterviewPrepController::class, 'index']);
    Route::post('interview-prep', [InterviewPrepController::class, 'store']);
    Route::get('interview-prep/me', [InterviewPrepController::class, 'getUserInterviewPrep']);
    Route::get('interview-prep/{interviewPrep}', [InterviewPrepController::class, 'show']);
    Route::put('interview-prep/{interviewPrep}', [InterviewPrepController::class, 'update']);
    Route::patch('interview-prep/{interviewPrep}', [InterviewPrepController::class, 'update']);
    Route::delete('interview-prep/{interviewPrep}', [InterviewPrepController::class, 'destroy']);
    
    // Portfolio
    Route::get('portfolio', [PortfolioController::class, 'index']);
    Route::post('portfolio', [PortfolioController::class, 'store']);
    Route::get('portfolio/me', [PortfolioController::class, 'getMyPortfolio']);
    Route::get('portfolio/slug/{slug}', [PortfolioController::class, 'showBySlug']);
    Route::get('portfolio/{portfolio}', [PortfolioController::class, 'show']);
    Route::put('portfolio/{portfolio}', [PortfolioController::class, 'update']);
    Route::patch('portfolio/{portfolio}', [PortfolioController::class, 'update']);
    Route::delete('portfolio/{portfolio}', [PortfolioController::class, 'destroy']);
    
    // Notes
    Route::get('notes', [NoteController::class, 'index']); // Get user's notes
    Route::post('notes', [NoteController::class, 'store']); // Create note
    Route::get('notes/all', [NoteController::class, 'all']); // Get all notes (admin)
    Route::get('notes/user/{userId}', [NoteController::class, 'getByUser']); // Get notes by user
    Route::get('notes/{note}', [NoteController::class, 'show']); // Get single note
    Route::put('notes/{note}', [NoteController::class, 'update']); // Update note
    Route::patch('notes/{note}', [NoteController::class, 'update']); // Update note
    Route::delete('notes/{note}', [NoteController::class, 'destroy']); // Delete note
});

// Admin Plans Routes
require __DIR__.'/admin_plan_routes.php';

// Stripe Keys Routes
require __DIR__.'/stripe_key_routes.php';