# CookWise Recipe App - Material UI Implementation Guide

## 🎨 Overview

This guide documents the complete transformation of the CookWise recipe app to use Material UI (MUI) v5/v6 with the new color palette.

## 📦 New Color Palette

### Theme Colors
```javascript
Primary (Forest Green): #105935
Secondary (Dark Teal): #345A53
Accent (Muted Olive Green): #6C755F
Error (Dark Reddish-Brown): #633024
Background: #FFFFFF
Text Primary: #222222
Text Secondary: #6C755F
```

## 🗂️ File Structure

```
src/
├── theme/
│   └── muiTheme.js              # Complete MUI theme configuration
├── components/
│   └── mui/
│       ├── Navbar.jsx           # App navigation with mobile drawer
│       ├── RecipeCard.jsx       # Recipe card component
│       ├── SignInForm.jsx       # Authentication form
│       ├── SignOutButton.jsx    # Sign out button
│       └── Notifications.jsx    # Notifications popover
├── pages/
│   └── mui/
│       └── Home.jsx             # Home page with recipe grid
└── AppMUI.jsx                   # Main app with ThemeProvider
```

## 🚀 Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### Step 2: Update main.tsx

Replace the existing App import with AppMUI:

```jsx
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import AppMUI from "./AppMUI"; // Changed from App
import { ThemeProvider } from "./ThemeProvider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <AppMUI />
  </ConvexAuthProvider>,
);
```

### Step 3: Theme Configuration

The theme is defined in `src/theme/muiTheme.js` with:

- **Color Palette**: All brand colors mapped to MUI palette
- **Typography**: Inter font family with proper weights
- **Spacing**: 8px base unit
- **Shadows**: Custom shadows using theme colors
- **Component Overrides**: Consistent styling for all MUI components

### Step 4: Component Migration

#### Navbar Component
- Uses `AppBar` and `Toolbar` from MUI
- Responsive with mobile `Drawer`
- Integrates `Notifications` and user profile
- Sticky positioning with backdrop blur

#### RecipeCard Component
- Uses `Card`, `CardMedia`, `CardContent`, `CardActions`
- Skeleton loading states
- Hover effects with scale transform
- Rating component for reviews
- Chips for tags and cuisine

#### SignInForm Component
- Uses `TextField` for inputs
- `Button` components with proper variants
- `Paper` container with elevation
- Form validation and error handling

#### Home Page
- Uses `Container` for max-width constraint
- `Grid` system for responsive recipe layout
- `CircularProgress` for loading states
- Authenticated/Unauthenticated views

## 🎯 Key Features

### Responsive Design
```jsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    {/* Recipe Card */}
  </Grid>
</Grid>
```

Breakpoints:
- xs: <600px (mobile)
- sm: 600px (tablet)
- md: 900px (desktop)
- lg: 1200px (large desktop)
- xl: 1536px (extra large)

### Theme Usage
```jsx
// Using theme colors
sx={{
  color: 'primary.main',
  backgroundColor: 'background.paper',
  borderColor: 'divider',
}}

// Using theme spacing
sx={{
  p: 2,        // padding: 16px (2 * 8px)
  mb: 3,       // margin-bottom: 24px (3 * 8px)
  gap: 1.5,    // gap: 12px (1.5 * 8px)
}}

// Using theme breakpoints
sx={{
  fontSize: { xs: '1rem', md: '1.5rem' },
  py: { xs: 4, md: 6 },
}}
```

### Accessibility Features
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators with visible outlines
- Color contrast meets WCAG AA standards
- Semantic HTML structure

### Loading States
```jsx
// Skeleton for cards
<Skeleton variant="rectangular" height={200} />
<Skeleton variant="text" height={28} width="80%" />

// Circular progress for pages
<CircularProgress size={48} />
```

## 📋 Component API

### RecipeCard Props
```jsx
<RecipeCard
  recipe={{
    id: string,
    title: string,
    description: string,
    imageUrl: string,
    prepTime: number,
    servings: number,
    cuisine: string,
    tags: string[],
    rating: number,
    totalRatings: number,
    author: { username: string, avatar: string },
    isFavorite: boolean,
  }}
  onFavoriteToggle={(id) => {}}
  loading={false}
/>
```

### Navbar
```jsx
<Navbar />
// No props - uses Convex auth hooks internally
```

### SignInForm
```jsx
<SignInForm />
// No props - handles authentication internally
```

