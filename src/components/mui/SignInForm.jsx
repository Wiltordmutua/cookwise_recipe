import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState('signIn');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    formData.set('flow', flow);

    try {
      await signIn('password', formData);
    } catch (error) {
      let toastTitle = '';
      if (error.message.includes('Invalid password')) {
        toastTitle = 'Invalid password. Please try again.';
      } else {
        toastTitle =
          flow === 'signIn'
            ? 'Could not sign in, did you mean to sign up?'
            : 'Could not sign up, did you mean to sign in?';
      }
      toast.error(toastTitle);
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        borderRadius: 3,
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          required
          fullWidth
          autoComplete="email"
        />

        <TextField
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
          fullWidth
          autoComplete={flow === 'signIn' ? 'current-password' : 'new-password'}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={submitting}
          sx={{ py: 1.5 }}
        >
          {flow === 'signIn' ? 'Sign in' : 'Sign up'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" component="span">
            {flow === 'signIn' ? "Don't have an account? " : 'Already have an account? '}
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            {flow === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
          </Button>
        </Box>

        <Divider sx={{ my: 1 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          color="secondary"
          size="large"
          fullWidth
          onClick={() => void signIn('anonymous')}
          sx={{ py: 1.5 }}
        >
          Sign in anonymously
        </Button>
      </Box>
    </Paper>
  );
}
