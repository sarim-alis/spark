# JSON Fields Usage Guide

## Overview

The `billing_cycle` and `stripe_price_id` fields in the `admin_plans` table are now JSON arrays, allowing for flexible storage of multiple billing options and their corresponding Stripe Price IDs.

## Field Structure

### billing_cycle (JSON Array)
Stores the available billing cycles for a plan.

**Format:**
```json
["monthly", "annual"]
```

**Examples:**
```json
// Monthly only
["monthly"]

// Both monthly and annual
["monthly", "annual"]

// Annual only
["annual"]
```

### stripe_price_id (JSON Array)
Stores Stripe Price IDs corresponding to each billing cycle. The order should match the `billing_cycle` array.

**Format:**
```json
["price_monthly_id", "price_annual_id"]
```

**Examples:**
```json
// Monthly only
["price_1234567890abcdef"]

// Both monthly and annual
["price_monthly_xxxxx", "price_annual_xxxxx"]

// Empty (no Stripe integration yet)
[]
```

## API Usage

### Creating a Plan with JSON Fields

```http
POST /api/admin-plans
Content-Type: application/json
Authorization: Bearer {token}

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

### Response Example

```json
{
  "success": true,
  "message": "Admin plan created successfully",
  "data": {
    "id": 1,
    "name": "Premium",
    "icon": "/icons/premium.svg",
    "type": "monthly",
    "price": "10.00",
    "annual_price": "100.00",
    "billing_cycle": ["monthly", "annual"],
    "stripe_price_id": ["price_monthly_xxxxx", "price_annual_xxxxx"],
    "user_id": 1,
    "course_nos": 10,
    "lectures_nos": 30,
    "platform_fee": "10.00",
    "is_active": true,
    "created_at": "2025-10-24T00:00:00.000000Z",
    "updated_at": "2025-10-24T00:00:00.000000Z"
  }
}
```

## PHP Usage

### Accessing JSON Fields

```php
use App\Models\AdminPlan;

$plan = AdminPlan::find(1);

// Access billing_cycle array
$billingCycles = $plan->billing_cycle;
// Returns: ["monthly", "annual"]

// Check if plan supports monthly billing
if (in_array('monthly', $plan->billing_cycle)) {
    echo "Monthly billing available";
}

// Access stripe_price_id array
$stripePriceIds = $plan->stripe_price_id;
// Returns: ["price_monthly_xxxxx", "price_annual_xxxxx"]

// Get monthly Stripe Price ID
$monthlyPriceId = $plan->stripe_price_id[0] ?? null;

// Get annual Stripe Price ID
$annualPriceId = $plan->stripe_price_id[1] ?? null;
```

### Creating a Plan Programmatically

```php
use App\Models\AdminPlan;

$plan = AdminPlan::create([
    'name' => 'Enterprise',
    'icon' => '/icons/enterprise.svg',
    'type' => 'monthly',
    'price' => 200.00,
    'annual_price' => 2000.00,
    'billing_cycle' => ['monthly', 'annual'],
    'stripe_price_id' => [
        'price_monthly_enterprise',
        'price_annual_enterprise'
    ],
    'user_id' => auth()->id(),
    'course_nos' => 100,
    'lectures_nos' => 500,
    'platform_fee' => 5.00,
    'is_active' => true,
]);
```

### Updating JSON Fields

```php
$plan = AdminPlan::find(1);

// Update billing cycles
$plan->billing_cycle = ['monthly', 'annual', 'quarterly'];
$plan->save();

// Update Stripe Price IDs
$plan->stripe_price_id = [
    'price_monthly_new',
    'price_annual_new',
    'price_quarterly_new'
];
$plan->save();

// Or use update method
$plan->update([
    'billing_cycle' => ['monthly', 'annual'],
    'stripe_price_id' => ['price_m_xxx', 'price_a_xxx'],
]);
```

### Querying Plans by Billing Cycle

```php
// Get plans that support annual billing
$annualPlans = AdminPlan::whereJsonContains('billing_cycle', 'annual')->get();

// Get plans that support monthly billing
$monthlyPlans = AdminPlan::whereJsonContains('billing_cycle', 'monthly')->get();

// Get plans with specific Stripe Price ID
$plan = AdminPlan::whereJsonContains('stripe_price_id', 'price_xxxxx')->first();
```

## Stripe Integration Example

### Complete Checkout Flow

```php
use App\Models\AdminPlan;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class SubscriptionController extends Controller
{
    public function createCheckout(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:admin_plans,id',
            'billing_cycle' => 'required|in:monthly,annual',
        ]);

        $plan = AdminPlan::findOrFail($request->plan_id);
        $billingCycle = $request->billing_cycle;

        // Verify plan supports the requested billing cycle
        if (!in_array($billingCycle, $plan->billing_cycle)) {
            return response()->json([
                'error' => 'This plan does not support ' . $billingCycle . ' billing'
            ], 400);
        }

        // Get the index of the billing cycle
        $cycleIndex = array_search($billingCycle, $plan->billing_cycle);
        
        // Get the corresponding Stripe Price ID
        $stripePriceId = $plan->stripe_price_id[$cycleIndex] ?? null;

        if (!$stripePriceId) {
            return response()->json([
                'error' => 'Stripe Price ID not configured for this billing cycle'
            ], 400);
        }

        // Create Stripe Checkout Session
        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $stripePriceId,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('subscription.cancel'),
            'client_reference_id' => auth()->id(),
            'metadata' => [
                'plan_id' => $plan->id,
                'billing_cycle' => $billingCycle,
            ],
        ]);

        return response()->json([
            'checkout_url' => $session->url,
            'session_id' => $session->id,
        ]);
    }
}
```

## Frontend Integration Example

### React/JavaScript

```javascript
// Fetch plans
const fetchPlans = async () => {
  const response = await fetch('/api/admin-plans');
  const data = await response.json();
  return data.data;
};

