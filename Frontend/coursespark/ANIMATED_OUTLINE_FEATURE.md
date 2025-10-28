# Animated Course Outline Feature

## Overview
A beautiful, interactive course outline component with advanced animations using Framer Motion and GSAP. Inspired by modern design patterns with smooth transitions, parallax effects, and engaging interactions.

## Features

### 🎨 Visual Design
- **Gradient Badges**: Numbered lesson badges with blue-to-purple gradients
- **Hover Effects**: Scale animations and border color transitions
- **Decorative Elements**: Gradient bottom borders and connecting lines between lessons
- **Modern Cards**: Clean white cards with shadows and smooth hover states
- **Color Scheme**: Blue, purple, and green accents with professional styling

### ✨ Animations

#### Framer Motion Animations
1. **Stagger Entry**: Lessons fade in and slide up with staggered timing
2. **Layout Animations**: Smooth height transitions when expanding/collapsing
3. **Hover Interactions**: Scale effects on buttons and cards
4. **Rotate Animations**: Badge rotates 360° on hover
5. **Chevron Rotation**: Smooth 180° rotation when toggling expand/collapse

#### GSAP Animations
1. **Scroll Trigger**: Lessons animate in as they enter viewport
2. **Parallax Effect**: Subtle vertical movement on scroll
3. **Gradient Line**: Horizontal scale animation from left to right
4. **Connecting Lines**: Vertical scale animation between lessons

### 🎯 Interactive Features

#### Expandable Lessons
- Click any lesson to expand/collapse
- First lesson expanded by default
- Smooth height transitions
- Preview mode shows 2 bullet points when collapsed
- Full content view when expanded

#### Content Display
- **Collapsed State**:
  - Lesson number badge
  - Lesson title
  - Duration and lesson number
  - Preview of first 2 bullet points
  - "+X more topics" indicator

- **Expanded State**:
  - All bullet points with checkmark icons
  - Full lesson overview (first 500 characters)
  - Action buttons (Start Lesson, Preview)
  - Enhanced styling with gradient background

### 📱 Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interactions
- Optimized spacing and typography

## Technical Implementation

### Dependencies
```json
{
  "framer-motion": "^12.23.24",
  "gsap": "^3.x.x",
  "@gsap/react": "^2.x.x"
}
```

### Key Technologies

#### Framer Motion
- `motion.div` for animated containers
- `AnimatePresence` for exit animations
- `layout` prop for smooth layout transitions
- `whileHover` and `whileTap` for interactions
- `initial`, `animate`, `exit` for state transitions

#### GSAP
- `ScrollTrigger` plugin for scroll-based animations
- `gsap.fromTo()` for complex animations
- `stagger` for sequential animations
- `scrub` for parallax effects

### Component Structure

```jsx
<AnimatedCourseOutline lessons={lessons}>
  ├── Header Section
  │   ├── Icon + Title
  │   └── Lesson count
  │
  ├── Lessons List
  │   └── For each lesson:
  │       ├── Lesson Card
  │       │   ├── Number Badge (animated)
  │       │   ├── Title & Meta
  │       │   ├── Preview Bullets (collapsed)
  │       │   └── Full Content (expanded)
  │       │       ├── All Bullet Points
  │       │       ├── Content Preview
  │       │       └── Action Buttons
  │       ├── Gradient Bottom Line
  │       └── Connecting Line
  │
  └── Completion Badge
```

## Usage

### Basic Usage
```jsx
import AnimatedCourseOutline from '@/components/course-creator/AnimatedCourseOutline';

<AnimatedCourseOutline lessons={courseLessons} />
```

### Lesson Data Structure
```javascript
const lessons = [
  {
    order: 1,
    title: "Introduction to React",
    content: "<p>HTML content with <ul><li>bullet points</li></ul></p>",
    duration_minutes: 30
  },
  // ... more lessons
];
```

## Animation Details

### Entry Animation (GSAP)
```javascript
gsap.fromTo(lessonRefs.current, {
  opacity: 0,
  y: 50,
  scale: 0.95
}, {
  opacity: 1,
  y: 0,
  scale: 1,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power3.out'
});
```

