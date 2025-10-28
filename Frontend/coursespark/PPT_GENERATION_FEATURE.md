# PowerPoint Generation Feature

## Overview
This feature allows users to automatically generate professional PowerPoint presentations from their AI-generated courses using OpenAI and pptxgenjs library.

## Features

### 1. **AI-Powered Content Generation**
- Uses OpenAI GPT-3.5-turbo to create structured presentation content
- Automatically generates:
  - Title slide with course information
  - Overview slide with course details
  - Individual slides for each lesson with key points
  - Conclusion slide
  - Speaker notes for each slide

### 2. **Professional Design**
- Modern color scheme with orange/amber primary colors
- Clean, professional layout
- Consistent formatting across all slides
- Header bars and footers
- Bullet points for easy reading

### 3. **Fallback Mechanism**
- If OpenAI API fails or quota is exceeded, the system automatically falls back to manual content generation
- Extracts key points from lesson content
- Ensures users always get a presentation, even without AI

### 4. **One-Click Download**
- Simple button interface in the Course Creator
- Downloads .pptx file directly to user's computer
- Filename automatically generated from course title

## Technical Implementation

### Files Created/Modified

1. **`src/services/pptGenerator.js`** (NEW)
   - Main PPT generation service
   - OpenAI integration for content generation
   - Fallback content generation
   - pptxgenjs implementation

2. **`src/pages/CourseCreator.jsx`** (MODIFIED)
   - Added PPT generation button
   - Added state management for PPT generation
   - Integrated with pptGenerator service

### Dependencies Added
- `pptxgenjs` - PowerPoint generation library

### How It Works

1. **User generates a course** using the AI Course Creator
2. **Course preview is displayed** with all lessons
3. **User clicks "Download as PPT"** button
4. **System calls OpenAI** to generate structured presentation content
5. **If AI succeeds**: Creates PPT with AI-generated content
6. **If AI fails**: Falls back to extracting content from lessons
7. **pptxgenjs creates** the .pptx file with professional styling
8. **File downloads** automatically to user's computer

## Usage

### For Users
1. Create a course using the AI Course Creator
2. Review the generated course content
3. Click the "Download as PPT" button (orange button with download icon)
4. Wait for the PPT to generate (usually 5-10 seconds)
5. The .pptx file will download automatically

### For Developers

#### Generate PPT Programmatically
```javascript
import { generateCoursePPT } from '@/services/pptGenerator';

const courseData = {
  title: 'Course Title',
  description: 'Course description',
  level: 'beginner',
  category: 'Technology',
  duration_hours: 10,
  audience: 'Developers',
  lessons: [
    {
      title: 'Lesson 1',
      content: '<p>Lesson content...</p>',
      duration_minutes: 30
    }
  ]
};

// Generate with AI
const result = await generateCoursePPT(courseData, true);

// Generate without AI (fallback only)
const result = await generateCoursePPT(courseData, false);
```

## Configuration

### Environment Variables
Make sure `VITE_OPENAI_API_KEY` is set in your `.env` file:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Customization

#### Colors
Edit the `colors` object in `pptGenerator.js`:
```javascript
const colors = {
  primary: 'F97316',    // Orange
  secondary: '1E293B',  // Dark slate
  accent: 'FCD34D',     // Yellow
  text: '334155',       // Slate
  background: 'FFFFFF'  // White
};
```

#### Slide Layout
Modify the slide creation logic in the `generateCoursePPT` function to change:
- Font sizes
- Positioning
- Spacing
- Bullet point styles

## Error Handling

The system handles several error scenarios:

1. **OpenAI API Failure**: Falls back to manual content generation
2. **Missing API Key**: Uses fallback generation automatically
3. **Network Issues**: Shows error message to user
4. **Invalid Course Data**: Validates data before generation

## Future Enhancements

Potential improvements:
- [ ] Add theme selection (multiple color schemes)
- [ ] Include images from course content
- [ ] Add charts/graphs for course statistics
- [ ] Support for custom templates
- [ ] Batch generation for multiple courses
- [ ] Integration with Google Slides
- [ ] PDF export option

## Troubleshooting

### PPT Not Downloading
- Check browser download settings
- Ensure pop-ups are not blocked
- Check browser console for errors

### AI Content Not Working
- Verify OpenAI API key is set correctly
- Check API quota/limits
- System will automatically use fallback

### Styling Issues
- Clear browser cache
- Check pptxgenjs version compatibility
- Review console for warnings

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure OpenAI API key is valid
4. Review this documentation

## License
This feature is part of the CourseSpark application.
