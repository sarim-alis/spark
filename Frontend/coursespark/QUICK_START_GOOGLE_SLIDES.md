# Quick Start: Using Google Slides API

You already have your credentials! Here's how to use them:

## ✅ Your Current Setup
**Note:** The CLIENT_SECRET is not used in frontend code (only CLIENT_ID and API_KEY are needed).

## 🚀 How to Create PPT Using Google Slides

### Step 1: Configure OAuth Consent Screen (One-Time Setup)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **"APIs & Services"** → **"OAuth consent screen"**
4. Fill in:
   - **App name:** CourseSpark
   - **User support email:** Your email
   - **Developer contact:** Your email
5. Click **"Save and Continue"**
6. **Scopes:** Click "Add or Remove Scopes"
   - Add: `https://www.googleapis.com/auth/presentations`
   - Add: `https://www.googleapis.com/auth/drive.file`
7. Click **"Save and Continue"**
8. **Test users:** Add your email address
9. Click **"Save and Continue"**

### Step 2: Configure OAuth Client

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized JavaScript origins"**, add:
   ```
   http://localhost:5173
   ```
4. Under **"Authorized redirect URIs"**, add:
   ```
   http://localhost:5173
   ```
5. Click **"Save"**

### Step 3: Enable Required APIs

1. Go to **"APIs & Services"** → **"Library"**
2. Search and enable:
   - ✅ **Google Slides API**
   - ✅ **Google Drive API**

### Step 4: Use the Feature

1. **Start your dev server:**
   ```bash
   cd Frontend/coursespark
   npm run dev
   ```

2. **Generate a course:**
   - Open http://localhost:5173
   - Fill in the course form
   - Click "Generate Course"
   - Wait for AI to generate the course

3. **Create Google Slides:**
   - Click the **"Create Google Slides"** button (green button)
   - A Google sign-in popup will appear
   - Sign in with your Google account
   - Click **"Allow"** to grant permissions
   - Wait for the presentation to be created
   - The presentation will automatically open in a new tab!

## 📊 What Happens Behind the Scenes

```
1. Click "Create Google Slides"
   ↓
2. Load Google API scripts
   ↓
3. Initialize Google API client (using VITE_GOOGLE_API_KEY)
   ↓
4. Request OAuth authorization (using VITE_GOOGLE_CLIENT_ID)
   ↓
5. User signs in and grants permissions
   ↓
6. Get access token
   ↓
7. Create new Google Slides presentation
   ↓
8. Add title slide with course name & description
   ↓
9. Create slides for each lesson with:
   - Lesson title
   - Bullet points from lesson content
   ↓
10. Apply styling (fonts, colors)
   ↓
11. Return presentation URL
   ↓
12. Open presentation in new tab
   ↓
13. Save URL to course (optional)
```

## 🎯 Expected Result

After clicking "Create Google Slides", you'll get:

### Title Slide
```
┌─────────────────────────────────┐
│                                 │
│   [Your Course Title]           │
│                                 │
│   [Course Description]          │
│                                 │
└─────────────────────────────────┘
```

### Lesson Slides (one per lesson)
```
┌─────────────────────────────────┐
│  Lesson 1: Introduction         │
├─────────────────────────────────┤
│  • Key concept 1                │
│  • Key concept 2                │
│  • Key concept 3                │
│  • Practical example            │
│  • Summary                      │
└─────────────────────────────────┘
```

## 🔍 Troubleshooting

### Error: "popup_closed_by_user"
**Solution:** User closed the popup. Click "Create Google Slides" again.

### Error: "access_denied"
**Solution:** User denied permissions. Click again and allow access.

### Error: "idpiframe_initialization_failed"
**Cause:** Cookies are blocked or third-party cookies disabled
**Solution:** 
- Enable cookies in browser
- Allow third-party cookies for accounts.google.com
- Try in incognito mode

### Error: "origin_mismatch"
**Cause:** Your localhost URL doesn't match authorized origins
**Solution:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth Client ID
3. Add `http://localhost:5173` to Authorized JavaScript origins
4. Save and wait 5 minutes for changes to propagate

