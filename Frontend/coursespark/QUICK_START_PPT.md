# Quick Start: PPT Generation Feature

## 🚀 Get Started in 3 Steps

### Step 1: Ensure OpenAI API Key is Set
```bash
# In Frontend/coursespark/.env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Step 2: Install Dependencies (Already Done!)
```bash
cd Frontend/coursespark
npm install
# pptxgenjs is already installed
```

### Step 3: Use the Feature
1. Run the app: `npm run dev`
2. Go to Course Creator page
3. Generate a course using AI
4. Click the **"Download as PPT"** button (orange button with download icon)
5. Wait 5-10 seconds
6. Your .pptx file will download automatically!

---

## 📋 What You Get

### Professional PowerPoint with:
- ✅ Title slide with course info
- ✅ Overview slide with statistics
- ✅ Individual slides for each lesson
- ✅ Conclusion slide
- ✅ Speaker notes
- ✅ Modern design with orange theme

---

## 🎯 Example Usage

```javascript
// The feature is already integrated in CourseCreator.jsx
// Just click the button in the UI!

// Or use programmatically:
import { generateCoursePPT } from '@/services/pptGenerator';

const courseData = {
  title: 'My Course',
  description: 'Course description',
  level: 'beginner',
  category: 'Technology',
  duration_hours: 5,
  lessons: [
    {
      title: 'Lesson 1',
      content: '<p>Content here</p>',
      duration_minutes: 30
    }
  ]
};

const result = await generateCoursePPT(courseData, true);
console.log(result.success ? 'Success!' : result.error);
```

---

## 🔍 Troubleshooting

### PPT Not Downloading?
- Check browser download settings
- Look in your Downloads folder
- Check browser console for errors

### AI Not Working?
- Verify VITE_OPENAI_API_KEY is set
- Check API quota/limits
- Don't worry! System automatically falls back to manual generation

### Styling Issues?
- Clear browser cache
- Restart dev server
- Check console for warnings

---

## 💡 Tips

1. **Better Results**: Provide detailed course descriptions for better AI-generated slides
2. **Customization**: Edit `src/services/pptGenerator.js` to change colors/layout
3. **Fallback**: Works even without OpenAI API key (uses lesson content)
4. **File Name**: Automatically generated from course title

---

## 📞 Need Help?

Check these files:
- `PPT_GENERATION_FEATURE.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- Browser console - Error messages

---

## 🎉 That's It!

You're ready to generate professional PowerPoint presentations from your AI courses!

**Happy Creating! 🚀**
