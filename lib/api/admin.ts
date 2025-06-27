import { apiClient } from "./config"

export interface AdminStats {
  totalUsers: number
  totalRecipes: number
  totalCategories: number
  totalIngredients: number
  recentUsers: number
  recentRecipes: number
  popularRecipes: any[]
  userGrowth: any[]
}

export interface AdminUser {
  id: number
  username: string
  email: string
  is_admin: boolean
  date_inscription: string
  nb_recettes: number
  last_login?: string
}

export const adminAPI = {
  // Obtenir les statistiques du dashboard
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get("/admin/stats")
    return response.data
  },

  // Obtenir tous les utilisateurs
  getUsers: async (page = 1, limit = 20): Promise<{ users: AdminUser[]; totalPages: number; currentPage: number }> => {
    const response = await apiClient.get("/admin/users", { params: { page, limit } })
    return response.data
  },

  // Basculer le statut admin d'un utilisateur
  toggleUserAdmin: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/admin/users/${userId}/toggle-admin`)
    return response.data
  },

  // Supprimer un utilisateur
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/admin/users/${userId}`)
    return response.data
  },

  // Obtenir toutes les recettes (modération)
  getAllRecipes: async (page = 1, limit = 20): Promise<any> => {
    const response = await apiClient.get("/admin/recipes", { params: { page, limit } })
    return response.data
  },

  // Modérer une recette (approuver/rejeter)
  moderateRecipe: async (
    recipeId: number,
    action: "approve" | "reject",
    reason?: string,
  ): Promise<{ message: string }> => {
    const response = await apiClient.put(`/admin/recipes/${recipeId}/moderate`, { action, reason })
    return response.data
  },

  // Obtenir les commentaires signalés
  getReportedComments: async (): Promise<any[]> => {
    const response = await apiClient.get("/admin/comments/reported")
    return response.data
  },

  // Modérer un commentaire
  moderateComment: async (commentId: number, action: "approve" | "delete"): Promise<{ message: string }> => {
    const response = await apiClient.put(`/admin/comments/${commentId}/moderate`, { action })
    return response.data
  },

  // Obtenir les logs d'audit
  getAuditLogs: async (page = 1, limit = 50): Promise<any> => {
    const response = await apiClient.get("/admin/audit-logs", { params: { page, limit } })
    return response.data
  },

  // Obtenir les métriques système
  getSystemMetrics: async (): Promise<any> => {
    const response = await apiClient.get("/admin/system-metrics")
    return response.data
  },

  // Sauvegarder la base de données
  backupDatabase: async (): Promise<{ message: string; backup_file: string }> => {
    const response = await apiClient.post("/admin/backup-database")
    return response.data
  },

  // Nettoyer les fichiers temporaires
  cleanupTempFiles: async (): Promise<{ message: string; files_deleted: number }> => {
    const response = await apiClient.post("/admin/cleanup-temp")
    return response.data
  },
}