## 🎨 Styling Patterns

### Using sx Prop (Recommended)
```jsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    borderRadius: 2,
    backgroundColor: 'background.paper',
    boxShadow: 2,
  }}
>
  {/* Content */}
</Box>
```

### Theme-aware Colors
```jsx
// Good ✅
sx={{ color: 'primary.main' }}
sx={{ backgroundColor: 'background.paper' }}

// Avoid ❌
sx={{ color: '#105935' }}
sx={{ backgroundColor: '#F9F9F9' }}
```

### Responsive Values
```jsx
sx={{
  width: { xs: '100%', md: '50%' },
  p: { xs: 2, sm: 3, md: 4 },
  fontSize: { xs: '0.875rem', md: '1rem' },
}}
```

## 🔧 Customization

### Adding New Colors
Edit `src/theme/muiTheme.js`:

```javascript
palette: {
  // Add custom color
  tertiary: {
    main: '#YOUR_COLOR',
    light: '#LIGHTER_VARIANT',
    dark: '#DARKER_VARIANT',
    contrastText: '#FFFFFF',
  },
}
```

### Overriding Component Styles
```javascript
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        // Your custom styles
      },
    },
  },
}
```

## 📱 Mobile Optimization

### Mobile Drawer Navigation
- Hamburger menu on screens < 900px
- Smooth slide-in animation
- Touch-friendly tap targets (min 48px)

### Responsive Typography
```jsx
<Typography
  variant="h2"
  sx={{
    fontSize: { xs: '2rem', md: '2.5rem' },
  }}
>
  Heading
</Typography>
```

### Grid Breakpoints
```jsx
<Grid item xs={12} sm={6} md={4} lg={3}>
  {/* Full width on mobile, 2 cols on tablet, 3 on desktop, 4 on large */}
</Grid>
```

## ⚡ Performance Tips

1. **Use Skeleton Loaders**: Show content structure while loading
2. **Lazy Load Images**: Use `loading="lazy"` on CardMedia
3. **Memoize Components**: Use React.memo for expensive renders
4. **Optimize Re-renders**: Use proper key props in lists

## 🧪 Testing Checklist

- [ ] All pages render correctly
- [ ] Responsive design works on all breakpoints
- [ ] Authentication flow works
- [ ] Recipe cards display properly
- [ ] Navigation works (desktop and mobile)
- [ ] Notifications popover functions
- [ ] Forms submit correctly
- [ ] Loading states appear
- [ ] Hover effects work
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient

## 🚧 Migration TODO

To complete the full migration, create MUI versions of:

1. **RecipeDetail Page**
   - Use Card for recipe container
   - Grid for ingredients/instructions layout
   - Rating component for reviews
   - Comments section with List components

2. **CreateRecipe Page**
   - TextField for all inputs
   - Select for dropdowns
   - Dynamic ingredient/step lists
   - File upload with preview

3. **AIRecipes Page**
   - Tabs component for navigation
   - TextField for inputs
   - Grid for results
   - Loading states

4. **Search Page**
   - TextField for search input
   - Select for filters
   - Grid for results

5. **Profile Page**
   - Card for profile header
   - Avatar component
   - Button for follow action
   - Grid for user recipes

## 📚 Resources

- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [MUI Theme Configuration](https://mui.com/material-ui/customization/theming/)
- [MUI Component API](https://mui.com/material-ui/api/button/)
- [Emotion Styling](https://emotion.sh/docs/introduction)

## 🎯 Best Practices

1. **Always use theme values** instead of hardcoded colors
2. **Use sx prop** for component-specific styles
3. **Leverage MUI Grid** for layouts instead of CSS Grid
4. **Use proper Typography variants** for text hierarchy
5. **Implement loading states** for better UX
6. **Test on multiple screen sizes** during development
7. **Follow accessibility guidelines** (ARIA labels, keyboard nav)
8. **Keep components modular** and reusable

## 🐛 Common Issues

### Issue: Theme not applying
**Solution**: Ensure ThemeProvider wraps your app in main.tsx

### Issue: Colors not showing
**Solution**: Use theme color keys (e.g., 'primary.main') not hex codes

### Issue: Responsive not working
**Solution**: Use theme.breakpoints in sx prop, not media queries

### Issue: Spacing inconsistent
**Solution**: Use theme.spacing() values (e.g., p: 2, m: 3)

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Author**: CookWise Development Team
