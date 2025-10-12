import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateRecipeSuggestions = action({
  args: {
    ingredients: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `Generate 3 unique recipe suggestions using primarily these ingredients: ${args.ingredients}. 
    For each recipe, provide:
    1. Title
    2. Description (2-3 sentences)
    3. Complete ingredients list (including the provided ingredients plus any additional needed)
    4. Step-by-step cooking instructions
    5. Estimated prep time in minutes
    6. Number of servings
    7. Cuisine type
    8. 3 relevant tags (e.g., "quick", "healthy", "comfort-food")
    
    Format the response as a JSON array of recipe objects with these exact fields:
    title, description, ingredients (array), steps (array), prepTime (number), servings (number), cuisine, tags (array)`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse recipe suggestions from AI response");
      }

      const recipes = JSON.parse(jsonMatch[0]);
      return recipes;
    } catch (error) {
      console.error("Error generating recipe suggestions:", error);
      throw new Error("Failed to generate recipe suggestions");
    }
  },
});
