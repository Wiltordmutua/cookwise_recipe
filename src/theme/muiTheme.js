import { createTheme, alpha } from '@mui/material/styles';

/**
 * CookWise Recipe App - Sophisticated Material UI Theme
 * Design Philosophy: Modern, elegant, culinary aesthetic
 * Color Palette:
 * - Primary: Muted Olive Green (#6C755F)
 * - Secondary: Dark Teal (#345A53)
 * - Success: Forest Green (#105935)
 * - Error: Dark Reddish-Brown (#633024)
 * - Background: White (#FFFFFF)
 * - Text: Black/Dark Grey (#222222)
 */

const cookwiseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6C755F', // Muted Olive Green
      light: '#8A9580',
      dark: '#4A523F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#345A53', // Dark Teal
      light: '#4A7A6F',
      dark: '#1E3A35',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#105935', // Forest Green
      light: '#1A7A4A',
      dark: '#0A3D1F',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#633024', // Dark Reddish-Brown
      light: '#8B4A3A',
      dark: '#3D1E16',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#6C755F', // Muted Olive Green for star ratings
      light: '#8A9580',
      dark: '#4A523F',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#345A53', // Dark Teal
      light: '#4A7A6F',
      dark: '#1E3A35',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#222222',
      secondary: '#6C755F',
      disabled: '#9E9E9E',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    divider: 'rgba(108, 117, 95, 0.12)',
  },
  
  shape: {
    borderRadius: 12,
  },
  
  spacing: 8, // Base spacing unit (8px)
  
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    
    h1: {
      fontSize: '2rem', // 32px
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#222222',
    },
    h2: {
      fontSize: '1.75rem', // 28px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#222222',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#222222',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#222222',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#222222',
    },
    h6: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.2,
      color: '#222222',
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#222222',
    },
    body2: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#6C755F',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#222222',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#6C755F',
    },
    caption: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#6C755F',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.5px',
      lineHeight: 1.4,
    },
  },
  
  shadows: [
    'none',
    '0 1px 3px rgba(34, 34, 34, 0.12), 0 1px 2px rgba(34, 34, 34, 0.24)', // Level 1
    '0 3px 6px rgba(34, 34, 34, 0.16), 0 3px 6px rgba(34, 34, 34, 0.23)', // Level 2
    '0 10px 20px rgba(34, 34, 34, 0.19), 0 6px 6px rgba(34, 34, 34, 0.23)', // Level 3
    '0 14px 28px rgba(34, 34, 34, 0.25), 0 10px 10px rgba(34, 34, 34, 0.22)', // Level 4
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)', // Level 5
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
    '0 19px 38px rgba(34, 34, 34, 0.30), 0 15px 12px rgba(34, 34, 34, 0.22)',
  ],
  
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 350,
      enteringScreen: 300,
      leavingScreen: 250,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFFFFF',
          color: '#222222',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#6C755F #F5F5F5',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#F5F5F5',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb': {
          background: '#6C755F',
          borderRadius: '4px',
          '&:hover': {
            background: '#4A523F',
          },
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 150ms ease-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6C755F 0%, #4A523F 100%)',
          boxShadow: '0 2px 8px rgba(108, 117, 95, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8A9580 0%, #6C755F 100%)',
            boxShadow: '0 4px 16px rgba(108, 117, 95, 0.3)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #345A53 0%, #1E3A35 100%)',
          boxShadow: '0 2px 8px rgba(52, 90, 83, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A7A6F 0%, #345A53 100%)',
            boxShadow: '0 4px 16px rgba(52, 90, 83, 0.3)',
          },
        },
        outlined: {
          borderColor: '#6C755F',
          color: '#6C755F',
          borderWidth: '1.5px',
          '&:hover': {
            backgroundColor: 'rgba(108, 117, 95, 0.08)',
            borderColor: '#4A523F',
            borderWidth: '1.5px',
          },
        },
        text: {
          color: '#6C755F',
          '&:hover': {
            backgroundColor: 'rgba(108, 117, 95, 0.08)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(34, 34, 34, 0.08)',
          transition: 'all 250ms ease-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(34, 34, 34, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#6C755F',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#345A53',
          color: '#FFFFFF',
        },
        outlined: {
          borderColor: '#6C755F',
          color: '#6C755F',
          borderWidth: '1.5px',
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#6C755F',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6C755F',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#6C755F',
            '&.Mui-focused': {
              color: '#6C755F',
            },
          },
        },
      },
    },
    
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#222222',
          boxShadow: '0 1px 3px rgba(34, 34, 34, 0.12)',
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(34, 34, 34, 0.12), 0 1px 2px rgba(34, 34, 34, 0.24)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(34, 34, 34, 0.16), 0 3px 6px rgba(34, 34, 34, 0.23)',
        },
        elevation3: {
          boxShadow: '0 10px 20px rgba(34, 34, 34, 0.19), 0 6px 6px rgba(34, 34, 34, 0.23)',
        },
      },
    },
    
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(52, 90, 83, 0.08)',
          },
        },
      },
    },
    
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#6C755F',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
    
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#633024',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
    
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#222222',
          fontSize: '0.75rem',
          borderRadius: 8,
          padding: '8px 12px',
        },
        arrow: {
          color: '#222222',
        },
      },
    },
    
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(108, 117, 95, 0.04)',
          },
        },
      },
    },
    
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            '&.Mui-selected': {
              backgroundColor: '#6C755F',
              color: '#FFFFFF',
            },
          },
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 150ms ease-out',
          '&.Mui-selected': {
            backgroundColor: '#6C755F',
            color: '#FFFFFF',
          },
          '&:hover': {
            backgroundColor: 'rgba(108, 117, 95, 0.08)',
          },
        },
      },
    },
    
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: '#6C755F', // Using warning color for ratings
        },
        iconHover: {
          color: '#8A9580',
        },
      },
    },
    
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: 'rgba(108, 117, 95, 0.1)',
        },
        bar: {
          borderRadius: 4,
          backgroundColor: '#6C755F',
        },
      },
    },
    
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#6C755F',
        },
      },
    },
    
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(108, 117, 95, 0.11)',
        },
      },
    },
    
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            backgroundColor: '#222222',
            color: '#FFFFFF',
          },
        },
      },
    },
    
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(108, 117, 95, 0.12)',
        },
      },
    },
  },
});

export default cookwiseTheme;
