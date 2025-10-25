import React from 'react';
import { Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="small"
      onClick={() => void signOut()}
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
