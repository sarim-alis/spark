# Admin Plan System Documentation

## Overview

This is a simplified admin plan system where admins can create subscription plans for creators. Each plan defines:
- Number of courses allowed
- Number of lectures allowed
- Platform fee percentage taken by admin
- Plan pricing (monthly/annual)

## Database Schema

### admin_plans Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Plan name (Basic, Premium, Pro) |
| icon | string | Icon URL |
| type | enum | 'monthly' or 'annual' |
| price | decimal(10,2) | Monthly plan price |
| annual_price | decimal(10,2) | Annual plan price (nullable) |
| billing_cycle | json | Array of billing cycle options (e.g., ["monthly", "annual"]) |
| stripe_price_id | json | Array of Stripe Price IDs for different billing cycles |
| user_id | bigint | Foreign key to users (admin who created) |
| course_nos | integer | Number of courses allowed |
| lectures_nos | integer | Number of lectures allowed |
| platform_fee | decimal(5,2) | Platform fee percentage (0-100) |
| is_active | boolean | Whether plan is active |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

## Models

### AdminPlan Model

**Location:** `app/Models/AdminPlan.php`

**Relationships:**
- `admin()` - BelongsTo User (the admin who created the plan)

**Key Methods:**
- `isFree()` - Check if plan is free
- `calculatePlatformFee($coursePrice)` - Calculate platform fee amount
- `calculateCreatorEarnings($coursePrice)` - Calculate creator earnings after fee
- `canCreateCourse($currentCount)` - Check if creator can create more courses
- `canAddLecture($currentCount)` - Check if creator can add more lectures
- `getRemainingCourses($currentCount)` - Get remaining courses allowed
- `getRemainingLectures($currentCount)` - Get remaining lectures allowed
- `getEffectivePrice($cycle)` - Get price based on billing cycle (monthly/annual)
- `hasAnnualPricing()` - Check if plan supports annual billing
- `getStripePriceId($cycle)` - Get Stripe Price ID for a specific billing cycle
- `supportsCycle($cycle)` - Check if plan supports a specific billing cycle
- `getAvailableCycles()` - Get all available billing cycles

**Scopes:**
- `active()` - Get only active plans
- `monthly()` - Get monthly plans
- `annual()` - Get annual plans

### User Model (Updated)

**New Relationships:**
- `adminPlans()` - HasMany AdminPlan (plans created by this admin)

**New Methods:**
- `isAdmin()` - Check if user is admin
- `isCreator()` - Check if user is creator

## Installation

### 1. Run Migration

```bash
php artisan migrate
```

### 2. Seed Default Plans

```bash
php artisan db:seed --class=AdminPlanSeeder
```

This creates:
- **Basic Plan**: Free, 3 courses, 10 lectures, 0% platform fee
- **Premium Plan**: $10/month, 10 courses, 30 lectures, 10% platform fee
- **Pro Plan**: $50/month, 3 courses, 40 lectures, 15% platform fee

And a default admin user:
- Email: `admin@coursespark.com`
- Password: `admin123`

### 3. Include Routes

Add to `routes/api.php`:

```php
require __DIR__.'/admin_plan_routes.php';
```

## API Endpoints

### Public Endpoints

#### Get All Plans
```http
GET /api/admin-plans
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic",
      "icon": "/icons/basic-plan.svg",
      "type": "monthly",
      "price": "0.00",
      "user_id": 1,
      "course_nos": 3,
      "lectures_nos": 10,
      "platform_fee": "0.00",
      "is_active": true,
      "created_at": "2025-10-23T00:00:00.000000Z",
      "updated_at": "2025-10-23T00:00:00.000000Z"
    }
  ]
}
```

#### Get Specific Plan
```http
GET /api/admin-plans/{id}
```

#### Calculate Platform Fee
```http
POST /api/admin-plans/{id}/calculate-fee
Content-Type: application/json

{
  "course_price": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_price": 100,
    "platform_fee_percentage": "10.00",
    "platform_fee_amount": 10.00,
    "creator_earnings": 90.00
  }
}
```

### Protected Endpoints (Admin Only)

#### Create Plan
```http
POST /api/admin-plans
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Enterprise",
  "icon": "/icons/enterprise.svg",
  "type": "monthly",
  "price": 100,
  "annual_price": 1000,
  "billing_cycle": ["monthly", "annual"],
  "stripe_price_id": ["price_monthly_xxxxx", "price_annual_xxxxx"],
  "course_nos": 50,
  "lectures_nos": 200,
  "platform_fee": 5
}
```

