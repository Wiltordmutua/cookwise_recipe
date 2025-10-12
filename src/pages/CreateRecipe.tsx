import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function CreateRecipe() {
  const navigate = useNavigate();
  const createRecipe = useMutation(api.recipes.createRecipe);
  const generateUploadUrl = useMutation(api.recipes.generateUploadUrl);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, ""]
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const uploadImages = async () => {
    const imageIds = [];
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
      const imageIds = await uploadImages();
      const tags = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
      const ingredients = formData.ingredients.filter(Boolean);
      const steps = formData.steps.filter(Boolean);

      const recipeId = await createRecipe({
        title: formData.title,
        description: formData.description || undefined,
        ingredients,
        steps,
        images: imageIds,
        cuisine: formData.cuisine,
        tags,
        prepTime: formData.prepTime,
        servings: formData.servings,
      });

      toast.success("Recipe created successfully!");
      navigate(`/recipe/${recipeId}`);
    } catch (error) {
      toast.error("Failed to create recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-container shadow-lg p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Create New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                value={formData.cuisine}
                onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              >
                <option value="">Select cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Asian">Asian</option>
                <option value="American">American</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Indian">Indian</option>
                <option value="French">French</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Recipe Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-container border border-accent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
            <p className="text-sm text-text/70 mt-1">
              Upload up to 5 images (max 5MB each)
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
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
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
              {isSubmitting ? "Creating..." : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
