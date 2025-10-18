# Course Feature Setup Instructions

## Database Migration

Run the following command to create the `courses` table in MySQL:

```bash
php artisan migrate
```

This will create the `courses` table with the following structure:
- `id` (primary key)
- `title` (string)
- `audience` (string, nullable)
- `difficulty` (string, nullable)
- `duration` (string, nullable)
- `category` (string, nullable)
- `created_by` (foreign key to users.id)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## API Endpoints

All course endpoints are protected by `auth:sanctum` middleware and require authentication.

### List Courses
```
GET /api/courses
Query params: created_by, category, difficulty
```

### Create Course
```
POST /api/courses
Body: {
  "title": "Course Title",
  "audience": "Working professionals",
  "difficulty": "beginner",
  "duration": "4 hours",
  "category": "technology"
}
```

### Get Single Course
```
GET /api/courses/{id}
```

### Update Course
```
PUT /api/courses/{id}
Body: (same as create, all fields optional)
```

### Delete Course
```
DELETE /api/courses/{id}
```

## Frontend Integration

The CourseCreator page (`/coursecreator`) now:
1. Collects course data via form (title, audience, difficulty, duration, category)
2. Sends data to backend API when "Save" is clicked
3. Automatically includes the logged-in user's ID as `created_by`
4. Redirects to "My Courses" page on success

## Dropdown Values

### Audience
- Complete beginners
- Working professionals
- Students and academics
- Entrepreneurs
- Freelancers
- Career changers

### Difficulty
- beginner
- intermediate
- advanced

### Category
- business
- technology
- design
- marketing
- personal_development
- health
- education
- arts

### Duration
- 2 hours
- 4 hours
- 6 hours
- 8 hours
- 12 hours
- 16+ hours

## Testing

1. Login to the application
2. Navigate to Dashboard
3. Click "Create New Course"
4. Fill in the form with course details
5. Click "Generate Course with AI"
6. Review the generated course preview
7. Click "Save Course"
8. Course should be saved to database and you'll be redirected to "My Courses"

## Files Created/Modified

### Backend
- ✅ `database/migrations/2025_01_18_000000_create_courses_table.php` (NEW)
- ✅ `app/Models/Course.php` (NEW)
- ✅ `app/Models/User.php` (MODIFIED - added courses relationship)
- ✅ `app/Http/Controllers/CourseController.php` (NEW)
- ✅ `routes/api.php` (MODIFIED - added course routes)

### Frontend
- ✅ `src/services/courseApi.js` (NEW)
- ✅ `src/pages/CourseCreator.jsx` (MODIFIED - integrated with backend API)
- ✅ `src/pages/Dashboard.jsx` (MODIFIED - fixed "Create New Course" button navigation)
