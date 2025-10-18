# Install Google Generative AI Package

Run this command in the Frontend/coursespark directory:

```bash
npm install @google/generative-ai
```

This will install the Google Gemini AI SDK for generating course content.

## What Was Added

### New File: `src/services/aiCourseGenerator.js`
- Uses Google Gemini Pro model
- Generates course title, description, and lessons
- Parses AI response and structures course data
- Handles errors gracefully

### Updated: `src/pages/CourseCreator.jsx`
- Imported AI generator service
- Updated `handleGenerate()` to call Google Gemini API
- Shows loading message during generation
- Displays success/error messages

## How It Works

1. User fills out course form (topic, audience, level, duration, category)
2. Clicks "Generate Course with AI"
3. Frontend calls Google Gemini API with structured prompt
4. AI generates:
   - Course title
   - Course description
   - Multiple lessons with content in HTML format
   - Duration estimates for each lesson
5. Generated content is displayed in preview
6. User can edit and save to database

## API Key

The Google API key is embedded in the service:
```
GOOGLE_API_KEY=AIzaSyBndmovbXp8B5LLA06gHz_XdzIcsTT-GDo
```

## Testing

1. Navigate to Dashboard → "Create New Course"
2. Fill in the form:
   - Topic: "JavaScript Basics"
   - Audience: "Complete beginners"
   - Level: "beginner"
   - Duration: 4 hours
   - Category: "technology"
3. Click "Generate Course with AI"
4. Wait for AI to generate content (5-10 seconds)
5. Review generated lessons
6. Click "Save Course"

The AI will generate comprehensive, educational content tailored to your specifications!
