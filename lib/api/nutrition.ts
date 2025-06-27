import { apiClient } from "./config"

export interface NutritionAnalysis {
  calories: number
  proteines: number
  glucides: number
  lipides: number
  fibres?: number
  sucres?: number
  sodium?: number
  vitamins?: Array<{
    name: string
    amount: string
    daily_value?: number
  }>
  minerals?: Array<{
    name: string
    amount: string
    daily_value?: number
  }>
}

export interface MealPlan {
  id: number
  name: string
  description: string
  meals: Array<{
    type: "breakfast" | "lunch" | "dinner" | "snack"
    recipes: any[]
    total_calories: number
  }>
  total_daily_calories: number
  dietary_restrictions: string[]
}

export const nutritionAPI = {
  // Analyser la nutrition d'une liste d'ingrédients
  analyzeIngredients: async (ingredients: string, portions = 1): Promise<NutritionAnalysis> => {
    const response = await apiClient.post("/nutrition/analyze", { ingredients, portions })
    return response.data
  },

  // Obtenir les informations nutritionnelles d'un ingrédient
  getIngredientNutrition: async (
    ingredientName: string,
    quantity: number,
    unit: string,
  ): Promise<NutritionAnalysis> => {
    const response = await apiClient.get("/nutrition/ingredient", {
      params: { name: ingredientName, quantity, unit },
    })
    return response.data
  },

  // Calculer les besoins caloriques quotidiens
  calculateDailyNeeds: async (
    age: number,
    gender: "male" | "female",
    weight: number,
    height: number,
    activity: string,
  ): Promise<{
    calories: number
    protein: number
    carbs: number
    fat: number
  }> => {
    const response = await apiClient.post("/nutrition/daily-needs", {
      age,
      gender,
      weight,
      height,
      activity,
    })
    return response.data
  },

  // Générer un plan de repas
  generateMealPlan: async (params: {
    calories_target: number
    dietary_restrictions: string[]
    meals_per_day: number
    days: number
  }): Promise<MealPlan> => {
    const response = await apiClient.post("/nutrition/meal-plan", params)
    return response.data
  },

  // Vérifier la compatibilité avec un régime alimentaire
  checkDietCompatibility: async (
    recipeId: number,
    diet: string,
  ): Promise<{
    compatible: boolean
    issues: string[]
    suggestions: string[]
  }> => {
    const response = await apiClient.get(`/nutrition/diet-check/${recipeId}`, {
      params: { diet },
    })
    return response.data
  },

  // Obtenir des alternatives d'ingrédients
  getIngredientAlternatives: async (
    ingredient: string,
    dietary_restrictions: string[] = [],
  ): Promise<
    Array<{
      name: string
      substitution_ratio: string
      notes: string
    }>
  > => {
    const response = await apiClient.get("/nutrition/alternatives", {
      params: { ingredient, dietary_restrictions: dietary_restrictions.join(",") },
    })
    return response.data
  },

  // Analyser l'équilibre nutritionnel d'une recette
  analyzeNutritionalBalance: async (
    recipeId: number,
  ): Promise<{
    score: number
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }> => {
    const response = await apiClient.get(`/nutrition/balance/${recipeId}`)
    return response.data
  },
}
