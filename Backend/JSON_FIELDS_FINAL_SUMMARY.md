# JSON Fields Update - Final Summary

## Changes Made

Both `billing_cycle` and `stripe_price_id` fields have been converted from `text` to `json` type to support array storage.

## Updated Files

### 1. Migration
**File:** `database/migrations/2025_10_23_000002_add_stripe_fields_to_admin_plans_table.php`

```php
$table->json('billing_cycle')->nullable();
$table->json('stripe_price_id')->nullable();
```

### 2. Model
**File:** `app/Models/AdminPlan.php`

**Added Casts:**
```php
protected $casts = [
    'billing_cycle' => 'array',
    'stripe_price_id' => 'array',
    // ...
];
```

**New Helper Methods:**
- `getStripePriceId($cycle)` - Get Stripe Price ID for specific billing cycle
- `supportsCycle($cycle)` - Check if plan supports a billing cycle
- `getAvailableCycles()` - Get all available billing cycles

### 3. Controller
**File:** `app/Http/Controllers/AdminPlanController.php`

**Updated Validation:**
```php
'billing_cycle' => 'nullable|array',
'billing_cycle.*' => 'string|in:monthly,annual',
'stripe_price_id' => 'nullable|array',
'stripe_price_id.*' => 'string',
```

### 4. Seeder
**File:** `database/seeders/AdminPlanSeeder.php`

**Updated Data Format:**
```php
'billing_cycle' => ['monthly', 'annual'],
'stripe_price_id' => [],
```

### 5. Documentation
- `ADMIN_PLAN_README.md` - Updated with JSON format
- `ADMIN_PLAN_UPDATE_SUMMARY.md` - Updated with JSON examples
- `JSON_FIELDS_USAGE_GUIDE.md` - Complete usage guide (NEW)

## Data Format

### Before (Text)
```json
{
  "billing_cycle": "monthly,annual",
  "stripe_price_id": "price_xxxxx"
}
```

### After (JSON Array)
```json
{
  "billing_cycle": ["monthly", "annual"],
  "stripe_price_id": ["price_monthly_xxxxx", "price_annual_xxxxx"]
}
```

## Usage Examples

### Creating a Plan
```php
AdminPlan::create([
    'name' => 'Premium',
    'billing_cycle' => ['monthly', 'annual'],
    'stripe_price_id' => ['price_m_xxx', 'price_a_xxx'],
    // ... other fields
]);
```

### Getting Stripe Price ID
```php
$plan = AdminPlan::find($id);

// Using helper method (recommended)
$stripePriceId = $plan->getStripePriceId('annual');

// Direct array access
$stripePriceId = $plan->stripe_price_id[1];
```

### Checking Billing Cycle Support
```php
$plan = AdminPlan::find($id);

// Using helper method (recommended)
if ($plan->supportsCycle('annual')) {
    // Plan supports annual billing
}

// Direct array check
if (in_array('annual', $plan->billing_cycle)) {
    // Plan supports annual billing
}
```

### API Request
```http
POST /api/admin-plans
Content-Type: application/json

{
  "name": "Enterprise",
  "price": 100,
  "annual_price": 1000,
  "billing_cycle": ["monthly", "annual"],
  "stripe_price_id": ["price_monthly_ent", "price_annual_ent"],
  "course_nos": 50,
  "lectures_nos": 200,
  "platform_fee": 5
}
```

## Benefits of JSON Format

1. **Type Safety:** Arrays are properly typed and validated
2. **Multiple Values:** Can store multiple Stripe Price IDs (one per billing cycle)
3. **Easy Querying:** Use Laravel's JSON query methods
4. **Better Structure:** Clear relationship between billing cycles and price IDs
5. **Extensibility:** Easy to add more billing cycles in the future

## Migration Steps

1. **Run Migration:**
   ```bash
   php artisan migrate
   ```

2. **Re-seed Data (Optional):**
   ```bash
   php artisan db:seed --class=AdminPlanSeeder
   ```

