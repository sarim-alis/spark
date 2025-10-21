# Interview Prep Setup Guide

## Backend Setup

### 1. Run Migration
Run the following command in your Backend directory to create the `interview_prep` table:

```bash
php artisan migrate
```

This will create the `interview_prep` table with the following columns:
- `id` (primary key)
- `user_email` (foreign key to users.email)
- `job_role`
- `course_ids` (JSON array)
- `difficulty` (beginner/intermediate/advanced)
- `interview_type` (technical/behavioral/mixed)
- `sessions` (JSON array)
- `total_sessions` (integer)
- `average_score` (float)
- `timestamps` (created_at, updated_at)

### 2. Files Created

#### Model
- **Location**: `Backend/app/Models/InterviewPrep.php`
- **Purpose**: Eloquent model for interview prep data
- **Relationships**: Belongs to User (via user_email)

#### Migration
- **Location**: `Backend/database/migrations/2025_01_21_000000_create_interview_prep_table.php`
- **Purpose**: Creates the interview_prep table

#### Controller
- **Location**: `Backend/app/Http/Controllers/InterviewPrepController.php`
- **Methods**:
  - `index()` - List all interview preps (with optional user_email filter)
  - `store()` - Create new interview prep
  - `show()` - Get specific interview prep
  - `update()` - Update interview prep
  - `destroy()` - Delete interview prep
  - `getUserInterviewPrep()` - Get authenticated user's interview prep

#### Routes
- **Location**: `Backend/routes/api.php`
- **Endpoints** (all require authentication):
  - `GET /api/interview-prep` - List all
  - `POST /api/interview-prep` - Create new
  - `GET /api/interview-prep/me` - Get current user's prep
  - `GET /api/interview-prep/{id}` - Get specific prep
  - `PUT /api/interview-prep/{id}` - Update prep
  - `PATCH /api/interview-prep/{id}` - Partial update
  - `DELETE /api/interview-prep/{id}` - Delete prep

## Frontend Setup

### Files Created/Updated

#### AI Interview Generator Service
- **Location**: `Frontend/coursespark/src/services/aiInterviewGenerator.js`
- **Purpose**: Generate interview questions and feedback using OpenAI API
- **Functions**:
  - `generateInterviewQuestionsWithAI()` - Generates 5 interview questions based on job role, courses, difficulty, and type
  - `generateInterviewFeedbackWithAI()` - Provides AI feedback on user's answer with rating, strengths, and improvements
- **Features**:
  - Uses OpenAI GPT-3.5-turbo model
  - Automatic fallback to mock data if API fails or quota exceeded
  - Handles JSON extraction from AI responses
  - Configurable via `USE_API` flag and `VITE_OPENAI_API_KEY`

#### InterviewPrep Component
- **Location**: `Frontend/coursespark/src/pages/InterviewPrep.jsx`
- **Changes**:
  - Replaced mock data with real API calls
  - Uses `localStorage.getItem('auth_user')` to get logged-in user email
  - Fetches only published courses created by the user
  - Stores interview prep data in database via API
  - Uses axios for API communication
  - **Integrated AI interview question generation**
  - **Integrated AI feedback generation**

### How It Works

1. **User Authentication**: Gets user email from `localStorage` (auth_user)
2. **Load Courses**: Fetches user's published courses using `Course.filter()`
3. **Load Interview Prep**: Fetches user's interview prep data from API
4. **Start Session**: 
   - Creates/updates interview prep record with job role, courses, difficulty, and type
   - **Generates AI-powered interview questions** using OpenAI based on:
     - Job role (e.g., Frontend Developer)
     - Course topics
     - Difficulty level (beginner/intermediate/advanced)
     - Interview type (technical/behavioral/mixed)
5. **Submit Answers**: 
   - **Provides AI-powered feedback** on user's answer
   - Rates answer from 1-10
   - Identifies strengths
   - Suggests improvements
   - Gives detailed constructive feedback
6. **Finish Session**: Updates interview prep with session results and statistics

## Testing

### 1. Test Backend API

```bash
# Get user's interview prep
curl -X GET http://localhost:8000/api/interview-prep/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Create interview prep
curl -X POST http://localhost:8000/api/interview-prep \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_email": "user@example.com",
    "job_role": "Frontend Developer",
    "course_ids": ["1", "2"],
    "difficulty": "intermediate",
    "interview_type": "mixed"
  }'
```

### 2. Test Frontend

1. Login to the application
2. Navigate to "Interview Prep" from sidebar
3. Fill out the form:
   - Job Role: e.g., "Frontend Developer"
   - Select a published course
   - Choose difficulty and interview type
4. Click "Start Interview Practice"
5. Answer questions and submit
6. Complete the session

## Environment Variables

Make sure you have the following in your `.env` files:

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000/api
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: Get your OpenAI API key from https://platform.openai.com/api-keys

### Backend `.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Database Schema

```sql
CREATE TABLE `interview_prep` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `job_role` varchar(255) DEFAULT NULL,
  `course_ids` json DEFAULT NULL,
  `difficulty` varchar(255) DEFAULT 'intermediate',
  `interview_type` varchar(255) DEFAULT 'mixed',
  `sessions` json DEFAULT NULL,
  `total_sessions` int DEFAULT 0,
  `average_score` double DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `interview_prep_user_email_index` (`user_email`),
  CONSTRAINT `interview_prep_user_email_foreign` 
    FOREIGN KEY (`user_email`) 
    REFERENCES `users` (`email`) 
    ON DELETE CASCADE
);
```

## Notes

- **AI-Powered**: Uses OpenAI GPT-3.5-turbo for generating questions and feedback
- **Automatic Fallback**: Falls back to mock data if OpenAI API fails or quota exceeded
- **Smart Question Generation**: Questions are tailored to job role, course topics, difficulty, and interview type
- **Intelligent Feedback**: AI analyzes answers and provides rating, strengths, and improvement suggestions
- All interview prep data is tied to user email (from localStorage)
- Only published courses are shown in the course selection
- Sessions are stored as JSON arrays in the database
- Statistics (total_sessions, average_score) are calculated automatically

## AI Features

### Question Generation
- Generates 5 unique interview questions per session
- Questions are contextual to:
  - Selected job role
  - Course topics
  - Difficulty level
  - Interview type (technical/behavioral/mixed)
- Each question includes ideal answer points for evaluation

### Feedback Generation
- Analyzes user's answer against ideal answer points
- Provides numerical rating (1-10)
- Identifies specific strengths in the answer
- Suggests concrete improvements
- Gives detailed constructive feedback paragraph
- Encouraging and professional tone

### Configuration
- Set `USE_API = true` in `aiInterviewGenerator.js` to use OpenAI
- Set `USE_API = false` to use mock data (no API calls)
- Requires `VITE_OPENAI_API_KEY` environment variable
- Automatic error handling and fallback to mock data
