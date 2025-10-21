<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterviewPrep extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'interview_prep';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_email',
        'job_role',
        'course_ids',
        'difficulty',
        'interview_type',
        'sessions',
        'total_sessions',
        'average_score',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'course_ids' => 'array',
        'sessions' => 'array',
        'total_sessions' => 'integer',
        'average_score' => 'float',
    ];

    /**
     * Get the user that owns the interview prep.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_email', 'email');
    }
}
