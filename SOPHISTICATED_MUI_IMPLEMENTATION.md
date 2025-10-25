# CookWise Recipe App - Sophisticated MUI Design System

## 🎨 Design Philosophy

**Modern & Sophisticated**: Clean lines, subtle gradients, premium shadows  
**Smooth Interactions**: Fluid transitions (150-350ms), micro-animations, elegant hover effects  
**Culinary Aesthetic**: Warm, inviting feel with professional polish  
**Accessible**: WCAG AA compliance, high contrast, clear focus states  
**Responsive**: Mobile-first design with adaptive layouts

---

## 🎯 Exact Design Tokens

### Color Palette

| Role | Color | Hex | RGB | Usage |
|------|-------|-----|-----|-------|
| **Primary** | Muted Olive Green | `#6C755F` | `rgb(108, 117, 95)` | Primary actions, CTAs, active states, navigation |
| **Secondary** | Dark Teal | `#345A53` | `rgb(52, 90, 83)` | Secondary actions, headers, emphasis, accents |
| **Success** | Forest Green | `#105935` | `rgb(16, 89, 53)` | Success states, confirmations, positive feedback |
| **Error** | Dark Reddish-Brown | `#633024` | `rgb(99, 48, 36)` | Errors, warnings, destructive actions |
| **Warning** | Muted Olive Green | `#6C755F` | `rgb(108, 117, 95)` | Star ratings, warnings |
| **Info** | Dark Teal | `#345A53` | `rgb(52, 90, 83)` | Info states, notifications |
| **Background** | White | `#FFFFFF` | `rgb(255, 255, 255)` | Main page background |
| **Paper** | White | `#FFFFFF` | `rgb(255, 255, 255)` | Cards, modals, elevated surfaces |
| **Text Primary** | Black/Dark Grey | `#222222` | `rgb(34, 34, 34)` | Main text |
| **Text Secondary** | Muted Olive Green | `#6C755F` | `rgb(108, 117, 95)` | Secondary text, labels, metadata |

### Typography Scale

```javascript
Font Family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

h1: 32px (2rem), weight 800, line-height 1.2, letter-spacing -0.02em
h2: 28px (1.75rem), weight 700, line-height 1.2, letter-spacing -0.02em
h3: 24px (1.5rem), weight 600, line-height 1.2, letter-spacing -0.02em
h4: 20px (1.25rem), weight 500, line-height 1.2
body1: 16px (1rem), weight 400, line-height 1.5
body2: 14px (0.875rem), weight 400, line-height 1.5
caption: 14px (0.875rem), weight 400, line-height 1.4
button: 14px (0.875rem), weight 600, letter-spacing 0.5px
```

### Spacing System

**Base Unit**: 8px  
**Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

```javascript
// Usage in MUI
sx={{ p: 2 }}  // 16px padding
sx={{ m: 3 }}  // 24px margin
sx={{ gap: 1.5 }}  // 12px gap
```

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 4px | Scrollbars |
| Medium | 8px | Buttons, inputs |
| Large | 12px | Cards, standard elements, modals |
| Extra Large | 16px | Hero sections, major surfaces |
| Pill | 999px | Badges, tags, chips |

### Shadow System (Elevation)

```javascript
Level 1: 0 1px 3px rgba(34, 34, 34, 0.12), 0 1px 2px rgba(34, 34, 34, 0.24)
Level 2: 0 3px 6px rgba(34, 34, 34, 0.16), 0 3px 6px rgba(34, 34, 34, 0.23)
Level 3: 0 10px 20px rgba(34, 34, 34, 0.19), 0 6px 6px rgba(34, 34, 34, 0.23)
Level 4: 0 14px 28px rgba(34, 34, 34, 0.25), 0 10px 10px rgba(34, 34, 34, 0.22)
Level 5: 0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)
```

### Motion & Transitions

| Speed | Duration | Easing | Usage |
|-------|----------|--------|-------|
| **Fast** | 150ms | ease-out | Hover states, icon buttons |
| **Medium** | 250ms | ease-out | Card interactions, buttons |
| **Slow** | 350ms | ease-out | Page transitions, modals |
| **Standard** | cubic-bezier(0.4, 0, 0.2, 1) | Material Design | All transitions |

