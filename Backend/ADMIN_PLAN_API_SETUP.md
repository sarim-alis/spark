# Admin Plan API Setup - Complete

## ✅ Backend Setup

### 1. Routes Configured
**File:** `routes/api.php`
- Added: `require __DIR__.'/admin_plan_routes.php';`

**File:** `routes/admin_plan_routes.php`
- ✅ `GET /api/admin-plans` - Get all plans (public)
- ✅ `GET /api/admin-plans/{id}` - Get specific plan (public)
- ✅ `POST /api/admin-plans/{id}/calculate-fee` - Calculate platform fee (public)
- ✅ `POST /api/admin-plans` - Create plan (admin only, requires auth)
- ✅ `PUT /api/admin-plans/{id}` - Update plan (admin only, requires auth)
- ✅ `DELETE /api/admin-plans/{id}` - Delete plan (admin only, requires auth)

### 2. Controller
**File:** `app/Http/Controllers/AdminPlanController.php`
- ✅ All CRUD operations implemented
- ✅ Admin authorization checks
- ✅ Validation rules for JSON fields
- ✅ Platform fee calculation

### 3. Model
**File:** `app/Models/AdminPlan.php`
- ✅ All fields with proper casts
- ✅ Helper methods for billing cycles and Stripe
- ✅ Relationship with User model

## ✅ Frontend Setup

### 1. API Service
**File:** `src/services/api.js`

Added to `adminAPI` object:
```javascript
// Admin Plan management
getAllPlans: () => api.get('/admin-plans'),
getPlan: (id) => api.get(`/admin-plans/${id}`),
createPlan: (data) => api.post('/admin-plans', data),
updatePlan: (id, data) => api.put(`/admin-plans/${id}`, data),
deletePlan: (id) => api.delete(`/admin-plans/${id}`),
calculateFee: (id, coursePrice) => api.post(`/admin-plans/${id}/calculate-fee`, { course_price: coursePrice })
```

### 2. Admin Subscription Page
**File:** `src/pages/Admin/AdminSubscription.jsx`
- ✅ Fetches plans using `adminAPI.getAllPlans()`
- ✅ Deletes plans using `adminAPI.deletePlan()`
- ✅ Beautiful card-based UI
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Empty state

## Usage Examples

### Backend - Test with cURL

```bash
# Get all plans
curl http://localhost:8000/api/admin-plans

# Get specific plan
curl http://localhost:8000/api/admin-plans/1

# Create plan (requires auth token)
curl -X POST http://localhost:8000/api/admin-plans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium",
    "price": 10,
    "annual_price": 100,
    "billing_cycle": ["monthly", "annual"],
    "stripe_price_id": ["price_m_xxx", "price_a_xxx"],
    "course_nos": 10,
    "lectures_nos": 30,
    "platform_fee": 10
  }'

# Delete plan (requires auth token)
curl -X DELETE http://localhost:8000/api/admin-plans/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend - Usage in Components

```javascript
import { adminAPI } from '@/services/api';

// Fetch all plans
const fetchPlans = async () => {
  try {
    const response = await adminAPI.getAllPlans();
    console.log(response.data.data); // Array of plans
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create a plan
const createPlan = async (planData) => {
  try {
    const response = await adminAPI.createPlan(planData);
    console.log('Plan created:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Delete a plan
const deletePlan = async (planId) => {
  try {
    await adminAPI.deletePlan(planId);
    console.log('Plan deleted');
  } catch (error) {
    console.error('Error:', error);
  }
};

// Calculate platform fee
const calculateFee = async (planId, coursePrice) => {
  try {
    const response = await adminAPI.calculateFee(planId, coursePrice);
    console.log('Fee calculation:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Testing Checklist

- [ ] Backend server running (`php artisan serve`)
- [ ] Frontend dev server running (`npm run dev`)
- [ ] Database migrated (`php artisan migrate`)
- [ ] Seeder run (`php artisan db:seed --class=AdminPlanSeeder`)
- [ ] Routes accessible (test with browser/Postman)
- [ ] Frontend can fetch plans
- [ ] Frontend can delete plans (with admin auth)
- [ ] Toast notifications working

## Troubleshooting

### Issue: 404 Not Found on /api/admin-plans
**Solution:** Make sure `require __DIR__.'/admin_plan_routes.php';` is added to `routes/api.php`

### Issue: CORS errors
**Solution:** Check Laravel CORS configuration in `config/cors.php`

### Issue: Unauthorized errors
**Solution:** Ensure you're logged in as admin and token is being sent in headers

### Issue: Empty data array
**Solution:** Run the seeder: `php artisan db:seed --class=AdminPlanSeeder`

## Next Steps

1. **Create Plan Modal** - Add UI for creating new plans
2. **Edit Plan Modal** - Add UI for editing existing plans
3. **Stripe Integration** - Connect with Stripe for payments
4. **Plan Assignment** - Allow admins to assign plans to creators
5. **Analytics** - Track plan subscriptions and revenue
