import { apiClient } from "./config"

export interface Category {
  ID_CATEGORIE: number
  NOM_CATEGORIE: string
  DESCRIPTION?: string
  IMAGE?: string
  nb_recettes?: number
}

export const categoriesAPI = {
  // Obtenir toutes les catégories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get("/categories")
    return response.data
  },

  // Obtenir une catégorie par ID
  getCategory: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`)
    return response.data
  },

  // Obtenir les recettes d'une catégorie
  getCategoryRecipes: async (id: number, params: any = {}): Promise<any> => {
    const response = await apiClient.get(`/categories/${id}/recipes`, { params })
    return response.data
  },

  // Créer une nouvelle catégorie (admin)
  createCategory: async (categoryData: Omit<Category, "ID_CATEGORIE">): Promise<{ id: number; message: string }> => {
    const response = await apiClient.post("/categories", categoryData)
    return response.data
  },

  // Mettre à jour une catégorie (admin)
  updateCategory: async (id: number, categoryData: Partial<Category>): Promise<{ message: string }> => {
    const response = await apiClient.put(`/categories/${id}`, categoryData)
    return response.data
  },

  // Supprimer une catégorie (admin)
  deleteCategory: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/categories/${id}`)
    return response.data
  },
}
