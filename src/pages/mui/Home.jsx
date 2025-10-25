import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { RecipeCard } from '../../components/mui/RecipeCard';
import { SignInForm } from '../../components/mui/SignInForm';

export function Home() {
  const recipes = useQuery(api.recipes.getRecipes, {});

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Authenticated>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Discover Amazing Recipes
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Explore recipes shared by our community of passionate cooks
          </Typography>
        </Box>

        {/* Recipe Grid */}
        {recipes === undefined ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
            }}
          >
            <CircularProgress size={48} />
          </Box>
        ) : recipes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              No recipes yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Be the first to share a recipe!
            </Typography>
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
                <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                  <RecipeCard recipe={mapped} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Authenticated>

      <Unauthenticated>
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
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 400 }}
          >
            Join our community of passionate cooks and discover amazing recipes
          </Typography>
          <SignInForm />
        </Box>
      </Unauthenticated>
    </Container>
  );
}
