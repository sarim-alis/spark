# Final Database Structure

## ✅ Current Tables (Only 4)

1. **`users`** - User accounts
2. **`course`** - Courses (singular table name!)
3. **`personal_access_tokens`** - API authentication (Sanctum)
4. **`migrations`** - Laravel migration tracking

## ✅ Active Models (Only 2)

1. **`App\Models\User`** → uses `users` table
2. **`App\Models\Course`** → uses `course` table (singular!)

## ✅ Migrations (Clean!)

1. `0001_01_01_000000_create_users_table.php` - Creates users table only
2. `2019_12_14_000001_create_personal_access_tokens_table.php` - API tokens
3. `2025_01_18_000000_create_courses_table.php` - Creates course table (singular)
4. `2025_01_19_000000_rename_courses_to_course.php` - Renamed courses → course
5. `2025_01_19_000001_drop_unused_tables.php` - Dropped unused Laravel tables

## ❌ Removed Tables

The following Laravel default tables were removed:
- ❌ `cache` - Not needed
- ❌ `cache_locks` - Not needed
- ❌ `failed_jobs` - Not needed
- ❌ `job_batches` - Not needed
- ❌ `jobs` - Not needed
- ❌ `password_reset_tokens` - Not needed (using API tokens)
- ❌ `sessions` - Not needed (using API tokens)

## Database Schema

### `users` Table
```sql
- id (bigint, primary key)
- name (varchar)
- email (varchar, unique)
- email_verified_at (timestamp, nullable)
- password (varchar)
- remember_token (varchar, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### `course` Table (Singular!)
```sql
- id (bigint, primary key)
- title (varchar)
- audience (varchar, nullable)
- difficulty (varchar, nullable)
- duration (varchar, nullable)
- category (varchar, nullable)
- course_image (text, nullable)
- created_by (bigint, foreign key → users.id)
- created_at (timestamp)
- updated_at (timestamp)
```

### `personal_access_tokens` Table
```sql
- id (bigint, primary key)
- tokenable_type (varchar)
- tokenable_id (bigint)
- name (varchar)
- token (varchar, unique)
- abilities (text, nullable)
- last_used_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## API Routes (Plural - Correct!)

```php
GET    /api/courses          - List all courses
POST   /api/courses          - Create new course
GET    /api/courses/{id}     - Get single course
PUT    /api/courses/{id}     - Update course
DELETE /api/courses/{id}     - Delete course
```

**Note:** API uses plural `/courses` (REST convention) but database table is singular `course` - this is standard practice!

## Verify in PHPMyAdmin

You should now see only these 4 tables:
1. ✅ `course`
2. ✅ `migrations`
3. ✅ `personal_access_tokens`
4. ✅ `users`

If you still see old tables, **refresh PHPMyAdmin** (F5 or click refresh icon).

## Fresh Install Command

If you ever need to recreate the database from scratch:

```bash
php artisan migrate:fresh --seed
```

This will:
- Drop all tables
- Run all migrations
- Create only the 4 tables above
- Seed with test data (if seeders exist)

## Everything is Clean! 🎉

Your database is now minimal and optimized with:
- ✅ Only 2 models (User & Course)
- ✅ Only 4 tables (users, course, personal_access_tokens, migrations)
- ✅ Singular table name for course
- ✅ All unnecessary Laravel tables removed
- ✅ Clean migration history
