# Course API Testing Guide - Postman

Complete guide for testing the Course API endpoints using Postman.

---

## 📋 Table of Contents

1. [Setup](#setup)
2. [Authentication](#1-get-authentication-token-first)
3. [Create Course](#2-create-a-course)
4. [Get All Courses](#3-get-all-courses)
5. [Get Single Course](#4-get-single-course)
6. [Update Course](#5-update-a-course)
7. [Delete Course](#6-delete-a-course)
8. [Common Issues](#common-issues--solutions)
9. [Testing Checklist](#testing-checklist)

---

## Setup

**Base URL:** `http://localhost:8000/api` (or your Laravel backend URL)

**Authentication:** Bearer Token (obtained from login)

**Required Headers for All Requests:**
```
Accept: application/json
```

---

## 1. Get Authentication Token First

### POST `/api/login`

**URL:** `http://localhost:8000/api/login`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body (raw JSON):**
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "1|abcdef123456789...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "your-email@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**⚠️ Important:** Copy the `token` value - you'll need it for all subsequent requests!

---

## 2. Create a Course

### POST `/api/courses`

**URL:** `http://localhost:8000/api/courses`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

**Body Type:** `form-data` ⚠️ **NOT raw JSON**

### Form-Data Fields:

| Key | Type | Required | Example Value |
|-----|------|----------|---------------|
| `title` | Text | ✅ Yes | `JavaScript Fundamentals` |
| `description` | Text | ❌ No | `A comprehensive course on JavaScript basics` |
| `lessons` | Text | ❌ No | `[{"title":"Intro","content":"Learn basics","duration_minutes":30}]` |
| `audience` | Text | ❌ No | `Beginners` |
| `level` | Text | ❌ No | `beginner` |
| `duration_hours` | Text | ❌ No | `4` |
| `category` | Text | ❌ No | `Programming` |
| `price` | Text | ❌ No | `49.99` |
| `thumbnail_url` | File | ❌ No | (Select an image file) |

### Example Lessons JSON:
```json
[
  {
    "title": "Introduction to JavaScript",
    "content": "Learn the basics of JavaScript programming including variables, data types, and operators.",
    "duration_minutes": 30
  },
  {
    "title": "Functions and Scope",
    "content": "Deep dive into JavaScript functions, arrow functions, and understanding scope.",
    "duration_minutes": 45
  },
  {
    "title": "Async Programming",
    "content": "Master promises, async/await, and handling asynchronous operations.",
    "duration_minutes": 60
  }
]
```

### Success Response (201):
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "A comprehensive course on JavaScript basics",
    "lessons": [
      {
        "title": "Introduction to JavaScript",
        "content": "Learn the basics of JavaScript programming...",
        "duration_minutes": 30
      },
      {
        "title": "Functions and Scope",
        "content": "Deep dive into JavaScript functions...",
        "duration_minutes": 45
      }
    ],
    "audience": "Beginners",
    "level": "beginner",
    "duration_hours": 4.0,
    "category": "Programming",
    "price": 49.99,
    "thumbnail_url": "https://res.cloudinary.com/your-cloud/image/upload/v123/courses/abc.jpg",
    "created_by": 1,
    "created_at": "2025-01-19T15:00:00.000000Z",
    "updated_at": "2025-01-19T15:00:00.000000Z",
    "creator": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Response (422):
```json
{
  "message": "The title field is required.",
  "errors": {
    "title": ["The title field is required."]
  }
}
```

---

## 3. Get All Courses

### GET `/api/courses`

**URL:** `http://localhost:8000/api/courses`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

### Optional Query Parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `created_by` | Integer | Filter by user ID | `?created_by=1` |
| `category` | String | Filter by category | `?category=Programming` |
| `level` | String | Filter by difficulty level | `?level=beginner` |

### Example URLs:
```
GET /api/courses
GET /api/courses?category=Programming
GET /api/courses?level=beginner
GET /api/courses?created_by=1
GET /api/courses?category=Programming&level=beginner
```

### Success Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "description": "A comprehensive course on JavaScript basics",
      "lessons": [...],
      "audience": "Beginners",
      "level": "beginner",
      "duration_hours": 4.0,
      "category": "Programming",
      "price": 49.99,
      "thumbnail_url": "https://res.cloudinary.com/...",
      "created_by": 1,
      "created_at": "2025-01-19T15:00:00.000000Z",
      "updated_at": "2025-01-19T15:00:00.000000Z",
      "creator": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    {
      "id": 2,
      "title": "Python for Data Science",
      "description": "Learn Python programming for data analysis",
      "lessons": [...],
      "audience": "Intermediate developers",
      "level": "intermediate",
      "duration_hours": 8.0,
      "category": "Programming",
      "price": 79.99,
      "thumbnail_url": "https://res.cloudinary.com/...",
      "created_by": 1,
      "created_at": "2025-01-19T16:00:00.000000Z",
      "updated_at": "2025-01-19T16:00:00.000000Z",
      "creator": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

## 4. Get Single Course

### GET `/api/courses/{id}`

**URL:** `http://localhost:8000/api/courses/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

### Success Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "A comprehensive course on JavaScript basics",
    "lessons": [
      {
        "title": "Introduction to JavaScript",
        "content": "Learn the basics...",
        "duration_minutes": 30
      }
    ],
    "audience": "Beginners",
    "level": "beginner",
    "duration_hours": 4.0,
    "category": "Programming",
    "price": 49.99,
    "thumbnail_url": "https://res.cloudinary.com/...",
    "created_by": 1,
    "created_at": "2025-01-19T15:00:00.000000Z",
    "updated_at": "2025-01-19T15:00:00.000000Z",
    "creator": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Response (404):
```json
{
  "message": "No query results for model [App\\Models\\Course] 999"
}
```

---

## 5. Update a Course

### PUT/POST `/api/courses/{id}`

**URL:** `http://localhost:8000/api/courses/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

**Body Type:** `form-data`

### Form-Data Fields:

| Key | Type | Required | Example Value |
|-----|------|----------|---------------|
| `_method` | Text | ✅ Yes (if using POST) | `PUT` |
| `title` | Text | ❌ No | `Updated Course Title` |
| `description` | Text | ❌ No | `Updated description` |
| `lessons` | Text | ❌ No | `[{"title":"New Lesson","content":"...","duration_minutes":60}]` |
| `audience` | Text | ❌ No | `Advanced developers` |
| `level` | Text | ❌ No | `advanced` |
| `duration_hours` | Text | ❌ No | `6` |
| `category` | Text | ❌ No | `Web Development` |
| `price` | Text | ❌ No | `59.99` |
| `thumbnail_url` | File | ❌ No | (Select new image file) |

**Note:** Only include fields you want to update. Other fields will remain unchanged.

### Success Response (200):
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Course Title",
    "description": "Updated description",
    "lessons": [...],
    "audience": "Advanced developers",
    "level": "advanced",
    "duration_hours": 6.0,
    "category": "Web Development",
    "price": 59.99,
    "thumbnail_url": "https://res.cloudinary.com/...",
    "created_by": 1,
    "created_at": "2025-01-19T15:00:00.000000Z",
    "updated_at": "2025-01-19T17:00:00.000000Z",
    "creator": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Response (403):
```json
{
  "success": false,
  "message": "Unauthorized to update this course"
}
```

---

## 6. Delete a Course

### DELETE `/api/courses/{id}`

**URL:** `http://localhost:8000/api/courses/1`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Accept: application/json
```

### Success Response (200):
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### Error Response (403):
```json
{
  "success": false,
  "message": "Unauthorized to delete this course"
}
```

### Error Response (404):
```json
{
  "message": "No query results for model [App\\Models\\Course] 999"
}
```

---

## Common Issues & Solutions

### ❌ Issue: "Unauthenticated"
**Cause:** Missing or invalid authentication token

**Solution:**
1. Make sure you've logged in and obtained a token
2. Add the header: `Authorization: Bearer YOUR_TOKEN`
3. Check that the token hasn't expired (login again if needed)

---

### ❌ Issue: "The lessons field must be a valid JSON string"
**Cause:** Invalid JSON format in lessons field

**Solution:**
Ensure lessons is a properly formatted JSON string:
```json
[{"title":"Lesson 1","content":"Content here","duration_minutes":30}]
```

**Common mistakes:**
- ❌ Missing quotes around keys
- ❌ Single quotes instead of double quotes
- ❌ Trailing commas
- ❌ Line breaks in the JSON string

**Correct format:**
```json
[{"title":"Intro","content":"Learn basics","duration_minutes":30},{"title":"Advanced","content":"Deep dive","duration_minutes":45}]
```

---

### ❌ Issue: "Unauthorized to update/delete this course"
**Cause:** Trying to modify a course created by another user

**Solution:**
- You can only update/delete courses you created
- Use the same user token that created the course
- Check `created_by` field matches your user ID

---

### ❌ Issue: Image upload fails
**Cause:** Cloudinary configuration or file size/format issues

**Solution:**
1. Check Cloudinary credentials in `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
2. Ensure image is < 5MB
3. Use supported formats: jpeg, png, jpg, gif, webp
4. Test without image first to isolate the issue

---

### ❌ Issue: "The duration_hours field must be a number"
**Cause:** Invalid number format

**Solution:**
In form-data, enter numbers as plain text without quotes:
- ✅ Correct: `4` or `4.5`
- ❌ Wrong: `"4"` or `four`

---

### ❌ Issue: "The price field must be a number"
**Cause:** Invalid price format

**Solution:**
Enter price as decimal number:
- ✅ Correct: `49.99` or `49`
- ❌ Wrong: `$49.99` or `49.99$`

---

## Postman Collection Setup

### Create Collection Structure:
```
📁 Course API
├── 📂 Auth
│   └── Login (Get Token)
├── 📂 Courses
│   ├── Create Course
│   ├── Get All Courses
│   ├── Get Single Course
│   ├── Update Course
│   └── Delete Course
└── 📂 Filters
    ├── Get by Category
    ├── Get by Level
    └── Get by User
```

### Environment Variables (Recommended):

Create a Postman environment named "Course API - Local":

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8000/api` | `http://localhost:8000/api` |
| `token` | (empty) | (set after login) |
| `course_id` | (empty) | (set after creating course) |
| `user_id` | (empty) | (set after login) |

**Usage in requests:**
- URL: `{{base_url}}/courses`
- Header: `Authorization: Bearer {{token}}`
- URL: `{{base_url}}/courses/{{course_id}}`

### Auto-Set Token After Login:

In the Login request, add this to the **Tests** tab:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("user_id", jsonData.user.id);
    console.log("Token saved:", jsonData.token);
}
```

### Auto-Set Course ID After Create:

In the Create Course request, add this to the **Tests** tab:
```javascript
if (pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("course_id", jsonData.data.id);
    console.log("Course ID saved:", jsonData.data.id);
}
```

---

## Example Lessons JSON Templates

### Minimal Lessons:
```json
[
  {"title":"Intro","content":"Welcome","duration_minutes":15},
  {"title":"Basics","content":"Learn fundamentals","duration_minutes":30}
]
```

### Detailed Lessons:
```json
[
  {
    "title": "Introduction to JavaScript",
    "content": "Welcome to JavaScript! In this lesson, you'll learn about the history of JavaScript, its role in web development, and set up your development environment. We'll cover variables, data types, and write your first JavaScript program.",
    "duration_minutes": 45
  },
  {
    "title": "Functions and Scope",
    "content": "Deep dive into JavaScript functions including function declarations, expressions, arrow functions, and IIFE. Learn about scope, closures, and the 'this' keyword. Practice with hands-on exercises.",
    "duration_minutes": 60
  },
  {
    "title": "Async Programming",
    "content": "Master asynchronous JavaScript with callbacks, promises, and async/await. Learn to handle API calls, work with fetch, and manage errors in async code. Build a real-world project using async patterns.",
    "duration_minutes": 75
  },
  {
    "title": "DOM Manipulation",
    "content": "Learn to interact with the Document Object Model (DOM). Select elements, modify content, handle events, and create dynamic web pages. Build interactive UI components.",
    "duration_minutes": 50
  }
]
```

### Programming Course Example:
```json
[
  {
    "title": "Setting Up Your Environment",
    "content": "Install Node.js, VS Code, and essential extensions. Configure your development environment for optimal productivity.",
    "duration_minutes": 20
  },
  {
    "title": "Variables and Data Types",
    "content": "Learn about var, let, const, and different data types in JavaScript. Understand type coercion and best practices.",
    "duration_minutes": 35
  },
  {
    "title": "Control Flow",
    "content": "Master if/else statements, switch cases, and ternary operators. Learn to write clean conditional logic.",
    "duration_minutes": 40
  },
  {
    "title": "Loops and Iteration",
    "content": "Explore for, while, do-while loops, and array methods like forEach, map, filter, and reduce.",
    "duration_minutes": 45
  },
  {
    "title": "Final Project",
    "content": "Build a complete web application using everything you've learned. Includes code review and best practices.",
    "duration_minutes": 90
  }
]
```

---

## Testing Checklist

### Authentication:
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Use token in subsequent requests
- [ ] Test with expired token (should fail)

### Create Course:
- [ ] Create course with all fields
- [ ] Create course with only required fields (title)
- [ ] Create course with image upload
- [ ] Create course without image
- [ ] Create course with lessons JSON
- [ ] Create course without lessons
- [ ] Test validation errors (missing title)

### Read Courses:
- [ ] Get all courses
- [ ] Get single course by ID
- [ ] Get non-existent course (should return 404)
- [ ] Filter by category
- [ ] Filter by level
- [ ] Filter by created_by
- [ ] Combine multiple filters

### Update Course:
- [ ] Update course title
- [ ] Update course description
- [ ] Update course price
- [ ] Update course lessons
- [ ] Update course image
- [ ] Update multiple fields at once
- [ ] Try to update someone else's course (should fail)
- [ ] Update non-existent course (should return 404)

### Delete Course:
- [ ] Delete own course
- [ ] Try to delete someone else's course (should fail)
- [ ] Delete non-existent course (should return 404)
- [ ] Verify course is deleted (GET should return 404)

### Edge Cases:
- [ ] Very long title (255+ characters)
- [ ] Very long description
- [ ] Large lessons array (50+ lessons)
- [ ] Invalid JSON in lessons field
- [ ] Negative price
- [ ] Negative duration_hours
- [ ] Invalid level value
- [ ] Invalid category value
- [ ] Image > 5MB (should fail)
- [ ] Unsupported image format (should fail)

---

## Quick Reference

### Field Types & Validation:

| Field | Type | Validation | Example |
|-------|------|------------|---------|
| `title` | String | Required, max 255 | `"JavaScript Basics"` |
| `description` | Text | Optional | `"Learn JavaScript..."` |
| `lessons` | JSON | Optional, valid JSON | `[{...}]` |
| `audience` | String | Optional, max 255 | `"Beginners"` |
| `level` | String | Optional, max 255 | `"beginner"` |
| `duration_hours` | Float | Optional, numeric, min 0 | `4.5` |
| `category` | String | Optional, max 255 | `"Programming"` |
| `price` | Float | Optional, numeric, min 0 | `49.99` |
| `thumbnail_url` | File | Optional, image, max 5MB | (image file) |

### HTTP Status Codes:

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (create) |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Not allowed to modify resource |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Server Error | Backend error |

---

## Support

If you encounter issues:

1. **Check Laravel logs:** `storage/logs/laravel.log`
2. **Check backend is running:** `php artisan serve`
3. **Verify database connection:** Check `.env` file
4. **Test authentication:** Login endpoint should work first
5. **Check Cloudinary:** Image uploads require valid credentials

---

## Additional Resources

- **Laravel API Documentation:** https://laravel.com/docs/routing#api-routes
- **Postman Documentation:** https://learning.postman.com/docs/getting-started/introduction/
- **Cloudinary Setup:** https://cloudinary.com/documentation

---

**Happy Testing!** 🚀

Last Updated: January 19, 2025
