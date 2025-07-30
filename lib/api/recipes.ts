import { apiClient } from "./config"

export interface Recipe {
  ID_RECETTE: number
  TITRE: string
  DESCRIPTION: string
  INGREDIENTS: string
  INSTRUCTIONS: string
  IMAGE?: string
  temps_preparation: number
  temps_cuisson: number
  difficulte: string
  regime_alimentaire: string
  calories?: number
  proteines?: number
  glucides?: number
  lipides?: number
  USERNAME: string
  note_moyenne?: number
  nombre_notes?: number
  ID_CATEGORIE: number
  DATE_CREATION: string
}
export interface Ingredient {
  name: string
  quantity?: string
  unit: string
}
export interface CreateRecipeData {
  titre: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  id_categorie: number
  temps_preparation: number
  temps_cuisson: number
  difficulte: string
  regime_alimentaire: string
  calories?: number
  proteines?: number
  glucides?: number
  lipides?: number
  image?: File|null
}

export interface RecipesResponse {
  recipes: Recipe[]
  totalPages: number
  currentPage: number
  totalRecipes: number
}

export interface SearchParams {
  q?: string
  category?: string
  ingredients?: string
  maxPrepTime?: number
  difficulty?: string
  diet?: string
  minRating?: number
  maxCalories?: number
  page?: number
  limit?: number
}

export const recipesAPI = {
  // Obtenir toutes les recettes avec filtres
  getRecipes: async (params: SearchParams = {}): Promise<RecipesResponse> => {
    const response = await apiClient.get("/recipes", { params })
    return response.data
  },

  // Obtenir une recette par ID
  getRecipe: async (id: number): Promise<Recipe> => {
    const response = await apiClient.get(`/recipes/${id}`)
    return response.data
  },

  // Créer une nouvelle recette
  createRecipe: async (recipeData: CreateRecipeData): Promise<{ id: number; message: string }> => {
    const formData = new FormData()

    Object.entries(recipeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "image" && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await apiClient.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Mettre à jour une recette
  updateRecipe: async (id: number, recipeData: Partial<CreateRecipeData>): Promise<{ message: string }> => {
    const formData = new FormData()

    Object.entries(recipeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "image" && value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await apiClient.put(`/recipes/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Supprimer une recette
  deleteRecipe: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/recipes/${id}`)
    return response.data
  },

  // Ajouter aux favoris
  addToFavorites: async (recipeId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/recipes/${recipeId}/favorite`)
    return response.data
  },

  // Retirer des favoris
  removeFromFavorites: async (recipeId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/recipes/${recipeId}/favorite`)
    return response.data
  },

  // Vérifier le statut de favori
  getFavoriteStatus: async (recipeId: number): Promise<{ isFavorite: boolean }> => {
    const response = await apiClient.get(`/recipes/${recipeId}/favorite-status`)
    return response.data
  },

  // Noter une recette
  rateRecipe: async (recipeId: number, rating: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`/recipes/${recipeId}/rate`, { rating })
    return response.data
  },

  // Obtenir la note utilisateur
  getUserRating: async (recipeId: number): Promise<{ rating: number }> => {
    const response = await apiClient.get(`/recipes/${recipeId}/user-rating`)
    return response.data
  },

  // Obtenir toutes les notes d'une recette
  getRecipeRatings: async (recipeId: number): Promise<any[]> => {
    const response = await apiClient.get(`/recipes/${recipeId}/ratings`)
    return response.data
  },

  // Ajouter un commentaire
  addComment: async (recipeId: number, content: string): Promise<{ message: string }> => {
    const response = await apiClient.post(`/recipes/${recipeId}/comment`, { content })
    return response.data
  },

  // Obtenir les commentaires d'une recette
  getComments: async (recipeId: number): Promise<any[]> => {
    const response = await apiClient.get(`/recipes/${recipeId}/comments`)
    return response.data
  },

  // Obtenir les recettes similaires
  getSimilarRecipes: async (recipeId: number): Promise<Recipe[]> => {
    const response = await apiClient.get(`/recipes/${recipeId}/similar`)
    return response.data
  },

  // Obtenir les recettes populaires
  getPopularRecipes: async (limit = 10): Promise<Recipe[]> => {
    const response = await apiClient.get("/recipes/popular", { params: { limit } })
    return response.data
  },

  // Obtenir les recettes récentes
  getRecentRecipes: async (limit = 10): Promise<Recipe[]> => {
    const response = await apiClient.get("/recipes/recent", { params: { limit } })
    return response.data
  },
}
