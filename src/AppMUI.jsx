import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import cookwiseTheme from './theme/muiTheme';
import { Navbar } from './components/mui/Navbar';
import { Home } from './pages/mui/Home';
import { RecipeDetail } from './pages/RecipeDetail';
import { CreateRecipe } from './pages/CreateRecipe';
import { Profile } from './pages/Profile';
import { AIRecipes } from './pages/AIRecipes';
import { Search } from './pages/Search';
import { SignInForm } from './components/mui/SignInForm';

function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 4, md: 8 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 500, textAlign: 'center' }}>
        <SignInForm />
      </Box>
    </Box>
  );
}

export default function AppMUI() {
  return (
    <ThemeProvider theme={cookwiseTheme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default',
          }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id/edit" element={<CreateRecipe />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/ai-recipes" element={<AIRecipes />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#222222',
                color: '#FFFFFF',
                borderRadius: '12px',
              },
            }}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}
