<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'audience',
        'difficulty',
        'duration',
        'category',
        'course_image',
        'created_by',
    ];

    /**
     * Get the user that created the course.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
