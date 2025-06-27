import { apiClient } from "./config"
import type { Recipe } from "./recipes"

export interface SearchFilters {
  query?: string
  category?: string
  ingredients?: string[]
  max_prep_time?: number
  max_cook_time?: number
  difficulty?: string
  dietary_restrictions?: string[]
  min_rating?: number
  max_calories?: number
  sort_by?: "relevance" | "rating" | "date" | "prep_time" | "popularity"
  sort_order?: "asc" | "desc"
}

export interface SearchResult {
  recipes: Recipe[]
  total: number
  page: number
  per_page: number
  total_pages: number
  suggestions?: string[]
  filters_applied: SearchFilters
}

export interface SearchSuggestion {
  text: string
  type: "recipe" | "ingredient" | "category"
  count: number
}

export const searchAPI = {
  // Recherche textuelle avancée
  searchRecipes: async (filters: SearchFilters, page = 1, limit = 20): Promise<SearchResult> => {
    const response = await apiClient.post("/search/recipes", {
      ...filters,
      page,
      limit,
    })
    return response.data
  },

  // Recherche par image (IA)
  searchByImage: async (
    imageFile: File,
  ): Promise<{
    recipes: Recipe[]
    detected_ingredients: string[]
    confidence: number
  }> => {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await apiClient.post("/search/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Recherche vocale (conversion speech-to-text puis recherche)
  searchByVoice: async (
    audioBlob: Blob,
  ): Promise<{
    transcription: string
    recipes: Recipe[]
  }> => {
    const formData = new FormData()
    formData.append("audio", audioBlob, "voice-search.wav")

    const response = await apiClient.post("/search/voice", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Obtenir des suggestions de recherche
  getSearchSuggestions: async (query: string): Promise<SearchSuggestion[]> => {
    const response = await apiClient.get("/search/suggestions", {
      params: { q: query },
    })
    return response.data
  },

  // Recherche intelligente avec IA
  aiSearch: async (
    naturalQuery: string,
  ): Promise<{
    interpreted_query: string
    recipes: Recipe[]
    explanation: string
  }> => {
    const response = await apiClient.post("/search/ai", {
      query: naturalQuery,
    })
    return response.data
  },

  // Obtenir l'historique de recherche
  getSearchHistory: async (): Promise<
    Array<{
      query: string
      timestamp: string
      results_count: number
    }>
  > => {
    const response = await apiClient.get("/search/history")
    return response.data
  },

  // Sauvegarder une recherche
  saveSearch: async (query: string, filters: SearchFilters): Promise<{ message: string }> => {
    const response = await apiClient.post("/search/save", { query, filters })
    return response.data
  },

  // Obtenir les recherches sauvegardées
  getSavedSearches: async (): Promise<
    Array<{
      id: number
      name: string
      query: string
      filters: SearchFilters
      created_at: string
    }>
  > => {
    const response = await apiClient.get("/search/saved")
    return response.data
  },

  // Supprimer une recherche sauvegardée
  deleteSavedSearch: async (searchId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/search/saved/${searchId}`)
    return response.data
  },

  // Obtenir les tendances de recherche
  getSearchTrends: async (
    period: "day" | "week" | "month" = "week",
  ): Promise<
    Array<{
      query: string
      count: number
      growth: number
    }>
  > => {
    const response = await apiClient.get("/search/trends", {
      params: { period },
    })
    return response.data
  },
}
