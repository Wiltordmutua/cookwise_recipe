import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import cookwiseTheme from './theme/muiTheme';
import { Navbar } from './components/mui/Navbar';
import { Home } from './pages/mui/Home';
import { RecipeDetail } from './pages/RecipeDetail';
import { CreateRecipe } from './pages/CreateRecipe';
import { Profile } from './pages/Profile';
import { AIRecipes } from './pages/AIRecipes';
import { Search } from './pages/Search';

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
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/ai-recipes" element={<AIRecipes />} />
              <Route path="/search" element={<Search />} />
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
