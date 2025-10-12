# Cookwise Migration Checklist: Tailwind → Material-UI

## Phase 1: Setup & Dependencies

### 1. Install MUI Dependencies
```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/system
npm install @mui/lab # for advanced components
```

### 2. Remove Tailwind Dependencies
```bash
npm uninstall tailwindcss @tailwindcss/typography autoprefixer postcss
```

### 3. Update Configuration Files
- [ ] Remove `tailwind.config.js`
- [ ] Remove `postcss.config.cjs`
- [ ] Update `vite.config.ts` to remove Tailwind plugin
- [ ] Remove Tailwind imports from `src/index.css`

## Phase 2: Theme Integration

### 4. Theme Setup
- [ ] Copy `src/theme.ts` to your project
- [ ] Copy `src/ThemeProvider.tsx` to your project
- [ ] Wrap your app with `<ThemeProvider>` in `main.tsx` or `App.tsx`
- [ ] Add `<CssBaseline />` for consistent baseline styles

### 5. Update Global Styles
Replace Tailwind's `@tailwind` directives in `src/index.css`:
```css
/* Remove these lines */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep only custom styles and add MUI overrides if needed */
```

## Phase 3: Component Migration

### 6. Layout Components

#### App.tsx → AppHeader.tsx
**Before (Tailwind)**:
```tsx
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-accent shadow-sm">
```

**After (MUI)**:
```tsx
<AppBar position="sticky" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
```

#### Grid Layouts
**Before (Tailwind)**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

**After (MUI)**:
```tsx
<Box sx={{ 
  display: 'grid', 
  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
  gap: 3 
}}>
```

### 7. Card Components

#### RecipeCard Migration
**Before (Tailwind)**:
```tsx
<div className="bg-white rounded-container shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
```

**After (MUI)**:
```tsx
<Card sx={{ 
  borderRadius: 12, 
  boxShadow: '0px 4px 8px rgba(46, 71, 59, 0.12)',
  transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': { transform: 'scale(1.02)', boxShadow: '0px 8px 16px rgba(46, 71, 59, 0.15)' }
}}>
```

### 8. Form Components

#### Input Fields
**Before (Tailwind)**:
```tsx
<input className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
```

**After (MUI)**:
```tsx
<TextField 
  fullWidth 
  sx={{ 
    '& .MuiOutlinedInput-root': { 
      borderRadius: 12,
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 }
    }
  }} 
/>
```

#### Buttons
**Before (Tailwind)**:
```tsx
<button className="px-8 py-3 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors">
```

**After (MUI)**:
```tsx
<Button 
  variant="contained" 
  sx={{ 
    px: 4, 
    py: 1.5, 
    borderRadius: 12, 
    fontWeight: 600,
    '&:hover': { transform: 'translateY(-1px)' }
  }}
>
```

### 9. Typography Migration

**Before (Tailwind)**:
```tsx
<h1 className="text-4xl font-bold text-primary mb-4">Title</h1>
<p className="text-lg text-text">Description</p>
```

**After (MUI)**:
```tsx
<Typography variant="h1" sx={{ mb: 2 }}>Title</Typography>
<Typography variant="body1">Description</Typography>
```

### 10. Spacing Migration

**Before (Tailwind)**:
```tsx
<div className="mb-8 p-6 space-y-4">
```

**After (MUI)**:
```tsx
<Box sx={{ mb: 4, p: 3 }}>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
```

## Phase 4: Color Mapping

### 11. Color Class Replacements
| Tailwind Class | MUI Theme Token | Usage |
|----------------|-----------------|-------|
| `bg-primary` | `backgroundColor: 'primary.main'` | Primary backgrounds |
| `text-primary` | `color: 'primary.main'` | Primary text |
| `border-primary` | `borderColor: 'primary.main'` | Primary borders |
| `bg-secondary` | `backgroundColor: 'secondary.main'` | Secondary backgrounds |
| `text-secondary` | `color: 'text.secondary'` | Muted text |
| `bg-accent` | `backgroundColor: 'info.main'` | Accent elements |

### 12. Background Colors
**Before (Tailwind)**:
```tsx
<div className="bg-background"> // #F7F3E8
<div className="bg-white"> // #FFFFFF
```

