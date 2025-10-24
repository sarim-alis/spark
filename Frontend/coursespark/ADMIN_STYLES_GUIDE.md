# Admin Panel Styling Guide

## Global Admin CSS

A global CSS file has been created at `src/styles/admin.css` for consistent styling across the admin panel.

## CSS Variables

```css
:root {
  --admin-primary-color: #a78bfa;      /* Purple */
  --admin-primary-hover: #3c315e;      /* Dark Purple */
  --admin-secondary-color: #f59e0b;    /* Amber/Orange */
  --admin-secondary-hover: #d97706;    /* Dark Amber */
}
```

## Button Classes

### Primary Button (Purple)
```jsx
<Button className="admin-btn-primary">
  Primary Action
</Button>
```
- Background: `#a78bfa` (light purple)
- Hover: `#3c315e` (dark purple)

### Secondary Button (Amber)
```jsx
<Button className="admin-btn-secondary">
  Secondary Action
</Button>
```
- Background: `#f59e0b` (amber)
- Hover: `#d97706` (dark amber)

### Inline Custom Colors
You can also use inline Tailwind classes:
```jsx
<Button className="bg-[#a78bfa] hover:!bg-[#3c315e] text-white">
  Custom Button
</Button>
```

## Help Icon Styling
```jsx
<Button className="admin-help-icon">
  <HelpCircle />
</Button>
```

## Popup/Modal Classes

- `.admin-popup-overlay` - Full-screen overlay with backdrop
- `.admin-popup-content` - Modal content container
- `.admin-popup-header` - Sticky header with title and close button
- `.admin-popup-body` - Scrollable content area
- `.admin-close-button` - Close button with hover effect

## Step Styling (for tutorials/guides)

- `.admin-step-title` - Step number (e.g., "Step 1:")
- `.admin-step-data` - Step title
- `.admin-step-contents` - Step description text

## Card Styling

- `.admin-card` - Card with hover effect
- `.admin-input-readonly` - Read-only input with hover effect

## Usage Example

```jsx
import '@/styles/admin.css';

function AdminComponent() {
  return (
    <div>
      <Button className="admin-btn-primary">
        Save Changes
      </Button>
      
      <Button className="admin-btn-secondary">
        Cancel
      </Button>
    </div>
  );
}
```

## Current Implementation

### AdminStripe Component
- **Create Button**: Purple (`#a78bfa`) with dark purple hover (`#3c315e`)
- **Update Button**: Purple (`#a78bfa`) with dark purple hover (`#3c315e`)
- **Help Icon**: Amber (`#f59e0b`) with dark amber hover (`#d97706`)

## Customization

To change the global admin colors, update the CSS variables in `src/styles/admin.css`:

```css
:root {
  --admin-primary-color: #your-color;
  --admin-primary-hover: #your-hover-color;
  --admin-secondary-color: #your-secondary-color;
  --admin-secondary-hover: #your-secondary-hover;
}
```

All components using the CSS classes will automatically update!