#### Update Plan
```http
PUT /api/admin-plans/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 120,
  "course_nos": 60
}
```

#### Delete Plan
```http
DELETE /api/admin-plans/{id}
Authorization: Bearer {token}
```

## Usage Examples

### Check if Creator Can Create Course

```php
use App\Models\AdminPlan;
use App\Models\User;

$creator = User::find($creatorId);
$plan = AdminPlan::find($planId);

$currentCourseCount = $creator->courses()->count();

if ($plan->canCreateCourse($currentCourseCount)) {
    // Allow course creation
    $course = Course::create([...]);
} else {
    // Show upgrade message
    return response()->json([
        'error' => 'Course limit reached. Please upgrade your plan.',
        'current_count' => $currentCourseCount,
        'max_allowed' => $plan->course_nos,
    ], 403);
}
```

### Calculate Platform Fee

```php
$plan = AdminPlan::find($planId);
$coursePrice = 99.99;

$platformFee = $plan->calculatePlatformFee($coursePrice);
$creatorEarnings = $plan->calculateCreatorEarnings($coursePrice);

echo "Course Price: $" . $coursePrice;
echo "Platform Fee ({$plan->platform_fee}%): $" . $platformFee;
echo "Creator Earnings: $" . $creatorEarnings;
```

### Get Admin's Plans

```php
$admin = User::where('role', 'admin')->first();
$plans = $admin->adminPlans()->active()->get();

foreach ($plans as $plan) {
    echo "{$plan->name}: \${$plan->price}/month";
}
```

## Default Plans (Based on Image)

### Basic Plan
- **Price:** Free (monthly)
- **Annual Price:** Free
- **Billing Cycle:** monthly
- **Courses:** 3
- **Lectures:** 10
- **Platform Fee:** 0%
- **Note:** Free for 1st month

### Premium Plan
- **Price:** $10/month
- **Annual Price:** $100/year
- **Billing Cycle:** monthly, annual
- **Courses:** 10
- **Lectures:** 30
- **Platform Fee:** 10%

### Pro Plan
- **Price:** $50/month
- **Annual Price:** $500/year
- **Billing Cycle:** monthly, annual
- **Courses:** 3 (Note: This seems low for Pro tier)
- **Lectures:** 40
- **Platform Fee:** 15%

## Integration with Course Creation

To enforce plan limits when creating courses:

```php
// In CourseController@store
public function store(Request $request)
{
    $user = $request->user();
    
    // Get user's current plan (you'll need to add this relationship)
    $plan = $user->currentPlan; // Implement this based on your subscription logic
    
    if (!$plan) {
        return response()->json([
            'error' => 'No active plan found'
        ], 403);
    }
    
    $currentCourseCount = $user->courses()->count();
    
    if (!$plan->canCreateCourse($currentCourseCount)) {
        return response()->json([
            'error' => 'Course limit reached',
            'current' => $currentCourseCount,
            'max' => $plan->course_nos,
            'remaining' => $plan->getRemainingCourses($currentCourseCount)
        ], 403);
    }
    
    // Create course
    $course = Course::create([...]);
    
    return response()->json([
        'success' => true,
        'data' => $course
    ]);
}
```

## File Structure

```
Backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── AdminPlanController.php
│   └── Models/
│       ├── AdminPlan.php
│       └── User.php (updated)
├── database/
│   ├── migrations/
│   │   └── 2025_10_23_000001_create_admin_plans_table.php
│   └── seeders/
│       └── AdminPlanSeeder.php
├── routes/
│   └── admin_plan_routes.php
└── ADMIN_PLAN_README.md
```

## Next Steps

1. **User-Plan Association:** Create a pivot table or field to link users to their current plan
2. **Subscription Management:** Implement subscription lifecycle (start, renew, cancel)
3. **Payment Integration:** Integrate Stripe for payment processing
4. **Plan Enforcement:** Add middleware to check plan limits on course/lecture creation
5. **Analytics:** Track plan usage and revenue

## Notes

- The `user_id` in `admin_plans` table refers to the admin who created the plan
- You'll need to implement the logic to assign plans to creators
- Consider adding a `user_plans` or `subscriptions` table to track which creators have which plans
- Platform fee is stored as a percentage (0-100)