### Breakpoints

```javascript
xs: 0px      // Mobile phones
sm: 600px    // Tablets (portrait)
md: 900px    // Tablets (landscape), small desktops
lg: 1200px   // Desktops
xl: 1536px   // Large desktops
```

---

## 🎨 Component Design Patterns

### Buttons

**Primary (Gradient)**:
```javascript
background: linear-gradient(135deg, #6C755F 0%, #4A523F 100%)
boxShadow: 0 2px 8px rgba(108, 117, 95, 0.2)
hover: linear-gradient(135deg, #8A9580 0%, #6C755F 100%)
hover boxShadow: 0 4px 16px rgba(108, 117, 95, 0.3)
transform: translateY(-1px) on hover
```

**Secondary (Gradient)**:
```javascript
background: linear-gradient(135deg, #345A53 0%, #1E3A35 100%)
boxShadow: 0 2px 8px rgba(52, 90, 83, 0.2)
hover: linear-gradient(135deg, #4A7A6F 0%, #345A53 100%)
```

**Outlined**:
```javascript
borderColor: #6C755F
borderWidth: 1.5px
hover: backgroundColor rgba(108, 117, 95, 0.08)
```

### Cards

```javascript
borderRadius: 12px
boxShadow: 0 2px 8px rgba(34, 34, 34, 0.08)
transition: all 250ms ease-out
hover: {
  boxShadow: 0 4px 16px rgba(34, 34, 34, 0.12)
  transform: translateY(-2px)
}
```

### Text Fields

```javascript
borderRadius: 8px
border: #E0E0E0 (default)
hover border: #6C755F
focus border: #6C755F (2px)
label color: #6C755F
```

### Chips

```javascript
borderRadius: 16px
fontWeight: 500
primary: backgroundColor #6C755F, color #FFFFFF
secondary: backgroundColor #345A53, color #FFFFFF
outlined: borderColor #6C755F, borderWidth 1.5px
```

### Navigation/AppBar

```javascript
backgroundColor: #FFFFFF
color: #222222
boxShadow: 0 1px 3px rgba(34, 34, 34, 0.12)
sticky position
```

### Tabs

```javascript
textTransform: none
fontWeight: 600
selected: {
  backgroundColor: #6C755F
  color: #FFFFFF
}
hover: backgroundColor rgba(108, 117, 95, 0.08)
transition: all 150ms ease-out
```

### Ratings

```javascript
iconFilled: color #6C755F (Muted Olive Green)
iconHover: color #8A9580
```

### Scrollbars

```javascript
width: 8px
track: background #F5F5F5, borderRadius 4px
thumb: background #6C755F, borderRadius 4px
thumb hover: background #4A523F
```

---

## 🚀 Implementation Checklist

### ✅ Completed

- [x] Theme configuration with exact design tokens
- [x] Color palette implementation
- [x] Typography system
- [x] Spacing system (8px base)
- [x] Shadow system (5 levels)
- [x] Border radius system
- [x] Transition system
- [x] Button components with gradients
- [x] Card components with hover effects
- [x] TextField styling
- [x] Chip styling
- [x] AppBar styling
- [x] Tab styling
- [x] Rating styling
- [x] Custom scrollbars
- [x] CssBaseline overrides

### 📋 Component Updates Needed

- [ ] Update Navbar with new color scheme
- [ ] Update RecipeCard with gradient buttons
- [ ] Update SignInForm with new TextField styling
- [ ] Update Home page layout
- [ ] Update RecipeDetail page
- [ ] Update CreateRecipe form
- [ ] Update AIRecipes tabs
- [ ] Update Search page
- [ ] Update Profile page
- [ ] Update Notifications dropdown

---

## 💻 Usage Examples

### Using Theme Colors

```jsx
// Primary color
<Button variant="contained" color="primary">
  Primary Action
</Button>

// Secondary color
<Button variant="contained" color="secondary">
  Secondary Action
</Button>

// Success color
<Alert severity="success">Success message</Alert>

// Custom usage
<Box sx={{ color: 'primary.main', bgcolor: 'background.paper' }}>
  Content
</Box>
```

### Responsive Design

