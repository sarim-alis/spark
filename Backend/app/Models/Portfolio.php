<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'portfolio';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_email',
        'custom_slug',
        'display_name',
        'headline',
        'bio',
        'profile_image',
        'featured_projects',
        'skills',
        'certificates',
        'social_links',
        'is_public',
        'view_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'featured_projects' => 'array',
        'skills' => 'array',
        'certificates' => 'array',
        'social_links' => 'array',
        'is_public' => 'boolean',
        'view_count' => 'integer',
    ];

    /**
     * Get the user that owns the portfolio.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_email', 'email');
    }
}
