<?php

namespace App\Http\Controllers;

use App\Models\InterviewPrep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InterviewPrepController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = InterviewPrep::query();

        // Filter by user_email if provided
        if ($request->has('user_email')) {
            $query->where('user_email', $request->user_email);
        }

        $interviewPreps = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $interviewPreps
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_email' => 'required|email|exists:users,email',
            'job_role' => 'nullable|string|max:255',
            'course_ids' => 'nullable|array',
            'difficulty' => 'nullable|string|in:beginner,intermediate,advanced',
            'interview_type' => 'nullable|string|in:technical,behavioral,mixed',
            'sessions' => 'nullable|array',
            'total_sessions' => 'nullable|integer|min:0',
            'average_score' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $interviewPrep = InterviewPrep::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Interview prep created successfully',
            'data' => $interviewPrep
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(InterviewPrep $interviewPrep)
    {
        return response()->json([
            'success' => true,
            'data' => $interviewPrep
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InterviewPrep $interviewPrep)
    {
        $validator = Validator::make($request->all(), [
            'user_email' => 'sometimes|email|exists:users,email',
            'job_role' => 'nullable|string|max:255',
            'course_ids' => 'nullable|array',
            'difficulty' => 'nullable|string|in:beginner,intermediate,advanced',
            'interview_type' => 'nullable|string|in:technical,behavioral,mixed',
            'sessions' => 'nullable|array',
            'total_sessions' => 'nullable|integer|min:0',
            'average_score' => 'nullable|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $interviewPrep->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Interview prep updated successfully',
            'data' => $interviewPrep
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InterviewPrep $interviewPrep)
    {
        $interviewPrep->delete();

        return response()->json([
            'success' => true,
            'message' => 'Interview prep deleted successfully'
        ]);
    }

    /**
     * Get interview prep for the authenticated user.
     */
    public function getUserInterviewPrep(Request $request)
    {
        $user = $request->user();
        
        $interviewPrep = InterviewPrep::where('user_email', $user->email)->first();

        if (!$interviewPrep) {
            return response()->json([
                'success' => true,
                'data' => null
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $interviewPrep
        ]);
    }
}
