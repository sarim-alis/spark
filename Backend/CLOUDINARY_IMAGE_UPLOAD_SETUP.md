# Cloudinary Image Upload Setup Guide

## Step 1: Install Cloudinary PHP SDK

In the Backend directory, run:

```bash
composer require cloudinary/cloudinary_php
```

## Step 2: Configure Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=dgk3gaml0
CLOUDINARY_API_KEY=193114185223458
CLOUDINARY_API_SECRET=oPA92CNnlT4jVi0FQ710q6K2Gn8
```

## Step 3: Run Migration

If you already ran the migration before, you need to refresh it:

```bash
php artisan migrate:refresh
```

OR create a new migration to add the column:

```bash
php artisan make:migration add_course_image_to_courses_table
```

Then add this in the migration file:

```php
public function up()
{
    Schema::table('courses', function (Blueprint $table) {
        $table->text('course_image')->nullable()->after('category');
    });
}

public function down()
{
    Schema::table('courses', function (Blueprint $table) {
        $table->dropColumn('course_image');
    });
}
```

Then run:
```bash
php artisan migrate
```

## What Was Changed

### Backend Files Modified:

1. **Migration** - `database/migrations/2025_01_18_000000_create_courses_table.php`
   - Added `course_image` column (text, nullable)

2. **Course Model** - `app/Models/Course.php`
   - Added `course_image` to fillable array

3. **CourseController** - `app/Http/Controllers/CourseController.php`
   - Added Cloudinary import
   - Updated `store()` method to handle image upload
   - Updated `update()` method to handle image upload
   - Validates image: jpeg, png, jpg, gif, webp (max 5MB)
   - Uploads to Cloudinary folder: `courses/`

### Frontend Files Modified:

1. **CoursePromptForm** - `src/components/course-creator/CoursePromptForm.jsx`
   - Added `courseImage` to form state
   - Added file input field below Category
   - Shows selected filename

2. **CourseCreator** - `src/pages/CourseCreator.jsx`
   - Updated `handleSave()` to use FormData
   - Appends image file to FormData as `course_image`

3. **courseApi** - `src/services/courseApi.js`
   - Updated `create()` and `update()` to handle FormData
   - Sets proper `multipart/form-data` header

## Testing in Postman

### Create Course with Image

**Request:**
```
POST http://localhost:8000/api/courses
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

**Body (form-data):**
- `title`: JavaScript Basics
- `audience`: Complete beginners
- `difficulty`: beginner
- `duration`: 4 hours
- `category`: technology
- `course_image`: [Select File]

**Response:**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 1,
    "title": "JavaScript Basics",
    "audience": "Complete beginners",
    "difficulty": "beginner",
    "duration": "4 hours",
    "category": "technology",
    "course_image": "https://res.cloudinary.com/dgk3gaml0/image/upload/v1234567890/courses/abc123.jpg",
    "created_by": 1,
    "created_at": "2025-01-18T00:00:00.000000Z",
    "updated_at": "2025-01-18T00:00:00.000000Z"
  }
}
```

## Testing in Frontend

1. Login to the application
2. Navigate to Dashboard → "Create New Course"
3. Fill in all fields including uploading an image
4. Click "Generate Course with AI"
5. Click "Save Course"
6. Image will be uploaded to Cloudinary and URL saved in database

## Image Storage

- **Cloudinary Folder:** `courses/`
- **Max Size:** 5MB
- **Allowed Formats:** jpeg, png, jpg, gif, webp
- **URL Format:** `https://res.cloudinary.com/dgk3gaml0/image/upload/v.../courses/filename.jpg`

## Error Handling

- **No image selected:** Course will be created without image (nullable)
- **Invalid format:** Returns 422 validation error
- **Upload fails:** Returns 500 error with message
- **File too large:** Returns 422 validation error (max 5MB)
