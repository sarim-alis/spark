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
        'audience',
        'difficulty',
        'duration',
        'category',
        'thumbnail_url',
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
