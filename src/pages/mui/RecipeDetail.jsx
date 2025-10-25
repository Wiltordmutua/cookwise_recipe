import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Chip,
  Rating,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Avatar,
  TextField,
  Divider,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  People,
  Restaurant,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';

export function RecipeDetail() {
  const { id } = useParams();
  const recipe = useQuery(api.recipes.getRecipe, { id: id });
  const rateRecipe = useMutation(api.recipes.rateRecipe);
  const toggleFavorite = useMutation(api.recipes.toggleFavorite);
  const addComment = useMutation(api.comments.addComment);
  const comments = useQuery(api.comments.getComments, { recipeId: id });
  const currentUser = useQuery(api.auth.loggedInUser);

  const [userRating, setUserRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (recipe === undefined) {
    return (
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
    );
  }

  if (!recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Recipe not found
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const handleRating = async (rating) => {
    setIsSubmittingRating(true);
    try {
      await rateRecipe({ recipeId: recipe._id, rating });
      setUserRating(rating);
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const isFavorited = await toggleFavorite({ recipeId: recipe._id });
      toast.success(isFavorited ? 'Added to favorites!' : 'Removed from favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addComment({
        recipeId: recipe._id,
        content: newComment.trim(),
      });
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Main Recipe Card */}
      <Card elevation={2} sx={{ mb: 4 }}>
        {/* Recipe Image */}
        {recipe.imageUrls.length > 0 && (
          <CardMedia
            component="img"
            height="400"
            image={recipe.imageUrls[0].url || ''}
            alt={recipe.title}
            sx={{ objectFit: 'cover' }}
          />
        )}

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary">
                {recipe.title}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2">
                  By {recipe.author?.profile?.username}
                </Typography>
                <Typography variant="body2">•</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">{recipe.prepTime} minutes</Typography>
                </Box>
                <Typography variant="body2">•</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <People fontSize="small" />
                  <Typography variant="body2">{recipe.servings} servings</Typography>
                </Box>
                <Typography variant="body2">•</Typography>
                <Chip label={recipe.cuisine} size="small" />
              </Box>
            </Box>

            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                ml: 2,
                '&:hover': {
                  backgroundColor: 'rgba(99, 48, 36, 0.08)',
                },
              }}
            >
              <Favorite sx={{ color: 'error.main', fontSize: 28 }} />
            </IconButton>
          </Box>

          {/* Description */}
          {recipe.description && (
            <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
              {recipe.description}
            </Typography>
          )}

          {/* Rating Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: 'rgba(108, 117, 95, 0.08)',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={recipe.averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    ({recipe.totalRatings} ratings)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Rate this recipe:
                </Typography>
              </Box>
              <Rating
                value={userRating}
                onChange={(event, newValue) => handleRating(newValue)}
                disabled={isSubmittingRating}
                size="large"
              />
            </Box>
          </Paper>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {recipe.tags.map((tag, index) => (
                <Chip key={index} label={`#${tag}`} variant="filled" />
              ))}
            </Box>
          )}

          {/* Ingredients and Instructions */}
          <Grid container spacing={4}>
            {/* Ingredients */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        mr: 2,
                        flexShrink: 0,
                      }}
                    />
                    <ListItemText
                      primary={ingredient}
                      primaryTypographyProps={{
                        variant: 'body1',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Instructions */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
                Instructions
              </Typography>
              <List>
                {recipe.steps.map((step, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.875rem',
                        mr: 2,
                        mt: 0.5,
                        backgroundColor: 'primary.main',
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <ListItemText
                      primary={step}
                      primaryTypographyProps={{
                        variant: 'body1',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Comments Section */}
      <Card elevation={2}>
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
            Comments
          </Typography>

          {/* Add Comment Form */}
          {currentUser && (
            <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ mt: 1 }}>
                  {(currentUser.profile?.username || currentUser.name || 'U')[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your thoughts about this recipe..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmittingComment}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmittingComment || !newComment.trim()}
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Comments List */}
          {comments === undefined ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : comments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No comments yet. Be the first to share your thoughts!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {comments.map((comment, index) => (
                <React.Fragment key={comment._id}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar>
                      {comment.author?.profile?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: 'rgba(108, 117, 95, 0.08)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {comment.author?.profile?.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment._creationTime).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{comment.content}</Typography>
                      </Paper>
                    </Box>
                  </Box>
                  {index < comments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          )}
        </Box>
      </Card>
    </Container>
  );
}
