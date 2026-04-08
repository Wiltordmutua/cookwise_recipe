import React from 'react';
import { Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = () => {
    void signOut().finally(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={handleSignOut}
      startIcon={<Logout fontSize="small" />}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
        },
      }}
    >
      Sign out
    </Button>
  );
}
