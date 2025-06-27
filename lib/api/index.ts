// Point d'entrée principal pour toutes les APIs
export { authAPI } from "./auth"
export { recipesAPI } from "./recipes"
export { categoriesAPI } from "./categories"
export { ingredientsAPI } from "./ingredients"
export { usersAPI } from "./users"
export { adminAPI } from "./admin"
export { nutritionAPI } from "./nutrition"
export { searchAPI } from "./search"
export { healthAPI } from "./health"

// Export des types
export type { User, LoginData, RegisterData, AuthResponse } from "./auth"
export type { Recipe, CreateRecipeData, RecipesResponse, SearchParams } from "./recipes"
export type { Category } from "./categories"
export type { Ingredient } from "./ingredients"
export type { UserProfile, Collection, CreateCollectionData } from "./users"
export type { AdminStats, AdminUser } from "./admin"
export type { NutritionAnalysis, MealPlan } from "./nutrition"
export type { SearchFilters, SearchResult, SearchSuggestion } from "./search"
export type { HealthStatus } from "./health"

// Configuration
export { apiClient } from "./config"
