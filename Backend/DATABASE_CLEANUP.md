# Database Cleanup - Rename courses to course

## Changes Made

### ✅ Completed

1. **Course Model** - Added `protected $table = 'course';` to use singular table name
2. **Migration** - Updated `create_courses_table.php` to create `course` table instead of `courses`
3. **Removed Migration** - Deleted `0001_01_01_000001_create_cache_table.php` (not needed)

### 📋 Remaining Migrations

**Keep These:**
- ✅ `0001_01_01_000000_create_users_table.php` - User authentication
- ✅ `2019_12_14_000001_create_personal_access_tokens_table.php` - Sanctum API tokens
- ✅ `2025_01_18_000000_create_courses_table.php` - Course table (now creates `course`)

**Optional to Remove:**
- ❌ `0001_01_01_000002_create_jobs_table.php` - Laravel queue jobs (not used)

## Apply Changes

### Option 1: Fresh Migration (⚠️ Deletes all data)

```bash
php artisan migrate:fresh
```

This will:
- Drop all tables
- Re-run all migrations
- Create `course` table (singular)
- Create `users` table
- Create `personal_access_tokens` table

### Option 2: Rename Existing Table (✅ Keeps data)

```sql
RENAME TABLE courses TO course;
```

Or create a migration:

```bash
php artisan make:migration rename_courses_to_course
```

Then add:

```php
public function up()
{
    Schema::rename('courses', 'course');
}

public function down()
{
    Schema::rename('course', 'courses');
}
```

Run: `php artisan migrate`

## Verify Changes

After migration, check:

```bash
php artisan tinker
```

```php
// Should work with singular table name
\App\Models\Course::count();
\DB::select('SHOW TABLES');
```

## Models Summary

**Active Models:**
- ✅ `App\Models\User` - Uses `users` table
- ✅ `App\Models\Course` - Uses `course` table (singular)

**Removed Models:**
- None (only User and Course exist)

## API Routes

Routes still use plural `/courses` endpoint (this is correct):
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/{id}` - Get course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

The table name is `course` but the API endpoint is `/courses` - this is standard REST convention!
