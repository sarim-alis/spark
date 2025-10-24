# Stripe Keys Management

This document describes the Stripe Keys management system for storing and managing Stripe API credentials for both admins and creators.

## Database Schema

### Table: `stripe_keys`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `stripe_secret_key` | TEXT | Stripe secret key (hidden in API responses) |
| `stripe_api_key` | STRING | Stripe API/publishable key (hidden in API responses) |
| `title` | STRING | Descriptive title for the key set |
| `key_history` | JSON | History of changes made to the keys |
| `user_id` | FOREIGN KEY | References users table (for creator keys) |
| `role` | STRING | Role type: 'admin' or 'creator' |
| `admin_id` | FOREIGN KEY | References users table (for admin-managed keys) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Model: StripeKey

Location: `app/Models/StripeKey.php`

### Relationships

- `user()` - BelongsTo User (for creator role)
- `admin()` - BelongsTo User (for admin role)

### Key Methods

- `isAdminKeys()` - Check if keys belong to an admin
- `isCreatorKeys()` - Check if keys belong to a creator
- `owner()` - Get the owner (either user or admin)
- `addToHistory(array $entry)` - Add an entry to the key history

### Scopes

- `byRole(string $role)` - Filter by role
- `adminKeys()` - Get only admin keys
- `creatorKeys()` - Get only creator keys

## API Endpoints

All endpoints require authentication via Sanctum.

### Base URL: `/api/stripe-keys`

#### 1. Get All Keys
```
GET /api/stripe-keys
```

**Response:**
- Admins: Returns all keys they manage (admin_id = user.id) or own (user_id = user.id && role = admin)
- Creators: Returns only their own keys (user_id = user.id && role = creator)

#### 2. Get Specific Key
```
GET /api/stripe-keys/{id}
```

**Authorization:** User must own or manage the key

#### 3. Create New Keys
```
POST /api/stripe-keys
```

**Request Body:**
```json
{
  "stripe_secret_key": "sk_test_...",
  "stripe_api_key": "pk_test_...",
  "title": "Production Keys",
  "user_id": "optional-user-id" // Only for admins creating keys for creators
}
```

**Behavior:**
- **Creator:** Creates keys for themselves (user_id = creator.id, role = 'creator')
- **Admin (no user_id):** Creates keys for themselves (user_id = admin.id, role = 'admin')
- **Admin (with user_id):** Creates keys for a creator (user_id = specified, admin_id = admin.id, role = 'creator')

#### 4. Update Keys
```
PUT/PATCH /api/stripe-keys/{id}
```

**Request Body:**
```json
{
  "stripe_secret_key": "sk_test_...",
  "stripe_api_key": "pk_test_...",
  "title": "Updated Title"
}
```

**Note:** Changes are tracked in `key_history`

#### 5. Delete Keys
```
DELETE /api/stripe-keys/{id}
```

**Authorization:** User must own or manage the key

#### 6. Get Key History
```
GET /api/stripe-keys/{id}/history
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Production Keys",
    "history": [
      {
        "action": "created",
        "timestamp": "2025-10-24T10:00:00.000Z",
        "by_user_id": "user-uuid"
      },
      {
        "action": "updated",
        "fields": ["stripe_secret_key"],
        "timestamp": "2025-10-24T11:00:00.000Z",
        "by_user_id": "user-uuid"
      }
    ]
  }
}
```

## Security Features

1. **Hidden Sensitive Data:** `stripe_secret_key` and `stripe_api_key` are hidden in API responses by default
2. **Role-Based Access:** Authorization checks ensure users can only access their own keys or keys they manage
3. **Audit Trail:** All changes are tracked in `key_history`
4. **Cascade Delete:** Keys are deleted when the associated user is deleted

## Usage Examples

### Creator Creating Their Own Keys
```php
// POST /api/stripe-keys
{
  "stripe_secret_key": "sk_test_abc123",
  "stripe_api_key": "pk_test_xyz789",
  "title": "My Stripe Keys"
}
```

### Admin Creating Keys for a Creator
```php
// POST /api/stripe-keys
{
  "stripe_secret_key": "sk_test_abc123",
  "stripe_api_key": "pk_test_xyz789",
  "title": "Creator John's Keys",
  "user_id": "creator-user-id"
}
```

### Admin Creating Their Own Keys
```php
// POST /api/stripe-keys
{
  "stripe_secret_key": "sk_test_admin123",
  "stripe_api_key": "pk_test_admin789",
  "title": "Admin Platform Keys"
}
```

## Migration

Run the migration to create the table:
```bash
php artisan migrate
```

The migration file: `database/migrations/2025_10_24_000001_create_stripe_keys_table.php`

## User Model Integration

The User model has been extended with two relationships:

```php
// Get creator's Stripe keys
$user->stripeKeys;

// Get admin's managed Stripe keys
$user->adminStripeKeys;
```
