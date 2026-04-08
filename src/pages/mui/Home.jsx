import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Restaurant,
  AutoAwesome,
  AddCircleOutline,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { RecipeCard } from '../../components/mui/RecipeCard';
import { SignInForm } from '../../components/mui/SignInForm';

const heroShellSx = (theme) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 3,
  p: { xs: 3, sm: 4, md: 5 },
  mb: { xs: 4, md: 6 },
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 45%, ${theme.palette.background.paper} 100%)`,
  boxShadow: '0 8px 32px rgba(26, 58, 46, 0.08)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-35%',
    right: '-8%',
    width: { xs: 200, md: 320 },
    height: { xs: 200, md: 320 },
    borderRadius: '50%',
    background: alpha(theme.palette.primary.main, 0.07),
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-25%',
    left: '-5%',
    width: { xs: 160, md: 240 },
    height: { xs: 160, md: 240 },
    borderRadius: '50%',
    background: alpha(theme.palette.secondary.main, 0.06),
    pointerEvents: 'none',
  },
});

export function Home() {
  const recipes = useQuery(api.recipes.getRecipes, {});

  return (
    <>
      <Authenticated>
        <Box
          sx={{
            minHeight: '100%',
            background: (theme) =>
              `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${theme.palette.background.default} 28%, ${theme.palette.background.default} 100%)`,
          }}
        >
          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
          <Box sx={heroShellSx}>
            <Stack
              spacing={2.5}
              sx={{
                position: 'relative',
                zIndex: 1,
                maxWidth: { md: '72%' },
              }}
            >
              <Chip
                icon={<Restaurant sx={{ fontSize: 18 }} />}
                label="Community recipes"
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: 'primary.dark',
                  border: 'none',
                  '& .MuiChip-icon': { color: 'primary.main' },
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: (theme) =>
                    `linear-gradient(120deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Discover recipes worth cooking tonight
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 560,
                }}
              >
                Browse dishes from home cooks, save your favorites, and get inspired for your next meal.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/create"
                  startIcon={<AddCircleOutline />}
                  sx={{
                    py: 1.25,
                    px: 2.5,
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(108, 117, 95, 0.35)',
                  }}
                >
                  Share a recipe
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/ai-recipes"
                  startIcon={<AutoAwesome />}
                  sx={{ py: 1.25, px: 2.5, fontWeight: 600 }}
                >
                  AI suggestions
                </Button>
                <Button
                  variant="text"
                  size="large"
                  component={RouterLink}
                  to="/search"
                  sx={{ py: 1.25, fontWeight: 600 }}
                >
                  Search
                </Button>
              </Stack>
              {recipes !== undefined && (
                <Typography variant="body2" color="text.secondary" sx={{ pt: 0.5 }}>
                  {recipes.length === 0
                    ? 'No recipes yet — be the first to post one.'
                    : `${recipes.length} recipe${recipes.length === 1 ? '' : 's'} from the community`}
                </Typography>
              )}
            </Stack>
          </Box>

          {recipes === undefined ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 360,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={44} thickness={4} sx={{ color: 'primary.main' }} />
                <Typography color="text.secondary" variant="body2">
                  Loading recipes…
                </Typography>
              </Stack>
            </Box>
          ) : recipes.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 8, md: 10 },
                px: 2,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Restaurant sx={{ fontSize: 64, color: 'primary.main', opacity: 0.85, mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={700} color="primary.dark">
                Your kitchen is waiting
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
                No recipes yet. Add the first one and help others discover something delicious.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/create"
                startIcon={<AddCircleOutline />}
                sx={{ fontWeight: 700, px: 3 }}
              >
                Create a recipe
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {recipes.map((recipe) => {
                const mapped = {
                  id: String(recipe._id),
                  title: recipe.title,
                  description: recipe.description,
                  imageUrl: recipe.imageUrls?.[0]?.url || '',
                  prepTime: recipe.prepTime,
                  servings: recipe.servings,
                  cuisine: recipe.cuisine,
                  tags: recipe.tags || [],
                  rating: recipe.averageRating ?? 0,
                  totalRatings: recipe.totalRatings ?? 0,
                  author: {
                    username: recipe.author?.profile?.username || 'User',
                    avatar: '',
                  },
                  isFavorite: false,
                };
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id} sx={{ display: 'flex' }}>
                    <RecipeCard recipe={mapped} />
                  </Grid>
                );
              })}
            </Grid>
          )}
          </Container>
        </Box>
      </Authenticated>

      <Unauthenticated>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              maxWidth: 500,
              mx: 'auto',
              textAlign: 'center',
              py: { xs: 6, md: 12 },
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                fontSize: { xs: '2.5rem', md: '3rem' },
                mb: 2,
              }}
            >
              Welcome to Cookwise
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
              Join our community of passionate cooks and discover amazing recipes
            </Typography>
            <SignInForm />
          </Box>
        </Container>
      </Unauthenticated>
    </>
  );
}
