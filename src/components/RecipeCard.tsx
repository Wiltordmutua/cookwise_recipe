import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  People,
  Restaurant,
} from '@mui/icons-material';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime: number;
  servings: number;
  cuisine: string;
  tags: string[];
  rating: number;
  totalRatings: number;
  author: {
    username: string;
    avatar?: string;
  };
  isFavorite?: boolean;
}

// Default recipe data to prevent undefined errors
const defaultRecipe: Recipe = {
  id: '',
  title: 'Loading...',
  description: '',
  imageUrl: '',
  prepTime: 0,
  servings: 0,
  cuisine: 'Other',
  tags: [],
  rating: 0,
  totalRatings: 0,
  author: {
    username: 'User',
    avatar: '',
  },
  isFavorite: false,
};

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (recipeId: string) => void;
  onClick?: (recipeId: string) => void;
  loading?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onFavoriteToggle,
  onClick,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [imageLoading, setImageLoading] = useState(true);

  // Use default recipe data if recipe is undefined or incomplete
  const safeRecipe = recipe || defaultRecipe;

  const handleCardClick = () => {
    if (onClick && !loading && safeRecipe.id) {
      onClick(safeRecipe.id);
    }
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onFavoriteToggle && !loading && safeRecipe.id) {
      onFavoriteToggle(safeRecipe.id);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', cursor: 'pointer' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={24} width="80%" />
          <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" height={24} width={60} />
            <Skeleton variant="rectangular" height={24} width={80} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0px 8px 16px rgba(46, 71, 59, 0.15)',
        },
      }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      aria-label={`View recipe: ${safeRecipe.title}`}
    >
      {/* Recipe Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={safeRecipe.imageUrl || '/placeholder-recipe.jpg'}
          alt={safeRecipe.title}
          onLoad={() => setImageLoading(false)}
          sx={{
            display: imageLoading ? 'none' : 'block',
            objectFit: 'cover',
          }}
        />
        {imageLoading && (
          <Skeleton variant="rectangular" height={200} />
        )}
        
        {/* Favorite Button */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '&:focus': {
              outline: `2px solid ${theme.palette.info.main}`,
              outlineOffset: '2px',
            },
          }}
          aria-label={safeRecipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {safeRecipe.isFavorite ? (
            <Favorite sx={{ color: theme.palette.error.main }} />
          ) : (
            <FavoriteBorder sx={{ color: theme.palette.text.secondary }} />
          )}
        </IconButton>

        {/* Cuisine Badge */}
        <Chip
          label={safeRecipe.cuisine}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: theme.palette.info.main,
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
            minHeight: '2.6em',
          }}
        >
          {safeRecipe.title}
        </Typography>

        {/* Description */}
        {safeRecipe.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
              minHeight: '2.8em',
            }}
          >
            {safeRecipe.description}
          </Typography>
        )}

        {/* Meta Information */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {safeRecipe.prepTime}m
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {safeRecipe.servings}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {safeRecipe.tags && safeRecipe.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {safeRecipe.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 20,
                  borderColor: theme.palette.info.main,
                  color: theme.palette.info.main,
                  '&:hover': {
                    backgroundColor: `${theme.palette.info.main}10`,
                  },
                }}
              />
            ))}
            {safeRecipe.tags && safeRecipe.tags.length > (isMobile ? 2 : 3) && (
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                +{safeRecipe.tags.length - (isMobile ? 2 : 3)}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating
            value={safeRecipe.rating}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: theme.palette.warning.main,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            ({safeRecipe.totalRatings})
          </Typography>
        </Box>

        {/* Author */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={safeRecipe.author?.avatar}
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.75rem',
              backgroundColor: theme.palette.info.main,
              color: theme.palette.text.primary,
            }}
          >
            {safeRecipe.author?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {safeRecipe.author?.username || 'User'}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};

// Grid container component for responsive layout
interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeClick?: (recipeId: string) => void;
  onFavoriteToggle?: (recipeId: string) => void;
  loading?: boolean;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes = [],
  onRecipeClick,
  onFavoriteToggle,
  loading = false,
}) => {
  const theme = useTheme();
  
  // Show skeleton cards when loading
  const displayRecipes = loading ? Array(8).fill(null) : recipes;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        },
        gap: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
      }}
    >
      {displayRecipes.map((recipe, index) => (
        <RecipeCard
          key={loading ? `skeleton-${index}` : recipe?.id || `recipe-${index}`}
          recipe={recipe}
          onFavoriteToggle={onFavoriteToggle}
          onClick={onRecipeClick}
          loading={loading}
        />
      ))}
    </Box>
  );
};