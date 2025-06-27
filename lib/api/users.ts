import { apiClient } from "./config"
import type { Recipe } from "./recipes"

export interface UserProfile {
  id: number
  username: string
  email: string
  nom?: string
  prenom?: string
  bio?: string
  avatar?: string
  is_admin: boolean
  date_inscription: string
  nb_recettes: number
  nb_favoris: number
  nb_collections: number
}

export interface Collection {
  ID_COLLECTION: number
  NOM_COLLECTION: string
  DESCRIPTION?: string
  DATE_CREATION: string
  nb_recettes: number
}

export interface CreateCollectionData {
  nom_collection: string
  description?: string
}

export const usersAPI = {
  // Obtenir le profil utilisateur
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await apiClient.get(`/users/${userId}/profile`)
    return response.data
  },

  // Mettre à jour le profil utilisateur
  updateUserProfile: async (userId: number, profileData: Partial<UserProfile>): Promise<{ message: string }> => {
    const response = await apiClient.put(`/users/${userId}/profile`, profileData)
    return response.data
  },

  // Obtenir les favoris de l'utilisateur
  getUserFavorites: async (userId: number): Promise<Recipe[]> => {
    const response = await apiClient.get(`/users/${userId}/favorites`)
    return response.data
  },

  // Obtenir les recettes créées par l'utilisateur
  getUserRecipes: async (userId: number, params: any = {}): Promise<any> => {
    const response = await apiClient.get(`/users/${userId}/recipes`, { params })
    return response.data
  },

  // Obtenir les collections de l'utilisateur
  getUserCollections: async (userId: number): Promise<Collection[]> => {
    const response = await apiClient.get(`/users/${userId}/collections`)
    return response.data
  },

  // Créer une nouvelle collection
  createCollection: async (
    userId: number,
    collectionData: CreateCollectionData,
  ): Promise<{ id: number; message: string }> => {
    const response = await apiClient.post(`/users/${userId}/collections`, collectionData)
    return response.data
  },

  // Obtenir une collection spécifique
  getCollection: async (userId: number, collectionId: number): Promise<any> => {
    const response = await apiClient.get(`/users/${userId}/collections/${collectionId}`)
    return response.data
  },

  // Mettre à jour une collection
  updateCollection: async (
    userId: number,
    collectionId: number,
    collectionData: Partial<CreateCollectionData>,
  ): Promise<{ message: string }> => {
    const response = await apiClient.put(`/users/${userId}/collections/${collectionId}`, collectionData)
    return response.data
  },

  // Supprimer une collection
  deleteCollection: async (userId: number, collectionId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${userId}/collections/${collectionId}`)
    return response.data
  },

  // Ajouter une recette à une collection
  addRecipeToCollection: async (
    userId: number,
    collectionId: number,
    recipeId: number,
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(`/users/${userId}/collections/${collectionId}/recipes`, { recipeId })
    return response.data
  },

  // Retirer une recette d'une collection
  removeRecipeFromCollection: async (
    userId: number,
    collectionId: number,
    recipeId: number,
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${userId}/collections/${collectionId}/recipes/${recipeId}`)
    return response.data
  },

  // Obtenir les statistiques utilisateur
  getUserStats: async (userId: number): Promise<any> => {
    const response = await apiClient.get(`/users/${userId}/stats`)
    return response.data
  },

  // Upload avatar
  uploadAvatar: async (userId: number, file: File): Promise<{ message: string; avatar_url: string }> => {
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await apiClient.post(`/users/${userId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}