3. **Test API:**
   ```bash
   curl http://localhost:8000/api/admin-plans
   ```

## Important Notes

### Array Order
The order of items in `stripe_price_id` must match the order in `billing_cycle`:

```php
// ✅ Correct
'billing_cycle' => ['monthly', 'annual'],
'stripe_price_id' => ['price_monthly_xxx', 'price_annual_xxx'],

// ❌ Wrong
'billing_cycle' => ['monthly', 'annual'],
'stripe_price_id' => ['price_annual_xxx', 'price_monthly_xxx'],
```

### Empty Arrays
Use empty arrays instead of null:

```php
// ✅ Correct
'stripe_price_id' => [],

// ❌ Avoid
'stripe_price_id' => null,
```

### Validation
Always validate billing cycle support before processing:

```php
if (!$plan->supportsCycle($requestedCycle)) {
    throw new \Exception('Billing cycle not supported');
}
```

## Complete Example: Stripe Checkout

```php
use App\Models\AdminPlan;
use Stripe\Stripe;
use Stripe\Checkout\Session;

public function createCheckout(Request $request)
{
    $plan = AdminPlan::findOrFail($request->plan_id);
    $cycle = $request->billing_cycle; // 'monthly' or 'annual'
    
    // Validate cycle is supported
    if (!$plan->supportsCycle($cycle)) {
        return response()->json(['error' => 'Billing cycle not supported'], 400);
    }
    
    // Get Stripe Price ID
    $stripePriceId = $plan->getStripePriceId($cycle);
    
    if (!$stripePriceId) {
        return response()->json(['error' => 'Stripe not configured'], 400);
    }
    
    // Create checkout session
    Stripe::setApiKey(config('services.stripe.secret'));
    
    $session = Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price' => $stripePriceId,
            'quantity' => 1,
        ]],
        'mode' => 'subscription',
        'success_url' => route('subscription.success'),
        'cancel_url' => route('subscription.cancel'),
    ]);
    
    return response()->json(['checkout_url' => $session->url]);
}
```

## Testing

```php
// Test creating a plan
$plan = AdminPlan::create([
    'name' => 'Test Plan',
    'billing_cycle' => ['monthly', 'annual'],
    'stripe_price_id' => ['price_test_m', 'price_test_a'],
    'price' => 10,
    'annual_price' => 100,
    'user_id' => 1,
    'course_nos' => 5,
    'lectures_nos' => 20,
    'platform_fee' => 10,
]);

// Test helper methods
assert($plan->supportsCycle('monthly') === true);
assert($plan->supportsCycle('quarterly') === false);
assert($plan->getStripePriceId('monthly') === 'price_test_m');
assert($plan->getStripePriceId('annual') === 'price_test_a');
assert($plan->getAvailableCycles() === ['monthly', 'annual']);
```

## Troubleshooting

**Issue:** Fields showing as strings instead of arrays
**Solution:** Ensure model has proper casts:
```php
protected $casts = [
    'billing_cycle' => 'array',
    'stripe_price_id' => 'array',
];
```

**Issue:** Cannot save array data
**Solution:** Pass arrays directly, Laravel will handle JSON encoding:
```php
$plan->billing_cycle = ['monthly', 'annual']; // ✅ Correct
$plan->billing_cycle = json_encode(['monthly', 'annual']); // ❌ Wrong
```

**Issue:** Querying JSON fields not working
**Solution:** Use Laravel's JSON query methods:
```php
AdminPlan::whereJsonContains('billing_cycle', 'annual')->get();
```

## Summary

✅ Both fields are now JSON arrays  
✅ Model has array casts  
✅ Helper methods added for easy access  
✅ Validation updated for arrays  
✅ Seeder updated with array format  
✅ Documentation updated  
✅ Complete usage guide created  

The system is now ready to handle multiple billing cycles and their corresponding Stripe Price IDs in a structured, type-safe manner.
