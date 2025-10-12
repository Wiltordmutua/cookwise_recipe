import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { RecipeGrid } from './RecipeCard';

// Demo data to test the RecipeCard component
const demoRecipes = [
  {
    id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh basil, mozzarella, and tomato sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
    prepTime: 30,
    servings: 4,
    cuisine: 'Italian',
    tags: ['vegetarian', 'quick', 'comfort-food'],
    rating: 4.5,
    totalRatings: 128,
    author: {
      username: 'ChefMario',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Spicy Thai Basil Chicken',
    description: 'Aromatic Thai dish with fresh basil leaves, chili, and tender chicken.',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    prepTime: 25,
    servings: 2,
    cuisine: 'Asian',
    tags: ['spicy', 'healthy', 'quick'],
    rating: 4.2,
    totalRatings: 87,
    author: {
      username: 'ThaiChef',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Mediterranean Quinoa Bowl',
    description: 'Nutritious bowl with quinoa, olives, tomatoes, and feta cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    prepTime: 20,
    servings: 1,
    cuisine: 'Mediterranean',
    tags: ['healthy', 'vegetarian', 'gluten-free'],
    rating: 4.8,
    totalRatings: 156,
    author: {
      username: 'HealthyEats',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    isFavorite: false,
  },
  {
    id: '4',
    title: 'Chocolate Lava Cake',
    description: 'Decadent chocolate cake with a molten center, perfect for dessert.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    prepTime: 45,
    servings: 4,
    cuisine: 'French',
    tags: ['dessert', 'sweet', 'indulgent'],
    rating: 4.9,
    totalRatings: 203,
    author: {
      username: 'SweetTooth',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    isFavorite: true,
  },
];

export const Demo: React.FC = () => {
  const handleRecipeClick = (recipeId: string) => {
    console.log('Recipe clicked:', recipeId);
    // Navigate to recipe detail page
  };

  const handleFavoriteToggle = (recipeId: string) => {
    console.log('Favorite toggled:', recipeId);
    // Toggle favorite status
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
          Cookwise Recipe Demo
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Testing the Material-UI RecipeCard component with Artcaffé theme
        </Typography>
      </Box>

      <RecipeGrid
        recipes={demoRecipes}
        onRecipeClick={handleRecipeClick}
        onFavoriteToggle={handleFavoriteToggle}
        loading={false}
      />
    </Container>
  );
};
