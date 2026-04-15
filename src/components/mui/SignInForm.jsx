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
import { useConvex, useQuery } from 'convex/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';

const PASSWORD_REQUIREMENTS_TEXT =
  'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.';

function validatePassword(password) {
  return (
    password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password)
  );
}

export function SignInForm() {
  const { signIn, signOut } = useAuthActions();
  const convex = useConvex();
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const navigate = useNavigate();
  const [flow, setFlow] = useState('signIn');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const rawEmail = String(formData.get('email') ?? '');
    const normalizedEmail = rawEmail.trim().toLowerCase();
    const rawPassword = String(formData.get('password') ?? '');
    formData.set('email', normalizedEmail);
    formData.set('flow', flow);

    try {
      if (flow === 'signUp' && !validatePassword(rawPassword)) {
        throw new Error('Password constraints not met');
      }

      // If currently in guest mode, clear that session before password auth.
      if (loggedInUser && !loggedInUser.email) {
        await signOut();
      }

      if (flow === 'signUp') {
        const exists = await convex.query(api.auth.isEmailRegistered, { email: normalizedEmail });
        if (exists) {
          throw new Error('Email already registered');
        }
      }

      await signIn('password', formData);
      setSubmitting(false);
      navigate('/', { replace: true });
    } catch (error) {
      let toastTitle = '';
      if (error.message.includes('Password constraints not met')) {
        toastTitle = PASSWORD_REQUIREMENTS_TEXT;
      } else if (error.message.includes('Email already registered')) {
        toastTitle = 'This email is already registered. Please sign in instead.';
      } else if (error.message.includes('Invalid password')) {
        toastTitle = flow === 'signUp'
          ? PASSWORD_REQUIREMENTS_TEXT
          : 'Invalid password. Please try again.';
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
          onClick={() => void signIn('anonymous')
            .then(() => {
              navigate('/', { replace: true });
            })
            .catch(() => {
              toast.error('Could not sign in anonymously. Please try again.');
            })}
          sx={{ py: 1.5 }}
        >
          Continue as guest
        </Button>
      </Box>
    </Paper>
  );
}
