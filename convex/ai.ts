import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateRecipeSuggestions = action({
  args: {
    ingredients: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key not configured");
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key not configured");
    }

    const prompt = `Provide 3-5 ingredient substitution suggestions for: ${args.ingredient}${args.dietaryRestrictions ? ` considering dietary restrictions: ${args.dietaryRestrictions}` : ''}.
    
    For each substitution, provide:
    1. The substitute ingredient name
    2. The substitution ratio (e.g., "1:1", "2:1", "1/2 cup for 1 cup")
    3. Brief explanation of why it works as a substitute
    4. Any cooking method adjustments needed
    
    Format as a JSON array with fields: name, ratio, explanation, notes`;

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
              content: "You are a culinary expert specializing in ingredient substitutions and dietary accommodations."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1000,
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
        throw new Error("Could not parse substitution suggestions from AI response");
      }

      const substitutions = JSON.parse(jsonMatch[0]);
      return substitutions;
    } catch (error) {
      console.error("Error generating ingredient substitutions:", error);
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key not configured");
    }

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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key not configured");
    }

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
      throw new Error("Failed to generate meal plan");
    }
  },
});
