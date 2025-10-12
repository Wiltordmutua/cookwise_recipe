# MUI Component Overrides Documentation

This document outlines the key component customizations made in the Artcaffé theme and the reasoning behind each decision.

## Core Design Tokens

### Colors
- **Primary**: `#2E473B` (Dark Green) - Used for main actions, navigation, and brand elements
- **Secondary**: `#5C3A1C` (Brown) - Used for secondary actions and accent elements
- **Accent**: `#CBB37B` (Gold) - Used for highlights, ratings, and special elements
- **Background**: `#F7F3E8` (Cream) - Page background for warm, organic feel
- **Text**: `#1A1A1A` (Black) - Primary text for maximum readability

### Typography
- **Font**: Inter Variable - Modern, clean sans-serif with excellent readability
- **Scale**: Responsive typography from 14px (body2) to 36px (h1)
- **Weight**: 400-700 range with semantic weight mapping

## Component Overrides

### Button
**Override**: Custom borderRadius (12px), shadow system, hover transforms
**Why**: Creates depth and modern feel while maintaining accessibility. Transform on hover provides tactile feedback.

### AppBar
**Override**: Semi-transparent background with backdrop blur
**Why**: Modern glass-morphism effect that maintains readability while creating depth between header and content.

### Card
**Override**: Custom shadow progression, hover scale (1.02x), rounded corners
**Why**: Subtle hover effects create engaging interactions. Scale is minimal to avoid motion sickness while providing feedback.

### TextField
**Override**: Custom focus ring using accent gold, rounded borders
**Why**: Gold focus ring provides high contrast (4.5:1) while maintaining brand consistency. Rounded borders soften the interface.

### Chip
**Override**: Gold background with dark text, outlined variant uses gold border
**Why**: Gold chips create visual hierarchy for tags and categories while maintaining readability.

### Rating
**Override**: Gold filled stars, custom sizing options
**Why**: Gold stars align with brand while providing clear visual feedback for ratings.

### Avatar
**Override**: Gold background with dark text for initials
**Why**: Consistent with chip styling and provides good contrast for user initials.

### IconButton
**Override**: Subtle hover backgrounds, gold focus rings
**Why**: Maintains accessibility standards while providing clear interaction feedback.

### Stepper
**Override**: Gold active/completed states, muted inactive
**Why**: Clear progression indication while maintaining visual hierarchy.

### FormLabel
**Override**: Brown color for labels, consistent spacing
**Why**: Brown creates subtle hierarchy without overwhelming the form while maintaining brand consistency.

## Shadow System
- **Level 1**: Subtle card shadows (2px blur)
- **Level 2**: Standard card shadows (4px blur)
- **Level 3**: Hover card shadows (8px blur)
- **Level 4**: Header shadows (12px blur)

**Why**: Progressive shadow system creates depth hierarchy while maintaining the clean, modern aesthetic.

## Focus Management
- **Ring Color**: Accent gold (#CBB37B)
- **Ring Width**: 2px with 2px offset
- **Contrast**: 4.5:1 ratio for accessibility compliance

**Why**: Gold focus rings provide excellent visibility while maintaining brand consistency and meeting WCAG AA standards.

## Transition System
- **Duration**: 120ms (color), 180ms (transform/shadow)
- **Easing**: Cubic-bezier(0.4, 0, 0.2, 1) - Material Design standard
- **Properties**: Transform, box-shadow, background-color

**Why**: Consistent timing creates cohesive feel. Shorter durations for color changes, longer for transforms to feel natural.
