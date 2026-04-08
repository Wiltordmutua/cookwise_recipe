import { action } from "./_generated/server";
import { v } from "convex/values";

/** Groq keys must be set on the Convex deployment (`npx convex env set GROQ_API_KEY ...`). Trim avoids stray spaces/newlines. */
function requireGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) {
    throw new Error("Groq API key not configured");
  }
  return key;
}

/** Strip optional ```json fences; Groq sometimes wraps JSON in markdown. */
function stripMarkdownCodeFence(text: string): string {
  let s = text.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/s, "");
  }
  return s.trim();
}

function parseGroqJsonContent(content: string): unknown {
  return JSON.parse(stripMarkdownCodeFence(content));
}

export const generateRecipeSuggestions = action({
  args: {
    ingredients: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = requireGroqApiKey();

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
    title, description, ingredients (array), steps (array), prepTime (number), servings (number), cuisine, tags (array)
    
    Return ONLY the JSON array, no additional text or formatting.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a professional chef and recipe developer. You provide detailed, accurate, and delicious recipe suggestions."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse recipe suggestions from AI response");
      }

      const recipes = JSON.parse(jsonMatch[0]);
      return recipes;
    } catch (error) {
      console.error("Error generating recipe suggestions:", error);
      if (error instanceof Error) throw error;
      throw new Error("Failed to generate recipe suggestions");
    }
  },
});

export const generateIngredientSubstitutions = action({
  args: {
    ingredient: v.string(),
    dietaryRestrictions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = requireGroqApiKey();

    const dietary = args.dietaryRestrictions
      ? ` Dietary restrictions to respect: ${args.dietaryRestrictions}.`
      : "";

    const prompt = `Ingredient to find substitutes for: "${args.ingredient}".${dietary}

Return ONLY valid JSON (no markdown, no text before or after) with exactly this shape:
{
  "substitutions": [
    {
      "name": "substitute ingredient name",
      "ratio": "e.g. 1:1 or 1/2 cup for 1 cup",
      "explanation": "why it works",
      "notes": "cooking adjustments or empty string"
    }
  ]
}

Include 3 to 5 items in "substitutions". Use double quotes for all keys and string values. Escape any " inside strings as \\".`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a culinary expert. Reply with a single JSON object only, following the user's schema. No markdown fences.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content as string;

      const parsed = parseGroqJsonContent(generatedText) as {
        substitutions?: unknown;
      };
      const substitutions = parsed.substitutions;
      if (!Array.isArray(substitutions)) {
        throw new Error("AI response did not include a substitutions array");
      }
      return substitutions;
    } catch (error) {
      console.error("Error generating ingredient substitutions:", error);
      if (error instanceof Error) throw error;
      throw new Error("Failed to generate ingredient substitutions");
    }
  },
});

export const generateCookingTips = action({
  args: {
    recipeType: v.string(),
    skillLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = requireGroqApiKey();

    const prompt = `Provide 5 helpful cooking tips for ${args.recipeType}${args.skillLevel ? ` for ${args.skillLevel} cooks` : ''}.
    
    Each tip should include:
    1. The tip title
    2. Detailed explanation
    3. Why it's important
    
    Format as a JSON array with fields: title, explanation, importance`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a professional chef and cooking instructor with expertise in various cooking techniques and methods."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse cooking tips from AI response");
      }

      const tips = JSON.parse(jsonMatch[0]);
      return tips;
    } catch (error) {
      console.error("Error generating cooking tips:", error);
      if (error instanceof Error) throw error;
      throw new Error("Failed to generate cooking tips");
    }
  },
});

export const generateMealPlan = action({
  args: {
    dietaryPreferences: v.string(),
    days: v.number(),
    budget: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = requireGroqApiKey();

    const prompt = `Create a ${args.days}-day meal plan for someone with these dietary preferences: ${args.dietaryPreferences}${args.budget ? ` and budget: ${args.budget}` : ''}.
    
    For each day, provide:
    1. Breakfast
    2. Lunch
    3. Dinner
    4. Snack (optional)
    
    Include:
    - Recipe names
    - Brief descriptions
    - Estimated prep time
    - Key ingredients
    
    Format as a JSON array with days containing meals with fields: name, description, prepTime, keyIngredients`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a nutritionist and meal planning expert who creates balanced, practical meal plans."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not parse meal plan from AI response");
      }

      const mealPlan = JSON.parse(jsonMatch[0]);
      return mealPlan;
    } catch (error) {
      console.error("Error generating meal plan:", error);
      if (error instanceof Error) throw error;
      throw new Error("Failed to generate meal plan");
    }
  },
});
