<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    /**
     * Get all notes for the authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $notes = Note::where('created_by', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Get all notes (admin only or public access)
     */
    public function all()
    {
        $notes = Note::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Get notes by user ID
     */
    public function getByUser($userId)
    {
        $notes = Note::where('created_by', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Create a new note
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'topic' => 'required|string|max:255',
            'depth' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note = Note::create([
            'topic' => $validated['topic'],
            'depth' => $validated['depth'],
            'content' => $validated['content'],
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Note created successfully',
            'data' => $note
        ], 201);
    }

    /**
     * Get a single note
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $note = Note::where('id', $id)
            ->where('created_by', $user->id)
            ->first();

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $note
        ]);
    }

    /**
     * Update a note
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $note = Note::where('id', $id)
            ->where('created_by', $user->id)
            ->first();

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found'
            ], 404);
        }

        $validated = $request->validate([
            'topic' => 'sometimes|string|max:255',
            'depth' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        $note->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Note updated successfully',
            'data' => $note
        ]);
    }

    /**
     * Delete a note
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $note = Note::where('id', $id)
            ->where('created_by', $user->id)
            ->first();

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found'
            ], 404);
        }

        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Note deleted successfully'
        ]);
    }
}
