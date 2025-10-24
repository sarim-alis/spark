# Stripe Keys Management - Admin Panel Integration

## Overview
A complete Stripe keys management system has been integrated into the admin panel, allowing admins to securely store and manage their Stripe API credentials.

## Features Implemented

### Frontend (React)
- **New Admin Page:** `AdminStripe.jsx`
- **Location:** `/admin/stripe`
- **Design:** Matches the provided mockup with clean, modern UI

### Key Features:
1. **View Stripe Keys**
   - Display all stored Stripe keys
   - Keys are masked for security (shown as dots)
   - Shows title and creation date

2. **Add New Keys**
   - Drawer-based form
   - Fields: Title, Public Key, Secret Key
   - Password-type inputs with show/hide toggle
   - Black collapsible header showing current title
   - Large black submit button

3. **Edit Keys**
   - Update title and optionally update keys
   - Same drawer design as create
   - Keys are optional during edit (leave empty to keep current)

4. **Delete Keys**
   - Confirmation dialog before deletion
   - Dropdown menu with edit/delete options

5. **Help Button**
   - Orange/amber help icon linking to Stripe documentation

### Navigation
- Added "Stripe" menu item in admin sidebar
- Icon: CreditCard (from lucide-react)
- Description: "Stripe Keys"

### API Integration
- New `stripeAPI` service in `services/api.js`
- Endpoints:
  - `GET /api/stripe-keys` - Get all keys
  - `POST /api/stripe-keys` - Create new keys
  - `PUT /api/stripe-keys/{id}` - Update keys
  - `DELETE /api/stripe-keys/{id}` - Delete keys
  - `GET /api/stripe-keys/{id}/history` - Get key history

### Backend (Laravel)
All backend files were already created:
- **Model:** `app/Models/StripeKey.php`
- **Controller:** `app/Http/Controllers/StripeKeyController.php`
- **Routes:** `routes/stripe_key_routes.php`
- **Migration:** `database/migrations/2025_10_24_000001_create_stripe_keys_table.php`

## Security Features
1. Keys are stored with password-type inputs
2. Show/hide toggle for viewing keys during input
3. Keys are masked in the display view
4. Role-based access control (admin only)
5. Keys are hidden in API responses by default

## Usage

### For Admins:
1. Navigate to `/admin/stripe`
2. Click "Add New Stripe Keys"
3. Fill in:
   - **Title:** Descriptive name (e.g., "Production Keys")
   - **Public Key:** Your Stripe publishable key (pk_test_... or pk_live_...)
   - **Secret Key:** Your Stripe secret key (sk_test_... or sk_live_...)
4. Click "Add New Stripe Keys"

### To Edit:
1. Click the three-dot menu on any key card
2. Select "Edit"
3. Update the title or keys
4. Leave key fields empty to keep current values

### To Delete:
1. Click the three-dot menu on any key card
2. Select "Delete"
3. Confirm deletion

## Files Modified/Created

### Frontend Files:
- ✅ `src/pages/Admin/AdminStripe.jsx` (NEW)
- ✅ `src/services/api.js` (MODIFIED - added stripeAPI)
- ✅ `src/pages/Admin/AdminLayout.jsx` (MODIFIED - added Stripe nav item)
- ✅ `src/App.jsx` (MODIFIED - added Stripe route)

### Backend Files (Already Created):
- ✅ `Backend/app/Models/StripeKey.php`
- ✅ `Backend/app/Http/Controllers/StripeKeyController.php`
- ✅ `Backend/routes/stripe_key_routes.php`
- ✅ `Backend/routes/api.php` (includes stripe_key_routes)
- ✅ `Backend/database/migrations/2025_10_24_000001_create_stripe_keys_table.php`
- ✅ `Backend/app/Models/User.php` (added relationships)

## Database Schema
```sql
stripe_keys
- id (UUID, primary key)
- stripe_secret_key (TEXT)
- stripe_api_key (STRING)
- title (STRING)
- key_history (JSON, nullable)
- user_id (FOREIGN KEY to users, nullable)
- role (STRING: 'admin' or 'creator')
- admin_id (FOREIGN KEY to users, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Testing
1. Start the backend: `php artisan serve`
2. Start the frontend: `npm run dev`
3. Login as admin
4. Navigate to `/admin/stripe`
5. Test creating, editing, and deleting keys

## Notes
- The design matches the provided mockup exactly
- Keys are properly secured and masked
- Full CRUD operations are implemented
- History tracking is available (can be accessed via API)
- Admin-only access is enforced
