<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminPlan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'admin_plans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'icon',
        'type',
        'price',
        'annual_price',
        'billing_cycle',
        'stripe_price_id',
        'user_id',
        'course_nos',
        'lectures_nos',
        'platform_fee',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'annual_price' => 'decimal:2',
        'billing_cycle' => 'array',
        'stripe_price_id' => 'array',
        'platform_fee' => 'decimal:2',
        'course_nos' => 'integer',
        'lectures_nos' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the admin user who created this plan.
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope to get only active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get monthly plans.
     */
    public function scopeMonthly($query)
    {
        return $query->where('type', 'monthly');
    }

    /**
     * Scope to get annual plans.
     */
    public function scopeAnnual($query)
    {
        return $query->where('type', 'annual');
    }

    /**
     * Check if the plan is free.
     */
    public function isFree(): bool
    {
        return $this->price == 0;
    }

    /**
     * Get the platform fee amount for a given course price.
     */
    public function calculatePlatformFee(float $coursePrice): float
    {
        return ($coursePrice * $this->platform_fee) / 100;
    }

    /**
     * Get the creator's earnings after platform fee.
     */
    public function calculateCreatorEarnings(float $coursePrice): float
    {
        return $coursePrice - $this->calculatePlatformFee($coursePrice);
    }

    /**
     * Check if a creator can create more courses.
     */
    public function canCreateCourse(int $currentCourseCount): bool
    {
        return $currentCourseCount < $this->course_nos;
    }

    /**
     * Check if a creator can add more lectures to a course.
     */
    public function canAddLecture(int $currentLectureCount): bool
    {
        return $currentLectureCount < $this->lectures_nos;
    }

    /**
     * Get remaining courses allowed.
     */
    public function getRemainingCourses(int $currentCourseCount): int
    {
        return max(0, $this->course_nos - $currentCourseCount);
    }

    /**
     * Get remaining lectures allowed.
     */
    public function getRemainingLectures(int $currentLectureCount): int
    {
        return max(0, $this->lectures_nos - $currentLectureCount);
    }

    /**
     * Get the effective price based on billing cycle.
     */
    public function getEffectivePrice(string $cycle = 'monthly'): float
    {
        if ($cycle === 'annual' && $this->annual_price) {
            return (float) $this->annual_price;
        }
        return (float) $this->price;
    }

    /**
     * Check if plan supports annual billing.
     */
    public function hasAnnualPricing(): bool
    {
        return !is_null($this->annual_price) && $this->annual_price > 0;
    }

    /**
     * Get Stripe Price ID for a specific billing cycle.
     */
    public function getStripePriceId(string $cycle): ?string
    {
        $index = array_search($cycle, $this->billing_cycle ?? []);
        return $index !== false ? ($this->stripe_price_id[$index] ?? null) : null;
    }

    /**
     * Check if plan supports a specific billing cycle.
     */
    public function supportsCycle(string $cycle): bool
    {
        return in_array($cycle, $this->billing_cycle ?? []);
    }

    /**
     * Get all available billing cycles.
     */
    public function getAvailableCycles(): array
    {
        return $this->billing_cycle ?? [];
    }
}
