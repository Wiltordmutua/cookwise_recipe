# Accessibility & Responsiveness Notes

## Accessibility Features

### Color Contrast
- **Primary Text on Cream**: 12.6:1 ratio (WCAG AAA compliant)
- **Primary Text on White**: 21:1 ratio (WCAG AAA compliant)
- **Gold Focus Ring**: 4.5:1 ratio (WCAG AA compliant)
- **Button Text**: All button text meets WCAG AA standards

### Keyboard Navigation
- **Tab Order**: Logical tab sequence through all interactive elements
- **Focus Indicators**: 2px gold focus ring with 2px offset for clear visibility
- **Keyboard Shortcuts**: 
  - Enter/Space for button activation
  - Arrow keys for rating and stepper components
  - Escape to close modals and menus

### Screen Reader Support
- **ARIA Labels**: All icon buttons have descriptive `aria-label` attributes
- **Semantic HTML**: Proper use of `button`, `link`, `heading`, and form elements
- **Live Regions**: Toast notifications announce changes to screen readers
- **Form Labels**: All form inputs have associated labels or `aria-labelledby`

### Form Accessibility
- **Required Fields**: Clear indication with `*` and `required` attributes
- **Error Messages**: Associated with inputs using `aria-describedby`
- **Field Validation**: Real-time validation with accessible error announcements
- **Instructions**: Helper text provides context for complex form fields

## Responsive Design Breakpoints

### Mobile-First Approach
- **Base Styles**: Optimized for mobile (320px+)
- **Progressive Enhancement**: Features added at larger breakpoints
- **Touch-Friendly**: 44px minimum touch targets on mobile

### Breakpoint System
```typescript
xs: 0px      // Mobile phones (portrait)
sm: 600px    // Mobile phones (landscape) / Small tablets
md: 900px    // Tablets (portrait)
lg: 1200px   // Desktops / Tablets (landscape)
xl: 1536px   // Large desktops
```

### Component Responsiveness

#### RecipeCard Grid
- **Mobile (xs)**: 1 column, full width cards
- **Tablet (md)**: 2 columns, optimized spacing
- **Desktop (lg)**: 3 columns, standard layout
- **Large Desktop (xl)**: 4 columns, maximum density

#### Navigation Header
- **Mobile**: Hamburger menu with slide-out navigation
- **Tablet+**: Full horizontal navigation with search bar
- **Desktop**: Expanded search with user menu

#### Recipe Form
- **Mobile**: Single column, stacked form fields
- **Tablet**: Two-column grid for related fields
- **Desktop**: Optimized spacing with side-by-side layout

### Typography Scaling
- **Mobile**: Smaller font sizes for better fit
- **Tablet**: Standard font sizes with adjusted line heights
- **Desktop**: Full typography scale with optimal reading width

### Image Handling
- **Responsive Images**: `object-fit: cover` maintains aspect ratios
- **Loading States**: Skeleton placeholders during image load
- **Fallbacks**: Placeholder images for missing content

## Touch Interactions

### Mobile Gestures
- **Tap**: Standard button and link interactions
- **Long Press**: Context menus where appropriate
- **Swipe**: Horizontal scrolling for image galleries
- **Pinch/Zoom**: Disabled for app-like experience

### Touch Targets
- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: Adequate spacing between touch targets
- **Visual Feedback**: Immediate response to touch interactions

## Performance Considerations

### Responsive Images
- **Lazy Loading**: Images load as they enter viewport
- **Multiple Sizes**: Different image sizes for different screen densities
- **WebP Support**: Modern image formats with fallbacks

### Component Optimization
- **Code Splitting**: Components load on demand
- **Memoization**: Expensive calculations cached appropriately
- **Virtual Scrolling**: For large lists on mobile devices

## Testing Recommendations

### Accessibility Testing
- **Screen Readers**: Test with NVDA, JAWS, and VoiceOver
- **Keyboard Only**: Navigate entire app using only keyboard
- **Color Blindness**: Test with color blindness simulators
- **High Contrast**: Verify visibility in high contrast mode

### Responsive Testing
- **Device Testing**: Test on actual devices when possible
- **Browser DevTools**: Use responsive design mode
- **Network Conditions**: Test on slow connections
- **Orientation**: Test both portrait and landscape modes

### Cross-Browser Testing
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Accessibility Tools**: axe-core, WAVE, Lighthouse

## Implementation Notes

### CSS Custom Properties
```css
/* Responsive spacing using theme spacing units */
.mobile-padding { padding: theme.spacing(2); }
.tablet-padding { padding: theme.spacing(3); }
.desktop-padding { padding: theme.spacing(4); }
```

### Component Patterns
- **Container Queries**: Use MUI's breakpoint system for component-level responsiveness
- **Conditional Rendering**: Show/hide elements based on screen size
- **Progressive Disclosure**: Reveal advanced features on larger screens

### Accessibility Patterns
- **Focus Management**: Programmatic focus for modals and navigation
- **Skip Links**: "Skip to main content" for keyboard users
- **Loading States**: Announce loading and completion to screen readers
