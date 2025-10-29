# Google Slides API Setup Guide

This guide will help you set up Google Slides API integration for creating presentations directly from your course outlines.

## Prerequisites

- A Google Cloud Platform account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `CourseSpark Slides`
4. Click **"Create"**

## Step 2: Enable Google Slides API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Slides API"**
3. Click on it and press **"Enable"**
4. Also enable **"Google Drive API"** (required for creating files)

## Step 3: Create API Credentials

### A. Create API Key (for public data access)

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key
4. (Optional) Click **"Restrict Key"** and limit to:
   - Google Slides API
   - Google Drive API
5. Save the key as `VITE_GOOGLE_API_KEY` in your `.env` file

### B. Create OAuth 2.0 Client ID (for user authorization)

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `CourseSpark`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/presentations` and `https://www.googleapis.com/auth/drive.file`
   - Test users: Add your email (for testing)
4. Back to **"Create OAuth client ID"**:
   - Application type: **Web application**
   - Name: `CourseSpark Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
5. Click **"Create"**
6. Copy the **Client ID**
7. Save it as `VITE_GOOGLE_CLIENT_ID` in your `.env` file

## Step 4: Configure Environment Variables

Create a `.env` file in the `Frontend/coursespark` directory:

```env
# OpenAI API
VITE_OPENAI_API_KEY=sk-...

# Google Cloud
VITE_GOOGLE_API_KEY=AIza...
VITE_GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com

# Backend API
VITE_API_URL=http://localhost:5000/api
```

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Generate a course using the AI Course Creator

3. Click **"Create Google Slides"** button

4. You'll be prompted to sign in with Google and authorize the app

5. Once authorized, a new Google Slides presentation will be created and opened in a new tab

## How It Works

1. **User clicks "Create Google Slides"**
   - App initializes Google API client
   - Requests user authorization (OAuth 2.0)

2. **User authorizes the app**
   - Google returns an access token
   - Token is used for API calls

3. **App creates presentation**
   - Creates a new Google Slides presentation
   - Adds title slide with course name and description
   - Creates slides for each lesson with:
     - Lesson title
     - Bullet points extracted from lesson content
   - Applies basic styling

4. **Presentation opens**
   - User can edit the presentation in Google Slides
   - Presentation is saved to their Google Drive
   - URL is optionally saved to the course record

## Features

✅ **Automatic slide generation** from course outline  
✅ **Title slide** with course name and description  
✅ **Lesson slides** with titles and bullet points  
✅ **Opens in Google Slides** for further editing  
✅ **Saved to Google Drive** automatically  
✅ **Shareable link** generated  

## Troubleshooting

### "API key not valid" error
- Check that you've enabled Google Slides API and Google Drive API
- Verify the API key is correct in `.env`
- Make sure there are no extra spaces or quotes

### "Access blocked" error
- Your OAuth consent screen may need verification
- For testing, add your email to "Test users" in OAuth consent screen
- For production, submit for verification

### "Origin not allowed" error
- Add your domain to "Authorized JavaScript origins" in OAuth client settings
- Make sure the URL matches exactly (including http/https and port)

### Slides not creating properly
- Check browser console for errors
- Verify you have the correct scopes in OAuth consent screen
- Make sure the access token is valid

## API Limits

- **Google Slides API**: 300 requests per minute per user
- **Google Drive API**: 1000 requests per 100 seconds per user

For most use cases, these limits are more than sufficient.

## Security Notes

- Never commit `.env` file to version control
- API keys and Client IDs are sensitive - keep them secure
- Use environment variables for all credentials
- For production, implement proper OAuth flow with backend token storage

## Additional Resources

- [Google Slides API Documentation](https://developers.google.com/slides/api)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [OAuth 2.0 for Web Apps](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
