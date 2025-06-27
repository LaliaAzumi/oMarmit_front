import api  from "./config"
import type { Recipe } from "./recipes"

export interface Collection {
  ID_COLLECTION: number
  NOM_COLLECTION: string
  DESCRIPTION?: string
  DATE_CREATION: string
  nb_recettes: number
  is_public?: boolean
  ID_USER: number
  USERNAME?: string
}

export interface CollectionRecipe extends Recipe {
  DATE_AJOUT: string
  ORDRE?: number
}

export interface CollectionWithRecipes extends Collection {
  recipes: CollectionRecipe[]
}

// API de collections - /api/collections/*
export const collectionsAPI = {
  getCollection: async (collectionId: number): Promise<CollectionWithRecipes> => {
    const response = await api.get(`/collections/${collectionId}`)
    return response.data
  },

  updateCollection: async (
    collectionId: number,
    collectionData: {
      nom_collection?: string
      description?: string
      is_public?: boolean
    },
  ): Promise<Collection> => {
    const response = await api.put(`/collections/${collectionId}`, collectionData)
    return response.data
  },

  deleteCollection: async (collectionId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/collections/${collectionId}`)
    return response.data
  },

  getCollectionRecipes: async (
    collectionId: number,
    page = 1,
    limit = 20,
  ): Promise<{
    recipes: CollectionRecipe[]
    total: number
    page: number
    totalPages: number
  }> => {
    const response = await api.get(`/collections/${collectionId}/recipes`, {
      params: { page, limit },
    })
    return response.data
  },

  addRecipeToCollection: async (
    collectionId: number,
    recipeId: number,
    ordre?: number,
  ): Promise<{ message: string }> => {
    const response = await api.post(`/collections/${collectionId}/recipes`, {
      recipe_id: recipeId,
      ...(ordre && { ordre }),
    })
    return response.data
  },

  removeRecipeFromCollection: async (collectionId: number, recipeId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/collections/${collectionId}/recipes/${recipeId}`)
    return response.data
  },

  reorderRecipesInCollection: async (
    collectionId: number,
    recipeOrders: Array<{
      recipe_id: number
      ordre: number
    }>,
  ): Promise<{ message: string }> => {
    const response = await api.put(`/collections/${collectionId}/reorder`, { recipe_orders: recipeOrders })
    return response.data
  },

  duplicateCollection: async (collectionId: number, newName: string): Promise<Collection> => {
    const response = await api.post(`/collections/${collectionId}/duplicate`, { nom_collection: newName })
    return response.data
  },

  shareCollection: async (
    collectionId: number,
    shareSettings: {
      is_public: boolean
      allow_comments?: boolean
      allow_forks?: boolean
    },
  ): Promise<{ message: string; share_url: string }> => {
    const response = await api.put(`/collections/${collectionId}/share`, shareSettings)
    return response.data
  },

  forkCollection: async (collectionId: number, newName: string): Promise<Collection> => {
    const response = await api.post(`/collections/${collectionId}/fork`, { nom_collection: newName })
    return response.data
  },

  getPublicCollections: async (
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<{
    collections: Collection[]
    total: number
    page: number
    totalPages: number
  }> => {
    const params = { page, limit, ...(search && { search }) }
    const response = await api.get("/collections/public", { params })
    return response.data
  },

  getPopularCollections: async (limit = 10): Promise<Collection[]> => {
    const response = await api.get("/collections/popular", { params: { limit } })
    return response.data
  },

  getCollectionStats: async (
    collectionId: number,
  ): Promise<{
    total_recipes: number
    avg_rating: number
    total_views: number
    total_forks: number
    creation_date: string
    last_updated: string
    difficulty_distribution: Record<string, number>
    category_distribution: Record<string, number>
  }> => {
    const response = await api.get(`/collections/${collectionId}/stats`)
    return response.data
  },
}