```jsx
<Box
  sx={{
    p: { xs: 2, sm: 3, md: 4 },
    fontSize: { xs: '1rem', md: '1.25rem' },
    display: { xs: 'block', md: 'flex' },
  }}
>
  Responsive content
</Box>
```

### Gradient Buttons

```jsx
<Button
  variant="contained"
  color="primary"
  sx={{
    background: 'linear-gradient(135deg, #6C755F 0%, #4A523F 100%)',
    '&:hover': {
      background: 'linear-gradient(135deg, #8A9580 0%, #6C755F 100%)',
    },
  }}
>
  Gradient Button
</Button>
```

### Card with Hover Effect

```jsx
<Card
  sx={{
    transition: 'all 250ms ease-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 3,
    },
  }}
>
  <CardContent>Card content</CardContent>
</Card>
```

### Custom Chips

```jsx
<Chip
  label="Primary Tag"
  color="primary"
  sx={{ borderRadius: '16px' }}
/>

<Chip
  label="Outlined Tag"
  variant="outlined"
  sx={{ borderWidth: '1.5px' }}
/>
```

---

## 🎯 Key Features

### Sophisticated Design Elements

1. **Gradient Buttons**: Primary and secondary buttons use subtle gradients for depth
2. **Smooth Transitions**: All interactions use 150-350ms transitions with ease-out
3. **Hover Effects**: Cards lift on hover, buttons translate up
4. **Custom Scrollbars**: Themed scrollbars matching the color palette
5. **Shadow System**: 5-level elevation system for depth hierarchy
6. **Typography Hierarchy**: Clear visual hierarchy with proper weights and sizes

### Accessibility Features

- ✅ WCAG AA color contrast ratios
- ✅ Keyboard navigation support
- ✅ Focus indicators (2px borders)
- ✅ ARIA labels on interactive elements
- ✅ Semantic HTML structure
- ✅ Screen reader friendly

### Performance Optimizations

- ✅ Hardware-accelerated transforms
- ✅ Efficient transition properties
- ✅ Optimized shadow rendering
- ✅ Minimal re-renders with proper memoization

---

## 📱 Responsive Behavior

### Mobile (xs: 0-599px)
- Single column layouts
- Larger touch targets (min 48px)
- Simplified navigation (drawer)
- Stacked forms
- Full-width cards

### Tablet (sm: 600-899px)
- 2-column grids
- Horizontal navigation
- Side-by-side forms
- Medium card sizes

### Desktop (md: 900-1199px)
- 3-column grids
- Full navigation bar
- Multi-column forms
- Standard card sizes

### Large Desktop (lg: 1200px+)
- 4-column grids
- Expanded layouts
- Maximum content width
- Optimal reading experience

---

## 🔧 Customization Guide

### Changing Primary Color

Edit `src/theme/muiTheme.js`:

```javascript
primary: {
  main: '#YOUR_COLOR',
  light: '#LIGHTER_VARIANT',
  dark: '#DARKER_VARIANT',
  contrastText: '#FFFFFF',
}
```

### Adjusting Transitions

```javascript
transitions: {
  duration: {
    fast: 150,
    medium: 250,
    slow: 350,
  },
}
```

### Custom Component Overrides

```javascript
components: {
  MuiYourComponent: {
    styleOverrides: {
      root: {
        // Your custom styles
      },
    },
  },
}
```

---

## 🐛 Troubleshooting

### Issue: Gradients not showing
**Solution**: Ensure you're using `background` not `backgroundColor` for gradients

### Issue: Hover effects not working
**Solution**: Check transition property includes the property you're animating

### Issue: Colors not applying
**Solution**: Use theme color keys (e.g., 'primary.main') not hex codes

### Issue: Responsive not working
**Solution**: Use breakpoint objects in sx prop, not media queries

---

## 📚 Resources

- [Material UI Documentation](https://mui.com/)
- [Theme Customization](https://mui.com/material-ui/customization/theming/)
- [Component API](https://mui.com/material-ui/api/button/)
- [Color Tool](https://m2.material.io/design/color/the-color-system.html)

---

**Version**: 2.0.0 (Sophisticated Design System)  
**Last Updated**: October 2025  
**Status**: ✅ Theme Complete, Components In Progress
