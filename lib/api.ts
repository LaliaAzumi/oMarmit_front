import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

// Configuration d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// API d'authentification - /api/auth/*
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    return response.data
  },

  register: async (userData: {
    username: string
    email: string
    password: string
    bio?: string
    dietaryRestrictions?: string[]
  }) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },

  logout: async () => {
    const response = await api.post("/auth/logout")
    return response.data
  },
}

// API des recettes - /api/recipes/*
export const recipesAPI = {
  getRecipes: async (params: any = {}) => {
    const response = await api.get("/recipes", { params })
    return response.data
  },

  getRecipe: async (id: number) => {
    const response = await api.get(`/recipes/${id}`)
    return response.data
  },

  createRecipe: async (recipeData: any) => {
    const response = await api.post("/recipes", recipeData)
    return response.data
  },

  updateRecipe: async (id: number, recipeData: any) => {
    const response = await api.put(`/recipes/${id}`, recipeData)
    return response.data
  },

  deleteRecipe: async (id: number) => {
    const response = await api.delete(`/recipes/${id}`)
    return response.data
  },

  // Favoris
  addToFavorites: async (recipeId: number) => {
    const response = await api.post(`/recipes/${recipeId}/favorite`)
    return response.data
  },

  removeFromFavorites: async (recipeId: number) => {
    const response = await api.delete(`/recipes/${recipeId}/favorite`)
    return response.data
  },

  checkFavoriteStatus: async (recipeId: number) => {
    const response = await api.get(`/recipes/${recipeId}/favorite-status`)
    return response.data
  },

  // Notes et commentaires
  rateRecipe: async (recipeId: number, rating: number) => {
    const response = await api.post(`/recipes/${recipeId}/rate`, { rating })
    return response.data
  },

  getUserRating: async (recipeId: number) => {
    const response = await api.get(`/recipes/${recipeId}/user-rating`)
    return response.data
  },

  addComment: async (recipeId: number, content: string) => {
    const response = await api.post(`/recipes/${recipeId}/comment`, { content })
    return response.data
  },

  getComments: async (recipeId: number) => {
    const response = await api.get(`/recipes/${recipeId}/comments`)
    return response.data
  },

  getRatings: async (recipeId: number) => {
    const response = await api.get(`/recipes/${recipeId}/ratings`)
    return response.data
  },
}

// API des catégories - /api/categories/*
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get("/categories")
    return response.data
  },

  getCategory: async (id: number) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  getCategoryRecipes: async (id: number, params: any = {}) => {
    const response = await api.get(`/categories/${id}/recipes`, { params })
    return response.data
  },

  createCategory: async (categoryData: { nom_categorie: string }) => {
    const response = await api.post("/categories", categoryData)
    return response.data
  },

  updateCategory: async (id: number, categoryData: { nom_categorie: string }) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
}

// API des ingrédients - /api/ingredients/*
export const ingredientsAPI = {
  getIngredients: async (search?: string) => {
    const params = search ? { search } : {}
    const response = await api.get("/ingredients", { params })
    return response.data
  },

  getIngredient: async (id: number) => {
    const response = await api.get(`/ingredients/${id}`)
    return response.data
  },

  getIngredientRecipes: async (id: number, params: any = {}) => {
    const response = await api.get(`/ingredients/${id}/recipes`, { params })
    return response.data
  },

  createIngredient: async (ingredientData: { nom_ingredient: string }) => {
    const response = await api.post("/ingredients", ingredientData)
    return response.data
  },

  updateIngredient: async (id: number, ingredientData: { nom_ingredient: string }) => {
    const response = await api.put(`/ingredients/${id}`, ingredientData)
    return response.data
  },

  deleteIngredient: async (id: number) => {
    const response = await api.delete(`/ingredients/${id}`)
    return response.data
  },
}