### Error: "invalid_client"
**Cause:** CLIENT_ID is incorrect or not found
**Solution:**
- Double-check VITE_GOOGLE_CLIENT_ID in .env
- Make sure there are no extra spaces
- Restart dev server after changing .env

### Error: "API key not valid"
**Cause:** API key is incorrect or APIs not enabled
**Solution:**
1. Verify VITE_GOOGLE_API_KEY in .env
2. Go to Google Cloud Console → APIs & Services → Library
3. Enable "Google Slides API" and "Google Drive API"
4. Wait a few minutes for activation

### Presentation created but empty
**Cause:** Batch update failed
**Solution:**
- Check browser console for errors
- Verify you have the correct OAuth scopes
- Make sure lessons have content

## 📝 Code Flow

### In `CourseCreator.jsx`:
```javascript
// When user clicks "Create Google Slides"
const handleGenerateGoogleSlides = async () => {
  // 1. Show loading message
  message.loading('Creating Google Slides presentation...');
  
  // 2. Call the generator
  const result = await generateGoogleSlides(draft);
  
  // 3. If successful, open presentation
  if (result.success) {
    openPresentation(result.presentationId);
  }
};
```

### In `googleSlidesGenerator.js`:
```javascript
// Main function
export const generateGoogleSlides = async (courseData) => {
  // 1. Initialize Google API
  await initGoogleAPI();
  
  // 2. Get user authorization
  await getAccessToken();
  
  // 3. Create presentation
  const presentation = await createPresentation(courseData.title);
  
  // 4. Build slide content
  const requests = buildSlideRequests(courseData, ...);
  
  // 5. Apply updates
  await gapi.client.slides.presentations.batchUpdate({...});
  
  // 6. Return URL
  return { success: true, presentationUrl: ... };
};
```

## 🎨 Customization

Want to customize the slides? Edit `googleSlidesGenerator.js`:

### Change Colors
```javascript
// In buildSlideRequests function, add:
requests.push({
  updateShapeProperties: {
    objectId: slideId,
    shapeProperties: {
      shapeBackgroundFill: {
        solidFill: {
          color: {
            rgbColor: { red: 0.2, green: 0.4, blue: 0.8 }
          }
        }
      }
    },
    fields: 'shapeBackgroundFill.solidFill.color'
  }
});
```

### Change Fonts
```javascript
// In applyPresentationStyling function, modify:
defaultTextStyle: {
  fontFamily: 'Roboto', // or 'Georgia', 'Times New Roman'
  fontSize: { magnitude: 16, unit: 'PT' },
}
```

### Add Images
```javascript
// Add image to slide:
requests.push({
  createImage: {
    url: 'https://example.com/image.jpg',
    elementProperties: {
      pageObjectId: slideId,
      size: {
        width: { magnitude: 300, unit: 'PT' },
        height: { magnitude: 200, unit: 'PT' }
      },
      transform: {
        scaleX: 1,
        scaleY: 1,
        translateX: 400,
        translateY: 100,
        unit: 'PT'
      }
    }
  }
});
```

## 🔐 Security Notes

- ✅ API keys are safe in frontend (read-only access)
- ✅ OAuth ensures user consent
- ✅ Presentations saved to user's own Google Drive
- ⚠️ Never commit .env file to Git
- ⚠️ CLIENT_SECRET should only be used in backend (not needed here)

## 📚 Resources

- [Google Slides API Docs](https://developers.google.com/slides/api)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [API Reference](https://developers.google.com/slides/api/reference/rest)

## ✨ Tips

1. **First time:** You'll need to authorize the app
2. **Subsequent uses:** Token is cached, no re-authorization needed
3. **Editing:** Open the presentation in Google Slides to edit
4. **Sharing:** Use Google Slides' share button
5. **Downloading:** File → Download → PowerPoint (.pptx)

Ready to create presentations! 🎉