// Display plan with billing options
const PlanCard = ({ plan }) => {
  const [selectedCycle, setSelectedCycle] = useState('monthly');

  const getPrice = () => {
    return selectedCycle === 'annual' ? plan.annual_price : plan.price;
  };

  const getStripePriceId = () => {
    const cycleIndex = plan.billing_cycle.indexOf(selectedCycle);
    return plan.stripe_price_id[cycleIndex];
  };

  return (
    <div className="plan-card">
      <h3>{plan.name}</h3>
      
      {/* Billing cycle selector */}
      {plan.billing_cycle.length > 1 && (
        <div className="billing-toggle">
          {plan.billing_cycle.map(cycle => (
            <button
              key={cycle}
              onClick={() => setSelectedCycle(cycle)}
              className={selectedCycle === cycle ? 'active' : ''}
            >
              {cycle}
            </button>
          ))}
        </div>
      )}

      <div className="price">
        ${getPrice()}/{selectedCycle}
      </div>

      <button onClick={() => subscribe(plan.id, selectedCycle)}>
        Subscribe
      </button>
    </div>
  );
};

// Subscribe function
const subscribe = async (planId, billingCycle) => {
  const response = await fetch('/api/subscriptions/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      billing_cycle: billingCycle,
    }),
  });

  const data = await response.json();
  
  // Redirect to Stripe Checkout
  window.location.href = data.checkout_url;
};
```

## Best Practices

### 1. Array Order Consistency
Always maintain the same order in `billing_cycle` and `stripe_price_id` arrays:

```php
// ✅ Correct
'billing_cycle' => ['monthly', 'annual'],
'stripe_price_id' => ['price_monthly_xxx', 'price_annual_xxx'],

// ❌ Wrong - order doesn't match
'billing_cycle' => ['monthly', 'annual'],
'stripe_price_id' => ['price_annual_xxx', 'price_monthly_xxx'],
```

### 2. Validation
Always validate that the requested billing cycle is supported:

```php
if (!in_array($requestedCycle, $plan->billing_cycle)) {
    throw new \Exception('Billing cycle not supported');
}
```

### 3. Empty Arrays
Use empty arrays instead of null for plans without Stripe integration:

```php
// ✅ Correct
'stripe_price_id' => [],

// ❌ Avoid
'stripe_price_id' => null,
```

### 4. Helper Methods
Create helper methods in your model for common operations:

```php
// In AdminPlan model
public function getStripePriceId(string $cycle): ?string
{
    $index = array_search($cycle, $this->billing_cycle ?? []);
    return $index !== false ? ($this->stripe_price_id[$index] ?? null) : null;
}

public function supportsCycle(string $cycle): bool
{
    return in_array($cycle, $this->billing_cycle ?? []);
}

// Usage
$stripePriceId = $plan->getStripePriceId('annual');
if ($plan->supportsCycle('monthly')) {
    // ...
}
```

## Migration Notes

If you have existing data with text fields, you'll need to migrate it:

```php
// Migration to convert existing text data to JSON
use Illuminate\Support\Facades\DB;

// Convert billing_cycle from "monthly,annual" to ["monthly", "annual"]
DB::table('admin_plans')->get()->each(function ($plan) {
    if ($plan->billing_cycle && !is_array(json_decode($plan->billing_cycle))) {
        $cycles = explode(',', $plan->billing_cycle);
        DB::table('admin_plans')
            ->where('id', $plan->id)
            ->update(['billing_cycle' => json_encode($cycles)]);
    }
});
```

## Troubleshooting

### Issue: JSON not being parsed correctly
**Solution:** Ensure the model has the proper cast:
```php
protected $casts = [
    'billing_cycle' => 'array',
    'stripe_price_id' => 'array',
];
```

### Issue: Cannot query JSON fields
**Solution:** Use Laravel's JSON query methods:
```php
// Use whereJsonContains
$plans = AdminPlan::whereJsonContains('billing_cycle', 'annual')->get();
```

### Issue: Empty arrays showing as null
**Solution:** Set default values in migration or model:
```php
// In migration
$table->json('billing_cycle')->default('[]');

// Or in model
protected $attributes = [
    'billing_cycle' => '[]',
    'stripe_price_id' => '[]',
];
```