// API des utilisateurs - /api/users/*
export const usersAPI = {
  getUserFavorites: async (userId: number) => {
    const response = await api.get(`/users/${userId}/favorites`)
    return response.data
  },

  getUserCollections: async (userId: number) => {
    const response = await api.get(`/users/${userId}/collections`)
    return response.data
  },

  createCollection: async (userId: number, collectionData: { nom_collection: string; description?: string }) => {
    const response = await api.post(`/users/${userId}/collections`, collectionData)
    return response.data
  },

  getUserProfile: async (userId: number) => {
    const response = await api.get(`/users/${userId}/profile`)
    return response.data
  },

  updateUserProfile: async (userId: number, profileData: any) => {
    const response = await api.put(`/users/${userId}/profile`, profileData)
    return response.data
  },

  getUserRecipes: async (userId: number, params: any = {}) => {
    const response = await api.get(`/users/${userId}/recipes`, { params })
    return response.data
  },
}

// API de nutrition - /api/nutrition/*
export const nutritionAPI = {
  analyzeNutrition: async (ingredients: string, portions: number) => {
    const response = await api.post("/nutrition/analyze", { ingredients, portions })
    return response.data
  },

  getNutritionSuggestions: async (preferences: string[], recipeIngredients: string) => {
    const response = await api.post("/nutrition/suggestions", {
      preferences,
      recipe_ingredients: recipeIngredients,
    })
    return response.data
  },

  getHealthScore: async (recipeData: any) => {
    const response = await api.post("/nutrition/health-score", recipeData)
    return response.data
  },
}

// API d'administration - /api/admin/*
export const adminAPI = {
  getStats: async () => {
    const response = await api.get("/admin/stats")
    return response.data
  },

  getUsers: async (page = 1, limit = 20) => {
    const response = await api.get("/admin/users", { params: { page, limit } })
    return response.data
  },

  toggleUserAdmin: async (userId: number) => {
    const response = await api.put(`/admin/users/${userId}/toggle-admin`)
    return response.data
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  getAllRecipes: async (page = 1, limit = 20) => {
    const response = await api.get("/admin/recipes", { params: { page, limit } })
    return response.data
  },

  deleteRecipe: async (recipeId: number) => {
    const response = await api.delete(`/admin/recipes/${recipeId}`)
    return response.data
  },

  moderateComment: async (commentId: number, action: "approve" | "reject") => {
    const response = await api.put(`/admin/comments/${commentId}/moderate`, { action })
    return response.data
  },

  getReports: async () => {
    const response = await api.get("/admin/reports")
    return response.data
  },
}

// API de recherche - /api/search/*
export const searchAPI = {
  searchRecipes: async (query: string, filters: any = {}) => {
    const response = await api.get("/recipes", {
      params: { q: query, ...filters },
    })
    return response.data
  },

  getSearchSuggestions: async (query: string) => {
    const response = await api.get("/search/suggestions", { params: { q: query } })
    return response.data
  },

  getPopularSearches: async () => {
    const response = await api.get("/search/popular")
    return response.data
  },
}

// API de collections - /api/collections/*
export const collectionsAPI = {
  getCollection: async (collectionId: number) => {
    const response = await api.get(`/collections/${collectionId}`)
    return response.data
  },

  updateCollection: async (collectionId: number, collectionData: any) => {
    const response = await api.put(`/collections/${collectionId}`, collectionData)
    return response.data
  },

  deleteCollection: async (collectionId: number) => {
    const response = await api.delete(`/collections/${collectionId}`)
    return response.data
  },

  addRecipeToCollection: async (collectionId: number, recipeId: number) => {
    const response = await api.post(`/collections/${collectionId}/recipes`, { recipe_id: recipeId })
    return response.data
  },

  removeRecipeFromCollection: async (collectionId: number, recipeId: number) => {
    const response = await api.delete(`/collections/${collectionId}/recipes/${recipeId}`)
    return response.data
  },

  getCollectionRecipes: async (collectionId: number) => {
    const response = await api.get(`/collections/${collectionId}/recipes`)
    return response.data
  },
}

// API de santé - /api/health
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get("/health")
    return response.data
  },
}

// Fichier de compatibilité - garde l'ancienne interface pour éviter les breaking changes
// TODO: Supprimer ce fichier une fois que tous les composants utilisent les nouvelles APIs
export * from "./api"

// Réexport de l'API principale pour compatibilité
export default api
