"use client"

import { useState, useEffect } from "react"
import { authAPI, recipesAPI, categoriesAPI, ingredientsAPI, adminAPI } from "@/lib/api"

// Hook personnalisé pour gérer les appels API avec état de chargement
export function useAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callAPI = async (apiCall: () => Promise<any>) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      return result
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Une erreur est survenue")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { callAPI, loading, error, setError }
}

// Hook pour les recettes
export function useRecipes() {
  const [recipes, setRecipes] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const { callAPI, loading, error } = useAPI()

  const fetchRecipes = async (params = {}) => {
    const data = await callAPI(() => recipesAPI.getRecipes(params))
    if (data) {
      setRecipes(data.recipes || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.currentPage || 1)
    }
  }

  const fetchRecipe = async (id: number) => {
    return await callAPI(() => recipesAPI.getRecipe(id))
  }

  const addToFavorites = async (recipeId: number) => {
    return await callAPI(() => recipesAPI.addToFavorites(recipeId))
  }

  const removeFromFavorites = async (recipeId: number) => {
    return await callAPI(() => recipesAPI.removeFromFavorites(recipeId))
  }

  const rateRecipe = async (recipeId: number, rating: number) => {
    return await callAPI(() => recipesAPI.rateRecipe(recipeId, rating))
  }

  const addComment = async (recipeId: number, content: string) => {
    return await callAPI(() => recipesAPI.addComment(recipeId, content))
  }

  return {
    recipes,
    totalPages,
    currentPage,
    loading,
    error,
    fetchRecipes,
    fetchRecipe,
    addToFavorites,
    removeFromFavorites,
    rateRecipe,
    addComment,
  }
}

// Hook pour les catégories
export function useCategories() {
  const [categories, setCategories] = useState([])
  const { callAPI, loading, error } = useAPI()

  const fetchCategories = async () => {
    const data = await callAPI(() => categoriesAPI.getCategories())
    if (data) {
      setCategories(data)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, error, fetchCategories }
}

// Hook pour les ingrédients
export function useIngredients() {
  const [ingredients, setIngredients] = useState([])
  const { callAPI, loading, error } = useAPI()

  const fetchIngredients = async (search?: string) => {
    const data = await callAPI(() => ingredientsAPI.getIngredients(search))
    if (data) {
      setIngredients(data)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

  return { ingredients, loading, error, fetchIngredients }
}

// Hook pour l'authentification
export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { callAPI, loading, error } = useAPI()

  const login = async (email: string, password: string) => {
    const data = await callAPI(() => authAPI.login(email, password))
    if (data) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const register = async (userData: any) => {
    return await callAPI(() => authAPI.register(userData))
  }

  const logout = async () => {
    await callAPI(() => authAPI.logout())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
  }

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const userData = await callAPI(() => authAPI.getCurrentUser())
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      }
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  }
}

// Hook pour l'administration
export function useAdmin() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const { callAPI, loading, error } = useAPI()

  const fetchStats = async () => {
    const data = await callAPI(() => adminAPI.getStats())
    if (data) {
      setStats(data)
    }
  }

  const fetchUsers = async (page = 1, limit = 20) => {
    const data = await callAPI(() => adminAPI.getUsers(page, limit))
    if (data) {
      setUsers(data.users || [])
    }
  }

  const toggleUserAdmin = async (userId: number) => {
    return await callAPI(() => adminAPI.toggleUserAdmin(userId))
  }

  const deleteUser = async (userId: number) => {
    return await callAPI(() => adminAPI.deleteUser(userId))
  }

  return {
    stats,
    users,
    loading,
    error,
    fetchStats,
    fetchUsers,
    toggleUserAdmin,
    deleteUser,
  }
}
