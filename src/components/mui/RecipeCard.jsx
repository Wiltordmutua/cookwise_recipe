import React from 'react';
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
  Skeleton,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function RecipeCard({ recipe, onFavoriteToggle, loading = false }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleCardClick = () => {
    if (!loading && recipe?.id) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    if (onFavoriteToggle && !loading && recipe?.id) {
      onFavoriteToggle(recipe.id);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={28} width="80%" />
          <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Skeleton variant="rectangular" height={24} width={60} sx={{ borderRadius: 20 }} />
            <Skeleton variant="rectangular" height={24} width={80} sx={{ borderRadius: 20 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative' }}>
        {!imageLoaded && <Skeleton variant="rectangular" height={200} />}
        <CardMedia
          component="img"
          height="200"
          image={recipe?.imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe?.title || 'Recipe'}
          onLoad={() => setImageLoaded(true)}
          sx={{
            display: imageLoaded ? 'block' : 'none',
            objectFit: 'cover',
          }}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
          aria-label={recipe?.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {recipe?.isFavorite ? (
            <Favorite sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorder sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>

        {/* Cuisine Badge */}
        <Chip
          label={recipe?.cuisine || 'Other'}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
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
            minHeight: '3em',
          }}
        >
          {recipe?.title || 'Loading...'}
        </Typography>

        {recipe?.description && (
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
              minHeight: '2.8em',
            }}
          >
            {recipe.description}
          </Typography>
        )}

        {/* Meta Information */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {recipe?.prepTime || 0}m
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {recipe?.servings || 0}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {recipe?.tags && recipe.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            ))}
            {recipe.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                +{recipe.tags.length - 3}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Footer */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating
            value={recipe?.rating || 0}
            precision={0.1}
            readOnly
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: 'warning.main',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            ({recipe?.totalRatings || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={recipe?.author?.avatar}
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.7rem',
            }}
          >
            {recipe?.author?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {recipe?.author?.username || 'User'}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
}
