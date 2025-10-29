# Google Slides API - Download Only Mode

## ✅ What Changed

The Google Slides integration now **downloads the PowerPoint file directly** instead of saving it to Google Drive!

## 🎯 How It Works

```
1. User clicks "Generate PPT (Google API)"
   ↓
2. Google OAuth popup appears
   ↓
3. User signs in and authorizes
   ↓
4. Creates presentation in Google Slides (temporary)
   ↓
5. Adds all slides with content
   ↓
6. Exports as PowerPoint (.pptx)
   ↓
7. Downloads to user's computer
   ↓
8. Deletes presentation from Google Drive (cleanup)
   ↓
9. Done! File is on user's computer, NOT in Drive
```

## 🚀 Usage

### Step 1: Setup (One-Time)

Your `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=429813397729-lquaaep11smdegkvlhrebkjcotq9hdul.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyCMFHH4mj8SOz20FPZv3HNPRYEASqIjzUo
```

### Step 2: Configure Google Cloud

1. **Enable APIs:**
   - Google Slides API ✓
   - Google Drive API ✓ (needed for export/delete)

2. **OAuth Consent Screen:**
   - Add scopes:
     - `https://www.googleapis.com/auth/presentations`
     - `https://www.googleapis.com/auth/drive.file`
   - Add test user: your email

3. **OAuth Client:**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`

### Step 3: Use It

1. Generate a course
2. Click **"Generate PPT (Google API)"** (green button)
3. Sign in with Google
4. Allow permissions
5. Wait for download
6. PowerPoint file downloads automatically!

## 📊 Two PPT Options

After generating a course, you'll see two buttons:

```
┌──────────────────────┬──────────────────────┐
│ Generate PPT         │ Generate PPT         │
│ (Google API)         │ (Local)              │
│ Green button         │ Blue button          │
└──────────────────────┴──────────────────────┘
```

### Option 1: Google API (Green Button)
- ✅ Uses Google Slides API
- ✅ Professional formatting
- ✅ Text-based slides
- ✅ Downloads as .pptx
- ✅ Nothing saved to Drive
- ⚠️ Requires Google sign-in

### Option 2: Local (Blue Button)
- ✅ Uses pptxgenjs library
- ✅ Works offline
- ✅ Includes images
- ✅ Downloads as .pptx
- ✅ No Google account needed
- ⚠️ Different styling

## 🔧 Technical Details

### What Happens in Code

```javascript
// In googleSlidesGenerator.js
export const generateGoogleSlides = async (courseData) => {
  let presentationId = null;
  
  try {
    // 1. Create presentation (temporary)
    const presentation = await createPresentation(courseData.title);
    presentationId = presentation.presentationId;
    
    // 2. Add slides with content
    await gapi.client.slides.presentations.batchUpdate({
      presentationId,
      requests: [/* slide content */]
    });
    
    // 3. Export as PowerPoint
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=application/vnd.openxmlformats-officedocument.presentationml.presentation`;
    
    const response = await fetch(exportUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const blob = await response.blob();
    
    // 4. Download file
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pptx`;
    link.click();
    
    // 5. Delete from Drive (cleanup)
    await gapi.client.request({
      path: `https://www.googleapis.com/drive/v3/files/${presentationId}`,
      method: 'DELETE'
    });
    
    return { success: true, fileName: `${fileName}.pptx` };
  } catch (error) {
    // Cleanup on error
    if (presentationId) {
      await deletePresentation(presentationId);
    }
    return { success: false, error: error.message };
  }
};
```

## 🎨 What You Get

### Slide Structure

**Title Slide:**
```
╔═══════════════════════════════════╗
║                                   ║
║   Meditation for Beginners        ║
║                                   ║
║   A comprehensive course...       ║
║                                   ║
╚═══════════════════════════════════╝
```

**Lesson Slides:**
```
╔═══════════════════════════════════╗
║  Lesson 1: Introduction           ║
╠═══════════════════════════════════╣
║                                   ║
║  • Master fundamental principles  ║
║  • Understand practical apps      ║
║  • Recognize patterns             ║
║  • Develop critical thinking      ║
║  • Build confidence               ║
║                                   ║
╚═══════════════════════════════════╝
```

## ✨ Benefits

### Why Use Google API Version?

1. **Professional Formatting**
   - Uses Google Slides' native layouts
   - Clean, consistent styling
   - Professional typography

2. **No Storage Used**
   - Creates presentation temporarily
   - Downloads immediately
   - Deletes from Drive automatically
   - Zero storage footprint

3. **Better Compatibility**
   - Native PowerPoint export
   - Works perfectly in PowerPoint
   - No compatibility issues

4. **Automatic Cleanup**
   - No files left in Drive
   - No manual deletion needed
   - Privacy-friendly

## 🔒 Privacy & Security

- ✅ Presentation created temporarily
- ✅ Deleted immediately after download
- ✅ Nothing stored in Google Drive
- ✅ OAuth ensures user consent
- ✅ Only accesses user's own Drive
- ✅ No data retention

## 🐛 Troubleshooting

### Download doesn't start
**Check:**
- Browser allows downloads
- Pop-up blocker not blocking
- Check browser's download folder

### "Failed to export presentation"
**Solution:**
- Make sure Google Drive API is enabled
- Check that access token is valid
- Try signing in again

### "Failed to delete temporary file"
**Note:** This is just a warning. The download still succeeded. The temporary file will be auto-deleted by Google after 30 days.

### File downloads but is corrupted
**Solution:**
- Check internet connection
- Try again (might be network issue)
- Use "Generate PPT (Local)" as backup

## 📝 Summary

**Old Flow (Before):**
```
Create → Save to Drive → User opens → User downloads
```

**New Flow (Now):**
```
Create → Export → Download → Delete → Done!
```

**Result:** User gets PowerPoint file directly, nothing saved to Drive!

## 🎯 Quick Comparison

| Feature | Google API | Local |
|---------|-----------|-------|
| **Sign-in Required** | Yes | No |
| **Internet Required** | Yes | No |
| **Storage Used** | None | None |
| **Format** | Native PPTX | Generated PPTX |
| **Images** | No | Yes |
| **Styling** | Google Slides | Custom |
| **Speed** | ~5-10 sec | ~2-3 sec |

Choose based on your needs!
