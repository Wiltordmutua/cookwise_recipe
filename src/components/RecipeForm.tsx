import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  Chip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Image,
  Restaurant,
  AccessTime,
  People,
} from '@mui/icons-material';

interface RecipeFormData {
  title: string;
  description: string;
  cuisine: string;
  prepTime: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  tags: string[];
  images: File[];
}

interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => void;
  loading?: boolean;
  initialData?: Partial<RecipeFormData>;
}

const cuisineOptions = [
  'Italian',
  'Mexican',
  'Asian',
  'American',
  'Mediterranean',
  'Indian',
  'French',
  'Other',
];

const commonTags = [
  'quick',
  'healthy',
  'comfort-food',
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'high-protein',
  'kid-friendly',
  'spicy',
  'sweet',
  'savory',
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'snack',
];

export const RecipeForm: React.FC<RecipeFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
}) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    cuisine: '',
    prepTime: 30,
    servings: 4,
    ingredients: [''],
    steps: [''],
    tags: [],
    images: [],
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = ['Basic Info', 'Ingredients', 'Instructions', 'Tags & Images'];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.title.trim()) {
          newErrors.title = 'Recipe title is required';
        }
        if (!formData.cuisine) {
          newErrors.cuisine = 'Please select a cuisine';
        }
        if (formData.prepTime < 1) {
          newErrors.prepTime = 'Prep time must be at least 1 minute';
        }
        if (formData.servings < 1) {
          newErrors.servings = 'Servings must be at least 1';
        }
        break;
      case 1:
        const validIngredients = formData.ingredients.filter(ing => ing.trim());
        if (validIngredients.length === 0) {
          newErrors.ingredients = 'At least one ingredient is required';
        }
        break;
      case 2:
        const validSteps = formData.steps.filter(step => step.trim());
        if (validSteps.length === 0) {
          newErrors.steps = 'At least one instruction step is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // Clean up empty ingredients and steps
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        steps: formData.steps.filter(step => step.trim()),
      };
      onSubmit(cleanedData);
    }
  };

  const updateFormData = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addIngredient = () => {
    updateFormData('ingredients', [...formData.ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      updateFormData('ingredients', newIngredients);
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = formData.ingredients.map((ing, i) => 
      i === index ? value : ing
    );
    updateFormData('ingredients', newIngredients);
  };

  const addStep = () => {
    updateFormData('steps', [...formData.steps, '']);
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      updateFormData('steps', newSteps);
    }
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = formData.steps.map((step, i) => 
      i === index ? value : step
    );
    updateFormData('steps', newSteps);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateFormData('images', [...formData.images, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', newImages);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipe Title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="Enter a delicious recipe title..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                multiline
                rows={3}
                placeholder="Describe your recipe, its origins, or any special notes..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.cuisine}>
                <InputLabel>Cuisine</InputLabel>
                <Select
                  value={formData.cuisine}
                  onChange={(e) => updateFormData('cuisine', e.target.value)}
                  label="Cuisine"
                  startAdornment={<Restaurant sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  {cuisineOptions.map((cuisine) => (
                    <MenuItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </MenuItem>
                  ))}
                </Select>
                {errors.cuisine && <FormHelperText>{errors.cuisine}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Prep Time"
                type="number"
                value={formData.prepTime}
                onChange={(e) => updateFormData('prepTime', parseInt(e.target.value) || 0)}
                error={!!errors.prepTime}
                helperText={errors.prepTime}
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Servings"
                type="number"
                value={formData.servings}
                onChange={(e) => updateFormData('servings', parseInt(e.target.value) || 0)}
                error={!!errors.servings}
                helperText={errors.servings}
                inputProps={{ min: 1 }}
                InputProps={{
                  startAdornment: <People sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Ingredients</Typography>
              <Button
                startIcon={<Add />}
                onClick={addIngredient}
                variant="outlined"
                size="small"
              >
                Add Ingredient
              </Button>
            </Box>
            {errors.ingredients && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.ingredients}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formData.ingredients.map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1} (e.g., 2 cups flour, 1 tsp salt)`}
                    multiline
                    maxRows={2}
                  />
                  {formData.ingredients.length > 1 && (
                    <IconButton
                      onClick={() => removeIngredient(index)}
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                      aria-label={`Remove ingredient ${index + 1}`}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Instructions</Typography>
              <Button
                startIcon={<Add />}
                onClick={addStep}
                variant="outlined"
                size="small"
              >
                Add Step
              </Button>
            </Box>
            {errors.steps && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.steps}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {formData.steps.map((step, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      mt: 1,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <TextField
                    fullWidth
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}: Describe what to do...`}
                    multiline
                    rows={3}
                  />
                  {formData.steps.length > 1 && (
                    <IconButton
                      onClick={() => removeStep(index)}
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                      aria-label={`Remove step ${index + 1}`}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Tags</Typography>
              <Autocomplete
                multiple
                options={commonTags}
                value={formData.tags}
                onChange={(_, newValue) => updateFormData('tags', newValue)}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Add tags to help others find your recipe..."
                    helperText="Type to add custom tags or select from common ones"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recipe Images</Typography>
              <Box
                sx={{
                  border: `2px dashed ${theme.palette.grey[300]}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: alpha(theme.palette.grey[50], 0.5),
                }}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload photos of your delicious recipe
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="recipe-images"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="recipe-images">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Image />}
                    sx={{ mr: 1 }}
                  >
                    Choose Images
                  </Button>
                </label>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Up to 5 images, max 5MB each
                </Typography>
              </Box>
              
              {formData.images.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Selected Images ({formData.images.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.images.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: 'relative',
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: `1px solid ${theme.palette.grey[300]}`,
                        }}
                      >
                        <Box
                          component="img"
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          Create New Recipe
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400, mb: 3 }}>
          {renderStepContent()}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{ px: 4 }}
              >
                {loading ? 'Creating Recipe...' : 'Create Recipe'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