### Parallax Effect (GSAP)
```javascript
gsap.to(ref, {
  y: -20 * (index % 3),
  scrollTrigger: {
    trigger: ref,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1
  }
});
```

### Expand/Collapse (Framer Motion)
```jsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.4, ease: 'easeInOut' }}
>
  {/* Expanded content */}
</motion.div>
```

## Customization

### Colors
Edit the gradient colors in the component:
```jsx
// Badge gradient
className="bg-gradient-to-br from-blue-500 to-purple-600"

// Bottom line gradient
className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"

// Completion badge
className="bg-gradient-to-br from-green-500 to-emerald-600"
```

### Animation Timing
Adjust animation durations:
```javascript
// Entry animation speed
duration: 0.6,
stagger: 0.1,

// Expand/collapse speed
transition={{ duration: 0.4 }}

// Hover effects
whileHover={{ scale: 1.05 }}
```

### Content Display
Modify content limits:
```javascript
// Number of preview bullets
bulletPoints.slice(0, 2)

// Content preview length
lesson.content.substring(0, 500)
```

## Performance Optimization

### Implemented Optimizations
1. **Ref Management**: Uses `useRef` for DOM references
2. **Cleanup**: Kills ScrollTrigger instances on unmount
3. **Conditional Rendering**: Only renders expanded content when needed
4. **Memoization**: Could add `React.memo` for large lesson lists

### Best Practices
- Keep lesson content reasonable size
- Limit number of simultaneously expanded lessons
- Use `will-change` CSS for frequently animated elements
- Lazy load images if added to lessons

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CSS Grid and Flexbox support
- Smooth scrolling support

## Accessibility

### Implemented Features
- Semantic HTML structure
- Keyboard navigation support (click events)
- ARIA labels (can be enhanced)
- Color contrast meets WCAG standards
- Focus states on interactive elements

### Future Enhancements
- Add ARIA expanded/collapsed states
- Keyboard shortcuts for expand/collapse
- Screen reader announcements
- Focus management on expand

## Integration with Course Creator

### In GeneratedCoursePreview.jsx
```jsx
import AnimatedCourseOutline from "./AnimatedCourseOutline";

// Replace old lessons preview
<AnimatedCourseOutline lessons={course.lessons} />
```

### Data Flow
```
CourseCreator
  ↓
GeneratedCoursePreview
  ↓
AnimatedCourseOutline
  ↓
Individual Lesson Cards
```

## Future Enhancements

### Potential Features
- [ ] Drag-and-drop lesson reordering
- [ ] Progress tracking per lesson
- [ ] Lesson completion checkmarks
- [ ] Video preview thumbnails
- [ ] Quiz indicators
- [ ] Difficulty badges
- [ ] Estimated completion time
- [ ] Bookmark/favorite lessons
- [ ] Search/filter lessons
- [ ] Print-friendly view

### Animation Enhancements
- [ ] 3D card flip effects
- [ ] Particle effects on completion
- [ ] Confetti animation on course completion
- [ ] Smooth scroll to lesson
- [ ] Magnetic cursor effect
- [ ] Ripple effect on click

## Troubleshooting

### Animations Not Working
1. Check GSAP is installed: `npm list gsap`
2. Verify ScrollTrigger is registered
3. Check browser console for errors
4. Ensure refs are properly assigned

### Performance Issues
1. Reduce number of lessons per page
2. Disable parallax on mobile
3. Use `will-change` CSS property
4. Lazy load expanded content

### Styling Issues
1. Check Tailwind CSS is configured
2. Verify all utility classes exist
3. Check for CSS conflicts
4. Inspect element styles in DevTools

## Examples

### Simple Implementation
```jsx
function CourseView() {
  const lessons = [
    {
      order: 1,
      title: "Getting Started",
      content: "<p>Introduction content</p>",
      duration_minutes: 15
    }
  ];

  return <AnimatedCourseOutline lessons={lessons} />;
}
```

### With Custom Styling
```jsx
<div className="max-w-4xl mx-auto p-6">
  <AnimatedCourseOutline lessons={lessons} />
</div>
```

## Credits
- **Framer Motion**: Animation library by Framer
- **GSAP**: GreenSock Animation Platform
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

## License
Part of the CourseSpark application.

---

**Enjoy your beautifully animated course outlines! 🎉**
