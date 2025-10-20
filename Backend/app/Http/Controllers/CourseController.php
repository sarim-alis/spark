<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Cloudinary\Cloudinary;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index(Request $request)
    {
        // Get authenticated user ID
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Only show courses created by the logged-in user
        $query = Course::with('creator')->where('created_by', $userId);

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by level if provided
        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $courses = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'lessons' => 'nullable|json',
            'audience' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:255',
            'duration_hours' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'thumbnail_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'is_published' => 'nullable|boolean',
            'total_students' => 'nullable|integer|min:0',
            'total_sales' => 'nullable|numeric|min:0',
        ]);

        // Get authenticated user ID
        $userId = Auth::id();
        
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Handle image upload to Cloudinary
        if ($request->hasFile('thumbnail_url')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('thumbnail_url');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'courses',
                    'resource_type' => 'image'
                ]);

                $validated['thumbnail_url'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload image: ' . $e->getMessage()
                ], 500);
            }
        }

        $validated['created_by'] = $userId;

        $course = Course::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course->load('creator')
        ], 201);
    }

    /**
     * Display the specified course.
     */
    public function show(Course $course)
    {
        return response()->json([
            'success' => true,
            'data' => $course->load('creator')
        ]);
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, Course $course)
    {
        // Check if user owns the course
        if ($course->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this course'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'lessons' => 'nullable|json',
            'audience' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:255',
            'duration_hours' => 'nullable|numeric|min:0',
            'category' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'thumbnail_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_published' => 'nullable|boolean',
            'total_students' => 'nullable|integer|min:0',
            'total_sales' => 'nullable|numeric|min:0',
        ]);

        // Handle image upload to Cloudinary
        if ($request->hasFile('thumbnail_url')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('thumbnail_url');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'courses',
                    'resource_type' => 'image'
                ]);

                $validated['thumbnail_url'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload image: ' . $e->getMessage()
                ], 500);
            }
        }

        $course->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course->load('creator')
        ]);
    }

    /**
     * Remove the specified course.
     */
    public function destroy(Course $course)
    {
        // Check if user owns the course
        if ($course->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this course'
            ], 403);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }

    /**
     * Toggle course publication status.
     */
    public function togglePublish(Course $course)
    {
        // Check if user owns the course
        if ($course->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to modify this course'
            ], 403);
        }

        // Toggle the is_published status
        $course->is_published = !$course->is_published;
        $course->save();

        return response()->json([
            'success' => true,
            'message' => $course->is_published ? 'Course published successfully' : 'Course unpublished successfully',
            'data' => $course->load('creator')
        ]);
    }
}
