import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Authenticated, Unauthenticated, useQuery, useMutation } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '../../../convex/_generated/api';
import { Notifications } from '../Notifications';

export function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuthActions();
  
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const createUserProfile = useMutation(api.users.createUserProfile);

  // Create user profile if it doesn't exist
  useEffect(() => {
    if (loggedInUser && !loggedInUser.profile) {
      createUserProfile();
    }
  }, [loggedInUser, createUserProfile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Create Recipe', path: '/create' },
    { label: 'AI Suggestions', path: '/ai-recipes' },
    { label: 'Search', path: '/search' },
  ];

  const drawer = (
    <Box 
      sx={{ 
        width: 280,
        height: '100%',
        backgroundColor: '#1a3a2e',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800, 
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Cookwise
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ px: 2, pt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '0%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #6C755F 0%, #8A9580 100%)',
                  boxShadow: '0 0 10px rgba(108, 117, 95, 0.8)',
                  transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(108, 117, 95, 0.2)',
                  transform: 'translateX(8px)',
                  '&::before': {
                    width: '100%',
                  },
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  color: '#FFFFFF',
                  fontSize: '1rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: '#1a3a2e',
          boxShadow: '0 4px 24px rgba(26, 58, 46, 0.4)',
          borderBottom: '2px solid rgba(108, 117, 95, 0.2)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 }, py: 1 }}>
            {/* Mobile Menu Icon */}
            <Authenticated>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    mr: 2, 
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Authenticated>

            {/* Logo */}
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: '#FFFFFF',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
                mr: { md: 6 },
                letterSpacing: '-0.02em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 200ms ease-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              Cookwise
            </Typography>

            {/* Desktop Navigation */}
            <Authenticated>
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, alignItems: 'center' }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.path}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        fontSize: '1rem',
                        px: 3.5,
                        py: 2,
                        textTransform: 'none',
                        letterSpacing: '0.5px',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '0%',
                          width: '0%',
                          height: '3px',
                          background: 'linear-gradient(90deg, #6C755F 0%, #8A9580 50%, #6C755F 100%)',
                          boxShadow: '0 0 12px rgba(108, 117, 95, 0.8)',
                          transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1), left 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(108, 117, 95, 0.2), transparent)',
                          transition: 'left 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '&:hover': {
                          color: '#FFFFFF',
                          backgroundColor: 'rgba(108, 117, 95, 0.15)',
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                          '&::before': {
                            width: '100%',
                            left: '0%',
                          },
                          '&::after': {
                            left: '100%',
                          },
                        },
                        '&:active': {
                          transform: 'translateY(-1px) scale(1.01)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}
            </Authenticated>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
              <Authenticated>
                <Notifications />
                {loggedInUser && (
                  <Button
                    component={Link}
                    to={`/profile/${loggedInUser._id}`}
                    sx={{
                      color: '#FFFFFF',
                      textTransform: 'none',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      transition: 'all 200ms ease-out',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                    startIcon={
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '0.9rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {(loggedInUser.profile?.username || loggedInUser.name || 'U')[0]?.toUpperCase()}
                      </Avatar>
                    }
                  >
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}>
                      {loggedInUser.profile?.username || 'User'}
                    </Box>
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => void signOut()}
                  sx={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 0.75,
                    borderRadius: 2,
                    transition: 'all 200ms ease-out',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderWidth: 1.5,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Sign out
                </Button>
              </Authenticated>

              <Unauthenticated>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  Sign in to get started
                </Typography>
              </Unauthenticated>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
