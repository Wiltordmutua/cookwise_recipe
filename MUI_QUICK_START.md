# CookWise MUI - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Material UI Dependencies

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### 2. Update main.tsx

Replace the import in `src/main.tsx`:

```jsx
// Before
import App from "./App";

// After
import AppMUI from "./AppMUI";
```

And update the render:

```jsx
createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <AppMUI />  {/* Changed from <App /> */}
  </ConvexAuthProvider>,
);
```

### 3. Start the Development Server

```bash
npm run dev
```

That's it! Your app now uses Material UI with the new color palette.

## 📁 What Was Created

### Core Files
- ✅ `src/theme/muiTheme.js` - Complete theme configuration
- ✅ `src/AppMUI.jsx` - Main app with ThemeProvider
- ✅ `src/components/mui/Navbar.jsx` - Navigation with mobile drawer
- ✅ `src/components/mui/RecipeCard.jsx` - Recipe card component
- ✅ `src/components/mui/SignInForm.jsx` - Authentication form
- ✅ `src/components/mui/SignOutButton.jsx` - Sign out button
- ✅ `src/components/mui/Notifications.jsx` - Notifications popover
- ✅ `src/pages/mui/Home.jsx` - Home page with recipe grid

## 🎨 New Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Forest Green | `#105935` | Primary buttons, headings, success |
| Dark Teal | `#345A53` | Secondary buttons, links |
| Muted Olive Green | `#6C755F` | Accents, chips, badges |
| Dark Reddish-Brown | `#633024` | Errors, warnings |
| White | `#FFFFFF` | Background |
| Black/Dark Grey | `#222222` | Primary text |

## 🔧 Quick Customization

### Change Primary Color

Edit `src/theme/muiTheme.js`:

```javascript
palette: {
  primary: {
    main: '#YOUR_COLOR', // Change this
  },
}
```

### Adjust Spacing

```javascript
spacing: 8, // Change base unit (default: 8px)
```

### Modify Border Radius

```javascript
shape: {
  borderRadius: 12, // Change this (default: 12px)
}
```

## 📱 Responsive Breakpoints

```javascript
xs: 0px      // Mobile
sm: 600px    // Tablet
md: 900px    // Desktop
lg: 1200px   // Large Desktop
xl: 1536px   // Extra Large
```

## 🎯 Common Patterns

### Using Theme Colors

```jsx
<Box sx={{ color: 'primary.main' }}>
  Text in forest green
</Box>
```

### Responsive Sizing

```jsx
<Typography
  variant="h1"
  sx={{
    fontSize: { xs: '2rem', md: '3rem' }
  }}
>
  Responsive Heading
</Typography>
```

### Spacing

```jsx
<Box sx={{
  p: 2,    // padding: 16px
  m: 3,    // margin: 24px
  gap: 1.5 // gap: 12px
}}>
  Content
</Box>
```

## 🐛 Troubleshooting

### Theme not applying?
Make sure `ThemeProvider` wraps your app in `AppMUI.jsx`

### Colors look wrong?
Use theme color keys like `'primary.main'` instead of hex codes

### Layout broken?
Check that you're using MUI Grid instead of CSS Grid

### Fonts not loading?
Inter font is loaded via CSS, ensure `index.css` is imported

## 📚 Next Steps

1. Review `MUI_IMPLEMENTATION_GUIDE.md` for detailed documentation
2. Migrate remaining pages (RecipeDetail, CreateRecipe, etc.)
3. Customize theme to match your brand
4. Test on multiple devices and screen sizes

## 💡 Pro Tips

- Use `sx` prop for styling instead of inline styles
- Leverage MUI's built-in responsive props
- Always use theme values for consistency
- Test accessibility with keyboard navigation
- Use Skeleton components for loading states

## 🆘 Need Help?

- Check the [MUI Documentation](https://mui.com/)
- Review example components in `src/components/mui/`
- See the implementation guide for detailed patterns

---

**Happy Coding! 🎉**
