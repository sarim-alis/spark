<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Cloudinary\Cloudinary;

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
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
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

        $data = $request->all();

        // Decode JSON strings to arrays for JSON fields (from FormData)
        $jsonFields = ['featured_projects', 'skills', 'certificates', 'social_links'];
        foreach ($jsonFields as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = json_decode($data[$field], true);
            }
        }

        // Convert is_public to boolean
        if (isset($data['is_public'])) {
            $data['is_public'] = filter_var($data['is_public'], FILTER_VALIDATE_BOOLEAN);
        }

        // Handle profile image upload to Cloudinary
        if ($request->hasFile('profile_image')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('profile_image');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'portfolios',
                    'resource_type' => 'image'
                ]);

                $data['profile_image'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload image: ' . $e->getMessage()
                ], 500);
            }
        }

        $portfolio = Portfolio::create($data);

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
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'featured_projects' => 'nullable', // Can be array or JSON string
            'skills' => 'nullable', // Can be array or JSON string
            'certificates' => 'nullable', // Can be array or JSON string
            'social_links' => 'nullable', // Can be array or JSON string
            'is_public' => 'nullable|boolean',
            'view_count' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        // Decode JSON strings to arrays for JSON fields (from FormData)
        $jsonFields = ['featured_projects', 'skills', 'certificates', 'social_links'];
        foreach ($jsonFields as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = json_decode($data[$field], true);
            }
        }

        // Convert is_public to boolean
        if (isset($data['is_public'])) {
            $data['is_public'] = filter_var($data['is_public'], FILTER_VALIDATE_BOOLEAN);
        }

        // Handle profile image upload to Cloudinary
        if ($request->hasFile('profile_image')) {
            try {
                $cloudinary = new Cloudinary([
                    'cloud' => [
                        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'api_secret' => env('CLOUDINARY_API_SECRET'),
                    ]
                ]);

                $uploadedFile = $request->file('profile_image');
                $result = $cloudinary->uploadApi()->upload($uploadedFile->getRealPath(), [
                    'folder' => 'portfolios',
                    'resource_type' => 'image'
                ]);

                $data['profile_image'] = $result['secure_url'];
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload image: ' . $e->getMessage()
                ], 500);
            }
        }

        $portfolio->update($data);

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
