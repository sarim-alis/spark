# Course Structure - Complete Explanation

## Overview
The system now generates courses with a clear structure: **2 outline points** with **2 corresponding content sections** per lesson.

---

## Structure

### 1. **Outline (2 Points)**
Each lesson has exactly 2 bullet points that summarize what will be learned:

```
• Understanding the core architecture and how Vue.js manages reactive data binding in modern applications
• Setting up a development environment and creating your first Vue.js application with components
```

### 2. **Content (2 Sections)**
Each lesson has exactly 2 sections (h3 + paragraph) that match the outline:

```html
<h3>Understanding Vue.js architecture and reactive data binding</h3>
<p>Vue.js uses a reactive data system where changes to data automatically update the DOM. This architecture makes it easy to build dynamic interfaces without manual DOM manipulation. The reactive system tracks dependencies and efficiently updates only the components that need to change, resulting in optimal performance. We'll explore how the Virtual DOM works, how Vue's reactivity system compares to other frameworks, and best practices for structuring your data. You'll learn to leverage computed properties, watchers, and reactive refs effectively. By understanding these core concepts, you'll be able to build more efficient and maintainable applications.</p>

<h3>Setting up your development environment and first application</h3>
<p>The Vue CLI provides a complete development setup with hot-reload, build optimization, and testing frameworks. You'll learn to install Node.js, npm, and create your first Vue project with a component-based architecture. This foundation enables you to build scalable applications efficiently. We'll walk through the project structure, understand the role of each file, and configure your development environment for optimal productivity. You'll also learn about Vue DevTools for debugging, ESLint for code quality, and how to organize your components effectively. By the end, you'll have a fully functional development workflow ready for building real applications.</p>
```

**Key Points:**
- Each section heading matches the outline point **exactly** (word-for-word)
- Each paragraph is comprehensive (7-8 lines, 120-150 words)
- Each section gets its own slide in the PPT

---

## Display Locations

### Course Preview (AnimatedCourseOutline.jsx)
- **Collapsed**: Shows first outline point
- **Expanded**: Shows both outline points + content preview

### PowerPoint Slides (Google Slides API)
- **One slide per section**: Each lesson creates 2 slides (1 per outline point)
- **Slide Title**: The outline point heading (concise, 8-12 words)
- **Slide Body**: The comprehensive content paragraph (7-8 lines, 120-150 words)

**Each slide shows:**
```
[Outline point as title]

[Comprehensive 7-8 line paragraph with detailed explanation]
```

**Example:**
```
Title: Understanding Vue.js architecture and reactive data binding

Body: Vue.js uses a reactive data system where changes to data 
automatically update the DOM. This architecture makes it easy to build 
dynamic interfaces without manual DOM manipulation. The reactive system 
tracks dependencies and efficiently updates only the components that 
need to change, resulting in optimal performance. We'll explore how the 
Virtual DOM works, how Vue's reactivity system compares to other 
frameworks, and best practices for structuring your data...
```

---

## AI Generation (GPT-4o)

### Model
- **Model**: `gpt-4o` (GPT-5 class)
- **Max Tokens**: 8000
- **Temperature**: 0.7

### Prompt Requirements
1. Generate **EXACTLY 2** outline points (8-12 words each - concise!)
2. Generate **EXACTLY 2** content sections
3. Each section has `<h3>` + `<p>` (7-8 lines, 120-150 words)
4. Headings must match outline points word-for-word
5. Keep titles short to prevent wrapping to multiple lines
6. Each paragraph should cover: key concepts, theoretical foundations, practical applications, best practices, and actionable takeaways

---

## Benefits

✅ **Simple Structure**: 2 points per lesson - focused and clear
✅ **Consistent Format**: Same structure across all lessons
✅ **No Overflow**: 1 section per slide - content fits properly
✅ **Easy to Scan**: Outline shows what you'll learn at a glance
✅ **Rich Content**: Comprehensive paragraphs (7-8 lines, 120-150 words)
✅ **Professional Layout**: Heading as title, content in body - standard PPT format
✅ **Focused Learning**: One concept per slide for better comprehension
✅ **Manageable Size**: 2 slides per lesson - not overwhelming
✅ **In-Depth Coverage**: Each section covers theory, practice, and actionable insights
