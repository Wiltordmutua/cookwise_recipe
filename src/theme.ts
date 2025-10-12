import { createTheme } from '@mui/material/styles';

// Artcaffé Color Palette - Exact tokens as specified
const artcaffePalette = {
  primary: {
    darkGreen: '#2E473B', // rgb(46,71,59)
    brown: '#5C3A1C',     // rgb(92,58,28)
  },
  accent: {
    gold: '#CBB37B',      // rgb(203,179,123)
  },
  background: {
    cream: '#F7F3E8',     // rgb(247,243,232)
  },
  white: '#FFFFFF',       // rgb(255,255,255)
  text: {
    black: '#1A1A1A',     // rgb(26,26,26) - assuming the extra 'B' was a typo
  },
} as const;

// Create the Material-UI theme
export const artcaffeTheme = createTheme({
  palette: {
    primary: {
      main: artcaffePalette.primary.darkGreen,
      dark: '#2F5451', // 10% darker for hover states
      light: '#4A6B5F', // 20% lighter for subtle backgrounds
      contrastText: artcaffePalette.white,
    },
    secondary: {
      main: artcaffePalette.primary.brown,
      dark: '#4A2E16', // 10% darker for hover
      light: '#7A5A3A', // 20% lighter
      contrastText: artcaffePalette.white,
    },
    background: {
      default: artcaffePalette.background.cream,
      paper: artcaffePalette.white,
    },
    text: {
      primary: artcaffePalette.text.black,
      secondary: '#666666', // Muted text
      disabled: '#999999',
    },
    info: {
      main: artcaffePalette.accent.gold,
      dark: '#B8A068',
      light: '#D4C599',
    },
    success: {
      main: '#4CAF50',
      dark: '#388E3C',
      light: '#81C784',
    },
    error: {
      main: '#F44336',
      dark: '#D32F2F',
      light: '#EF5350',
    },
    warning: {
      main: artcaffePalette.accent.gold,
      dark: '#B8A068',
      light: '#D4C599',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Inter Variable", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.25rem', // 36px - equivalent to text-4xl
      fontWeight: 700,
      lineHeight: 1.2,
      color: artcaffePalette.text.black,
    },
    h2: {
      fontSize: '1.875rem', // 30px - equivalent to text-3xl
      fontWeight: 700,
      lineHeight: 1.3,
      color: artcaffePalette.text.black,
    },
    h3: {
      fontSize: '1.5rem', // 24px - equivalent to text-2xl
      fontWeight: 600,
      lineHeight: 1.4,
      color: artcaffePalette.text.black,
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
      color: artcaffePalette.text.black,
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
      color: artcaffePalette.text.black,
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.4,
      color: artcaffePalette.text.black,
    },
    body1: {
      fontSize: '1rem', // 16px - base size
      lineHeight: 1.6,
      color: artcaffePalette.text.black,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      color: '#666666',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 12, // 0.75rem
  },
  spacing: 8, // 8px base unit (equivalent to gap-6 = 24px = 3 units)
  shadows: [
    'none',
    '0px 2px 4px rgba(46, 71, 59, 0.1)', // subtle card shadow
    '0px 4px 8px rgba(46, 71, 59, 0.12)', // card shadow
    '0px 8px 16px rgba(46, 71, 59, 0.15)', // card hover shadow
    '0px 12px 24px rgba(46, 71, 59, 0.18)', // header shadow
    '0px 16px 32px rgba(46, 71, 59, 0.2)',
    '0px 20px 40px rgba(46, 71, 59, 0.22)',
    '0px 24px 48px rgba(46, 71, 59, 0.24)',
    '0px 28px 56px rgba(46, 71, 59, 0.26)',
    '0px 32px 64px rgba(46, 71, 59, 0.28)',
    '0px 36px 72px rgba(46, 71, 59, 0.3)',
    '0px 40px 80px rgba(46, 71, 59, 0.32)',
    '0px 44px 88px rgba(46, 71, 59, 0.34)',
    '0px 48px 96px rgba(46, 71, 59, 0.36)',
    '0px 52px 104px rgba(46, 71, 59, 0.38)',
    '0px 56px 112px rgba(46, 71, 59, 0.4)',
    '0px 60px 120px rgba(46, 71, 59, 0.42)',
    '0px 64px 128px rgba(46, 71, 59, 0.44)',
    '0px 68px 136px rgba(46, 71, 59, 0.46)',
    '0px 72px 144px rgba(46, 71, 59, 0.48)',
    '0px 76px 152px rgba(46, 71, 59, 0.5)',
    '0px 80px 160px rgba(46, 71, 59, 0.52)',
    '0px 84px 168px rgba(46, 71, 59, 0.54)',
    '0px 88px 176px rgba(46, 71, 59, 0.56)',
  ],
  transitions: {
    duration: {
      shortest: 120,
      shorter: 150,
      short: 180,
      standard: 200,
      complex: 250,
      enteringScreen: 300,
      leavingScreen: 200,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0px 2px 4px rgba(46, 71, 59, 0.1)',
          transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0px 4px 8px rgba(46, 71, 59, 0.15)',
          },
          '&:focus': {
            outline: `2px solid ${artcaffePalette.accent.gold}`,
            outlineOffset: '2px',
          },
        },
        contained: {
          backgroundColor: artcaffePalette.primary.darkGreen,
          color: artcaffePalette.white,
          '&:hover': {
            backgroundColor: '#2F5451',
          },
        },
        outlined: {
          borderColor: artcaffePalette.primary.brown,
          color: artcaffePalette.primary.brown,
          '&:hover': {
            borderColor: artcaffePalette.primary.brown,
            backgroundColor: `${artcaffePalette.primary.brown}08`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0px 2px 4px rgba(46, 71, 59, 0.1)',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(46, 71, 59, 0.12)',
          transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 8px 16px rgba(46, 71, 59, 0.15)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
          color: artcaffePalette.text.black,
        },
        subheader: {
          color: '#666666',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingTop: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: artcaffePalette.accent.gold,
          color: artcaffePalette.text.black,
          fontWeight: 500,
          '&.MuiChip-outlined': {
            borderColor: artcaffePalette.accent.gold,
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: artcaffePalette.primary.brown,
          color: artcaffePalette.white,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: artcaffePalette.accent.gold,
          color: artcaffePalette.text.black,
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 120ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: `${artcaffePalette.primary.darkGreen}08`,
          },
          '&:focus': {
            outline: `2px solid ${artcaffePalette.accent.gold}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 120ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: artcaffePalette.primary.darkGreen,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: artcaffePalette.primary.darkGreen,
              borderWidth: 2,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 2px ${artcaffePalette.accent.gold}40`,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: artcaffePalette.primary.darkGreen,
            borderWidth: 2,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: artcaffePalette.text.black,
          color: artcaffePalette.white,
          fontSize: '0.75rem',
          borderRadius: 8,
        },
        arrow: {
          color: artcaffePalette.text.black,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            backgroundColor: artcaffePalette.text.black,
            color: artcaffePalette.white,
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStepIcon-root': {
            color: '#E0E0E0',
            '&.Mui-active': {
              color: artcaffePalette.accent.gold,
            },
            '&.Mui-completed': {
              color: artcaffePalette.primary.darkGreen,
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: artcaffePalette.primary.brown,
          fontWeight: 500,
          fontSize: '0.875rem',
          marginBottom: 8,
        },
      },
    },
  },
});

// Export color tokens for direct use
export const colors = artcaffePalette;
