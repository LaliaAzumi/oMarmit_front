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

// API d'authentification
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
}

// API des recettes
export const recipesAPI = {
  getRecipes: async (params: any = {}) => {
    const response = await api.get("/recipes", { params })
    return response.data
  },

  getRecipe: async (id: number) => {
    const response = await api.get(`/recipes/${id}`)
    return response.data
  },

  addToFavorites: async (recipeId: number) => {
    const response = await api.post(`/recipes/${recipeId}/favorite`)
    return response.data
  },

  removeFromFavorites: async (recipeId: number) => {
    const response = await api.delete(`/recipes/${recipeId}/favorite`)
    return response.data
  },

  getUserFavorites: async (userId: number) => {
    const response = await api.get(`/users/${userId}/favorites`)
    return response.data
  },

  rateRecipe: async (recipeId: number, rating: number) => {
    const response = await api.post(`/recipes/${recipeId}/rate`, { rating })
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

// API des catégories
export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get("/categories")
    return response.data
  },
}

// API des ingrédients
export const ingredientsAPI = {
  getIngredients: async () => {
    const response = await api.get("/ingredients")
    return response.data
  },
}

// API de nutrition
export const nutritionAPI = {
  analyzeNutrition: async (ingredients: string, portions: number) => {
    const response = await api.post("/nutrition/analyze", { ingredients, portions })
    return response.data
  },
}

// API d'administration
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
}

export default api
