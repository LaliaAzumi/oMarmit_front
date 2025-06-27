import { apiClient } from "./config"

export interface Ingredient {
  ID_INGREDIENT: number
  NOM_INGREDIENT: string
  UNITE_MESURE?: string
  CALORIES_PAR_100G?: number
  PROTEINES_PAR_100G?: number
  GLUCIDES_PAR_100G?: number
  LIPIDES_PAR_100G?: number
}

export const ingredientsAPI = {
  // Obtenir tous les ingrédients
  getIngredients: async (search?: string): Promise<Ingredient[]> => {
    const params = search ? { search } : {}
    const response = await apiClient.get("/ingredients", { params })
    return response.data
  },

  // Obtenir un ingrédient par ID
  getIngredient: async (id: number): Promise<Ingredient> => {
    const response = await apiClient.get(`/ingredients/${id}`)
    return response.data
  },

  // Rechercher des ingrédients
  searchIngredients: async (query: string): Promise<Ingredient[]> => {
    const response = await apiClient.get("/ingredients/search", { params: { q: query } })
    return response.data
  },

  // Créer un nouvel ingrédient (admin)
  createIngredient: async (
    ingredientData: Omit<Ingredient, "ID_INGREDIENT">,
  ): Promise<{ id: number; message: string }> => {
    const response = await apiClient.post("/ingredients", ingredientData)
    return response.data
  },

  // Mettre à jour un ingrédient (admin)
  updateIngredient: async (id: number, ingredientData: Partial<Ingredient>): Promise<{ message: string }> => {
    const response = await apiClient.put(`/ingredients/${id}`, ingredientData)
    return response.data
  },

  // Supprimer un ingrédient (admin)
  deleteIngredient: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/ingredients/${id}`)
    return response.data
  },
}
