<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StripeKey extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stripe_keys';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'stripe_secret_key',
        'stripe_api_key',
        'title',
        'key_history',
        'user_id',
        'role',
        'admin_id',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'key_history' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'stripe_secret_key',
        'stripe_api_key',
    ];

    /**
     * Get the user who owns these Stripe keys (for creator role).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the admin who owns these Stripe keys (for admin role).
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Check if the keys belong to an admin.
     */
    public function isAdminKeys(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the keys belong to a creator.
     */
    public function isCreatorKeys(): bool
    {
        return $this->role === 'creator';
    }

    /**
     * Get the owner of the keys (either user or admin).
     */
    public function owner()
    {
        return $this->role === 'admin' 
            ? $this->admin() 
            : $this->user();
    }

    /**
     * Add an entry to the key history.
     */
    public function addToHistory(array $entry): void
    {
        $history = $this->key_history ?? [];
        $history[] = array_merge($entry, ['timestamp' => now()->toISOString()]);
        $this->key_history = $history;
        $this->save();
    }

    /**
     * Scope to get keys by role.
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope to get admin keys.
     */
    public function scopeAdminKeys($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope to get creator keys.
     */
    public function scopeCreatorKeys($query)
    {
        return $query->where('role', 'creator');
    }
}
