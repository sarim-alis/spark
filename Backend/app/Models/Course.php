<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'course';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'lessons',
        'audience',
        'level',
        'duration_hours',
        'category',
        'price',
        'thumbnail_url',
        'external_url',
        'created_by',
        'is_published',
        'total_students',
        'total_sales',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'lessons' => 'array',
        'duration_hours' => 'float',
        'price' => 'float',
        'is_published' => 'boolean',
        'total_students' => 'integer',
        'total_sales' => 'float',
    ];

    /**
     * Get the user that created the course.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
