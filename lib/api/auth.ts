import { apiClient } from "./config"

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  nom?: string
  prenom?: string
}

export interface User {
  id: number
  username: string
  email: string
  nom?: string
  prenom?: string
  is_admin: boolean
  date_inscription: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export const authAPI = {
  // Connexion utilisateur
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", { email, password })
    return response.data
  },

  // Inscription utilisateur
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", userData)
    return response.data
  },

  // Déconnexion
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout")
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me")
    return response.data
  },

  // Vérifier si l'utilisateur est connecté
  checkAuth: async (): Promise<boolean> => {
    try {
      await apiClient.get("/auth/verify")
      return true
    } catch {
      return false
    }
  },

  // Réinitialiser le mot de passe
  resetPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/reset-password", { email })
    return response.data
  },

  // Confirmer la réinitialisation du mot de passe
  confirmResetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/confirm-reset", { token, password: newPassword })
    return response.data
  },

  // Changer le mot de passe
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.put("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    })
    return response.data
  },
}
