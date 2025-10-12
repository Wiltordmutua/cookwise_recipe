import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search,
  Notifications,
  Menu as MenuIcon,
  AccountCircle,
  Person,
  Settings,
  Logout,
  Favorite,
  Create,
  Home,
} from '@mui/icons-material';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  notificationCount: number;
}

interface AppHeaderProps {
  user?: User;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onSignIn,
  onSignOut,
  onSearch,
  onNavigate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleNavigate = (path: string) => {
    onNavigate?.(path);
    handleMenuClose();
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSignOut = () => {
    onSignOut?.();
    handleMenuClose();
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Create Recipe', path: '/create', icon: <Create /> },
    { label: 'AI Suggestions', path: '/ai-recipes', icon: <Search /> },
    { label: 'Search', path: '/search', icon: <Search /> },
  ];

  const profileMenuItems = [
    { label: 'Profile', icon: <Person />, action: () => handleNavigate(`/profile/${user?.id}`) },
    { label: 'Favorites', icon: <Favorite />, action: () => handleNavigate('/favorites') },
    { label: 'Settings', icon: <Settings />, action: () => handleNavigate('/settings') },
    { label: 'Sign Out', icon: <Logout />, action: handleSignOut, divider: true },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0px 2px 4px rgba(46, 71, 59, 0.1)',
        borderBottom: '1px solid #E0E0E0',
      }}
    >
      <Toolbar sx={{ 
        flexDirection: 'column',
        alignItems: 'stretch',
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 0 },
      }}>
        {/* Top Row - Logo and User Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          mb: { xs: 1, md: 0 }
        }}>
          {/* Brand Logo */}
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
              '&:focus': {
                outline: `2px solid ${theme.palette.info.main}`,
                outlineOffset: '2px',
                borderRadius: 1,
              },
            }}
            onClick={() => handleNavigate('/')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavigate('/');
              }
            }}
            role="button"
            aria-label="Go to homepage"
          >
            Cookwise
          </Typography>

          {/* User Actions - Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {/* Mobile Search Button */}
                {isMobile && (
                  <IconButton
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&:focus': {
                        outline: `2px solid ${theme.palette.info.main}`,
                        outlineOffset: '2px',
                      },
                    }}
                    aria-label="Toggle search"
                  >
                    <Search />
                  </IconButton>
                )}

                {/* Mobile Hamburger Menu */}
                {isMobile && (
                  <IconButton
                    onClick={handleMobileMenuOpen}
                    aria-label="Open navigation menu"
                    aria-controls={mobileMenuAnchor ? 'mobile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={mobileMenuAnchor ? 'true' : undefined}
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&:focus': {
                        outline: `2px solid ${theme.palette.info.main}`,
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton
                    color="inherit"
                    aria-label={`${user.notificationCount} notifications`}
                    onClick={() => handleNavigate('/notifications')}
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&:focus': {
                        outline: `2px solid ${theme.palette.info.main}`,
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <Badge
                      badgeContent={user.notificationCount}
                      color="error"
                      max={99}
                    >
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Avatar */}
                <Tooltip title="Account menu">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    aria-label="Open account menu"
                    aria-controls={anchorEl ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                    sx={{
                      p: 0,
                      '&:focus': {
                        outline: `2px solid ${theme.palette.info.main}`,
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: theme.palette.info.main,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {user.username[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                onClick={onSignIn}
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: { xs: 2, sm: 3 },
                  '&:focus': {
                    outline: `2px solid ${theme.palette.info.main}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Box>

        {/* Mobile Search Bar */}
        {isMobile && showMobileSearch && (
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              position: 'relative',
              borderRadius: 12,
              backgroundColor: alpha(theme.palette.grey[100], 0.8),
              '&:hover': {
                backgroundColor: alpha(theme.palette.grey[100], 1),
              },
              '&:focus-within': {
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0 0 0 2px ${theme.palette.info.main}40`,
              },
              mb: 1,
            }}
          >
            <Box
              sx={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
              <InputBase
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  color: theme.palette.text.primary,
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: 0,
                    '&::placeholder': {
                      opacity: 1,
                      color: theme.palette.text.secondary,
                    },
                  },
                }}
                inputProps={{
                  'aria-label': 'Search recipes',
                  role: 'searchbox',
                }}
              />
            </Box>
          </Box>
        )}

        {/* Navigation Tabs - Visible on Tablet and Desktop Only */}
        {user && !isMobile && (
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 },
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            py: { xs: 0.5, sm: 0 },
          }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                startIcon={item.icon}
                size="medium"
                sx={{
                  color: theme.palette.text.primary,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 'auto',
                  px: 2,
                  flexShrink: 0,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                  },
                  '&:focus': {
                    outline: `2px solid ${theme.palette.info.main}`,
                    outlineOffset: '2px',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleNavigate(`/profile/${user?.id}`)}>
          <Avatar src={user?.avatar} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {user?.username}
          </Typography>
        </MenuItem>
        {profileMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={item.action}
            divider={item.divider}
            sx={{
              '&:focus': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                outline: `2px solid ${theme.palette.info.main}`,
                outlineOffset: '-2px',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Navigation Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        id="mobile-menu"
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            maxWidth: '90vw',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {navigationItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleNavigate(item.path)}
            sx={{
              py: 1.5,
              px: 2,
              '&:focus': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                outline: `2px solid ${theme.palette.info.main}`,
                outlineOffset: '-2px',
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
              }}>
                {item.icon}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        {/* Divider */}
        <Divider sx={{ my: 1 }} />
        
        {/* Additional Mobile Menu Items */}
        <MenuItem
          onClick={() => handleNavigate('/favorites')}
          sx={{
            py: 1.5,
            px: 2,
            '&:focus': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              outline: `2px solid ${theme.palette.info.main}`,
              outlineOffset: '-2px',
            },
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
            }}>
              <Favorite />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Favorites
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

    </AppBar>
  );
};