**After (MUI)**:
```tsx
<Box sx={{ backgroundColor: 'background.default' }}> // #F7F3E8
<Box sx={{ backgroundColor: 'background.paper' }}> // #FFFFFF
```

## Phase 5: Interactive Components

### 13. Rating Component
**Before (Custom StarRating)**:
```tsx
<StarRating rating={recipe.averageRating} readonly />
```

**After (MUI Rating)**:
```tsx
<Rating 
  value={recipe.averageRating} 
  readOnly 
  sx={{ '& .MuiRating-iconFilled': { color: 'warning.main' } }} 
/>
```

### 14. Chip Components
**Before (Tailwind)**:
```tsx
<span className="px-3 py-1 bg-accent text-text text-sm rounded-full">Tag</span>
```

**After (MUI)**:
```tsx
<Chip 
  label="Tag" 
  sx={{ backgroundColor: 'info.main', color: 'text.primary' }} 
/>
```

### 15. Avatar Components
**Before (Tailwind)**:
```tsx
<div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
```

**After (MUI)**:
```tsx
<Avatar sx={{ backgroundColor: 'info.main', color: 'text.primary' }}>
```

## Phase 6: Responsive Design

### 16. Breakpoint Mapping
| Tailwind | MUI Breakpoint | Usage |
|----------|----------------|-------|
| `sm:` | `xs` (0px+) | Mobile |
| `md:` | `sm` (600px+) | Tablet |
| `lg:` | `md` (900px+) | Desktop |
| `xl:` | `lg` (1200px+) | Large Desktop |

### 17. Responsive Utilities
**Before (Tailwind)**:
```tsx
<div className="hidden md:flex space-x-6">
```

**After (MUI)**:
```tsx
<Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
```

## Phase 7: Animation & Transitions

### 18. Hover Effects
**Before (Tailwind)**:
```tsx
<div className="hover:scale-105 transition-transform duration-300">
```

**After (MUI)**:
```tsx
<Box sx={{ 
  transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': { transform: 'scale(1.02)' }
}}>
```

### 19. Loading States
**Before (Tailwind)**:
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary">
```

**After (MUI)**:
```tsx
<CircularProgress sx={{ color: 'primary.main' }} />
```

## Phase 8: Accessibility

### 20. Focus Management
- [ ] Replace custom focus styles with MUI's built-in focus management
- [ ] Ensure all interactive elements have proper ARIA labels
- [ ] Test keyboard navigation with Tab, Enter, and Space keys
- [ ] Verify color contrast ratios meet WCAG AA standards

### 21. Screen Reader Support
- [ ] Add `aria-label` attributes to icon buttons
- [ ] Use semantic HTML elements (Button, Link, etc.)
- [ ] Implement proper heading hierarchy

## Phase 9: Testing & Validation

### 22. Visual Regression Testing
- [ ] Compare before/after screenshots of all pages
- [ ] Test on multiple screen sizes (mobile, tablet, desktop)
- [ ] Verify hover and focus states work correctly
- [ ] Check color contrast in different themes

### 23. Functionality Testing
- [ ] Test all form interactions
- [ ] Verify navigation works correctly
- [ ] Test responsive breakpoints
- [ ] Validate accessibility with screen readers

## Phase 10: Performance Optimization

### 24. Bundle Size
- [ ] Remove unused Tailwind classes
- [ ] Use MUI's tree-shaking for smaller bundles
- [ ] Consider code splitting for large components

### 25. Runtime Performance
- [ ] Replace CSS-in-JS with static styles where possible
- [ ] Use `sx` prop efficiently (avoid creating new objects in render)
- [ ] Implement proper memoization for expensive components

## Migration Tips

1. **Start with layout components** (App, Header, Navigation)
2. **Migrate one page at a time** to avoid breaking the entire app
3. **Use MUI's responsive utilities** instead of custom breakpoints
4. **Leverage the theme system** for consistent spacing and colors
5. **Test thoroughly** after each major component migration

## Common Pitfalls to Avoid

- Don't mix Tailwind and MUI styles in the same component
- Avoid hardcoding colors - use theme tokens instead
- Remember to handle loading and error states with MUI components
- Ensure proper TypeScript types for all MUI components
- Test accessibility features after migration
