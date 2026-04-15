import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useNavigate, useMatch, Link } from "react-router-dom";

const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Asian",
  "American",
  "Mediterranean",
  "Indian",
  "French",
  "African",
];

export function CreateRecipe() {
  const navigate = useNavigate();
  const editMatch = useMatch("/recipe/:id/edit");
  const isEdit = Boolean(editMatch);
  const editRecipeId = editMatch?.params.id;

  const createRecipe = useMutation(api.recipes.createRecipe);
  const updateRecipe = useMutation(api.recipes.updateRecipe);
  const generateUploadUrl = useMutation(api.recipes.generateUploadUrl);

  const recipe = useQuery(
    api.recipes.getRecipe,
    editRecipeId ? { id: editRecipeId as Id<"recipes"> } : "skip",
  );
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const hasRegisteredAccount = Boolean(loggedInUser?.email);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    steps: [""],
    cuisine: "",
    tags: "",
    prepTime: 30,
    servings: 4,
  });
  const [images, setImages] = useState<File[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [existingImages, setExistingImages] = useState<
    { id: Id<"_storage">; url: string | null }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !recipe || loggedInUser === undefined) return;
    if (!loggedInUser || loggedInUser._id !== recipe.authorId) {
      toast.error("You can only edit your own recipes.");
      void navigate(`/recipe/${recipe._id}`);
    }
  }, [isEdit, recipe, loggedInUser, navigate]);

  useEffect(() => {
    if (!recipe || !isEdit) return;
    const isPresetCuisine = CUISINE_OPTIONS.includes(recipe.cuisine);
    setFormData({
      title: recipe.title,
      description: recipe.description ?? "",
      ingredients: recipe.ingredients.length ? recipe.ingredients : [""],
      steps: recipe.steps.length ? recipe.steps : [""],
      cuisine: recipe.cuisine,
      tags: recipe.tags.join(", "),
      prepTime: recipe.prepTime,
      servings: recipe.servings,
    });
    setSelectedCuisine(isPresetCuisine ? recipe.cuisine : "Other");
    setCustomCuisine(isPresetCuisine ? "" : recipe.cuisine);
    setExistingImages(
      recipe.imageUrls.map((img) => ({ id: img.id, url: img.url ?? null })),
    );
    setImages([]);
  }, [recipe?._id, isEdit]);

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => (i === index ? value : ing)),
    }));
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (storageId: Id<"_storage">) => {
    setExistingImages((prev) => prev.filter((x) => x.id !== storageId));
  };

  const uploadNewImages = async () => {
    const imageIds: Id<"_storage">[] = [];
    for (const image of images) {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });
      const { storageId } = await result.json();
      imageIds.push(storageId);
    }
    return imageIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tags = formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      const ingredients = formData.ingredients.filter(Boolean);
      const steps = formData.steps.filter(Boolean);
      const cuisineValue = (selectedCuisine === "Other" ? customCuisine : formData.cuisine).trim();

      if (!cuisineValue) {
        toast.error("Please select a cuisine or type your custom cuisine.");
        return;
      }

      if (isEdit && recipe) {
        const newIds = await uploadNewImages();
        const allImageIds = [...existingImages.map((e) => e.id), ...newIds];
        await updateRecipe({
          recipeId: recipe._id,
          title: formData.title,
          description: formData.description || undefined,
          ingredients,
          steps,
          images: allImageIds,
          cuisine: cuisineValue,
          tags,
          prepTime: formData.prepTime,
          servings: formData.servings,
        });
        toast.success("Recipe updated!");
        void navigate(`/recipe/${recipe._id}`);
        return;
      }

      const imageIds = await uploadNewImages();
      const recipeId = await createRecipe({
        title: formData.title,
        description: formData.description || undefined,
        ingredients,
        steps,
        images: imageIds,
        cuisine: cuisineValue,
        tags,
        prepTime: formData.prepTime,
        servings: formData.servings,
      });

      toast.success("Recipe created successfully!");
      void navigate(`/recipe/${recipeId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      toast.error(
        isEdit
          ? message || "Failed to update recipe"
          : message || "Failed to create recipe",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && editRecipeId) {
    if (recipe === undefined || loggedInUser === undefined) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      );
    }
    if (recipe === null) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-text">Recipe not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      );
    }
    if (!loggedInUser || !hasRegisteredAccount || loggedInUser._id !== recipe.authorId) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-text/70">Redirecting…</p>
        </div>
      );
    }
  }

  if (!isEdit && loggedInUser !== undefined && !hasRegisteredAccount) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-container shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-3">Create recipes with an account</h1>
          <p className="text-text/70 mb-6">
            Guest mode is great for browsing, but posting recipes requires signing in or creating an account.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/sign-in"
              className="px-5 py-2 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors"
            >
              Sign in or sign up
            </Link>
            <Link
              to="/"
              className="px-5 py-2 border border-primary text-primary font-semibold rounded-container hover:bg-primary/5 transition-colors"
            >
              Back to recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isEdit && loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-container shadow-lg p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-primary">
            {isEdit ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          {isEdit && recipe && (
            <Link
              to={`/recipe/${recipe._id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Back to recipe
            </Link>
          )}
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                placeholder="Enter recipe title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Cuisine *
              </label>
              <select
                required
                value={selectedCuisine}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCuisine(value);
                  if (value === "Other") {
                    setFormData((prev) => ({ ...prev, cuisine: customCuisine.trim() }));
                    return;
                  }
                  setCustomCuisine("");
                  setFormData((prev) => ({ ...prev, cuisine: value }));
                }}
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                <option value="">Select cuisine</option>
                {CUISINE_OPTIONS.map((cuisineOption) => (
                  <option key={cuisineOption} value={cuisineOption}>
                    {cuisineOption}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {selectedCuisine === "Other" && (
                <input
                  type="text"
                  required
                  value={customCuisine}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomCuisine(value);
                    setFormData((prev) => ({ ...prev, cuisine: value }));
                  }}
                  className="w-full mt-3 px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="Type your cuisine (e.g. Ethiopian)"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="Describe your recipe..."
            />
          </div>

          {/* Time and Servings */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Prep Time (minutes) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.prepTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    prepTime: Number.parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Servings *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.servings}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    servings: Number.parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Recipe Images
            </label>
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-24 h-24 rounded-container overflow-hidden border border-accent bg-secondary/20 shrink-0"
                  >
                    {img.url ? (
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text/50 p-1">
                        Image
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs font-semibold px-1.5 py-0.5 rounded shadow"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            <p className="text-sm text-text/70 mt-1">
              {isEdit
                ? "Add more images or remove existing ones above. New files are appended."
                : "Upload up to 5 images (max 5MB each)"}
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Ingredients *
            </label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  required
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder={`Ingredient ${index + 1}`}
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-container transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="text-primary hover:text-primary-hover font-medium"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Instructions *
            </label>
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold mt-2">
                  {index + 1}
                </div>
                <textarea
                  required
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder={`Step ${index + 1}`}
                />
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-container transition-colors self-start mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="text-primary hover:text-primary-hover font-medium"
            >
              + Add Step
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="quick, healthy, comfort-food (comma separated)"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-container hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save changes"
                  : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
