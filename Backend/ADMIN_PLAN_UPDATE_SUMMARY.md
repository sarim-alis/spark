# Admin Plan Update Summary

## New Fields Added

Three new fields have been added to the `admin_plans` table:

### 1. annual_price (decimal)
- **Type:** `decimal(10,2)`
- **Nullable:** Yes
- **Description:** Annual subscription price for the plan
- **Example:** `100.00` for $100/year

### 2. billing_cycle (json)
- **Type:** `json`
- **Nullable:** Yes
- **Description:** Array of supported billing cycles for the plan
- **Example:** `["monthly", "annual"]` or `["monthly"]`

### 3. stripe_price_id (json)
- **Type:** `json`
- **Nullable:** Yes
- **Description:** Array of Stripe Price IDs (one for each billing cycle)
- **Example:** `["price_monthly_xxxxx", "price_annual_xxxxx"]`

## Migration

Run the new migration to add these fields:

```bash
php artisan migrate
```

This will execute: `2025_10_23_000002_add_stripe_fields_to_admin_plans_table.php`

## Updated Files

### 1. Migration
- `database/migrations/2025_10_23_000002_add_stripe_fields_to_admin_plans_table.php`

### 2. Model (AdminPlan.php)
- Added to `$fillable`: `annual_price`, `billing_cycle`, `stripe_price_id`
- Added to `$casts`: `annual_price` as `decimal:2`, `billing_cycle` as `array`, `stripe_price_id` as `array`
- New method: `getEffectivePrice($cycle)` - Returns price based on billing cycle
- New method: `hasAnnualPricing()` - Checks if annual pricing is available

### 3. Controller (AdminPlanController.php)
- Updated `store()` validation to include new fields
- Updated `store()` to save new fields
- Updated `update()` validation to include new fields
- Updated `update()` to allow updating new fields

### 4. Seeder (AdminPlanSeeder.php)
- Updated default plans with annual pricing and JSON arrays:
  - **Basic:** $0/month, $0/year, billing_cycle: ["monthly"]
  - **Premium:** $10/month, $100/year, billing_cycle: ["monthly", "annual"]
  - **Pro:** $50/month, $500/year, billing_cycle: ["monthly", "annual"]

### 5. Documentation (ADMIN_PLAN_README.md)
- Updated table schema
- Added new methods documentation
- Updated API examples
- Updated default plans information

## Usage Examples

### Get Effective Price Based on Billing Cycle

```php
$plan = AdminPlan::find($planId);

// Get monthly price
$monthlyPrice = $plan->getEffectivePrice('monthly');
// Returns: 10.00

// Get annual price (if available)
$annualPrice = $plan->getEffectivePrice('annual');
// Returns: 100.00 (or falls back to monthly price if annual not set)
```

### Check if Plan Supports Annual Billing

```php
$plan = AdminPlan::find($planId);

if ($plan->hasAnnualPricing()) {
    echo "This plan supports annual billing at \${$plan->annual_price}/year";
} else {
    echo "This plan only supports monthly billing";
}
```

### Create Plan with Stripe Integration

```php
POST /api/admin-plans
{
  "name": "Premium",
  "icon": "/icons/premium.svg",
  "type": "monthly",
  "price": 10.00,
  "annual_price": 100.00,
  "billing_cycle": ["monthly", "annual"],
  "stripe_price_id": ["price_monthly_xxxxx", "price_annual_xxxxx"],
  "course_nos": 10,
  "lectures_nos": 30,
  "platform_fee": 10.00
}
```

### Display Plan with Both Pricing Options

```php
$plan = AdminPlan::find($planId);

echo "Plan: {$plan->name}\n";
echo "Monthly: \${$plan->price}\n";

if ($plan->hasAnnualPricing()) {
    echo "Annual: \${$plan->annual_price} (Save " . 
         round((1 - ($plan->annual_price / ($plan->price * 12))) * 100) . "%)\n";
}
```

## Stripe Integration Notes

The `stripe_price_id` field is designed to store an array of Stripe Price IDs (one for each billing cycle) for seamless payment integration:

1. **Create Prices in Stripe Dashboard** or via API (one for monthly, one for annual)
2. **Store the Price IDs** in `stripe_price_id` array field
3. **Use in Checkout:** Select the appropriate Price ID based on user's chosen billing cycle

Example Stripe integration:

```php
use Stripe\Stripe;
use Stripe\Checkout\Session;

Stripe::setApiKey(env('STRIPE_SECRET'));

$plan = AdminPlan::find($planId);
$billingCycle = $request->input('billing_cycle'); // 'monthly' or 'annual'

// Get the appropriate Stripe Price ID based on billing cycle
$stripePriceId = $billingCycle === 'annual' 
    ? $plan->stripe_price_id[1] // Annual price ID (second in array)
    : $plan->stripe_price_id[0]; // Monthly price ID (first in array)

$session = Session::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
        'price' => $stripePriceId, // Use selected Stripe Price ID
        'quantity' => 1,
    ]],
    'mode' => 'subscription',
    'success_url' => route('subscription.success'),
    'cancel_url' => route('subscription.cancel'),
]);
```

## Database Schema After Update

```sql
CREATE TABLE admin_plans (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    icon VARCHAR(255),
    type ENUM('monthly', 'annual'),
    price DECIMAL(10,2),
    annual_price DECIMAL(10,2) NULL,        -- NEW
    billing_cycle JSON NULL,                 -- NEW (JSON array)
    stripe_price_id JSON NULL,               -- NEW (JSON array)
    user_id BIGINT,
    course_nos INT,
    lectures_nos INT,
    platform_fee DECIMAL(5,2),
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Testing

After running migrations, test the new fields:

```bash
# 1. Run migration
php artisan migrate

# 2. Seed with updated data
php artisan db:seed --class=AdminPlanSeeder

# 3. Test API endpoints
curl -X GET http://localhost:8000/api/admin-plans

# 4. Verify new fields are present in response
```

## Next Steps

1. **Integrate Stripe:** Create Stripe Price objects and store their IDs
2. **Frontend Update:** Update UI to display both monthly and annual pricing
3. **Checkout Flow:** Implement billing cycle selection in subscription flow
4. **Webhooks:** Set up Stripe webhooks to handle subscription events
