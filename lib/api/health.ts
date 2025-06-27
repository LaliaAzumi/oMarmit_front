import { apiClient } from "./config"

export interface HealthStatus {
  status: "healthy" | "degraded" | "down"
  timestamp: string
  services: {
    database: "up" | "down"
    redis: "up" | "down"
    storage: "up" | "down"
    ai_service: "up" | "down"
  }
  response_time: number
  version: string
}

export const healthAPI = {
  // Vérifier l'état de santé de l'API
  checkHealth: async (): Promise<HealthStatus> => {
    const response = await apiClient.get("/health")
    return response.data
  },

  // Ping simple pour vérifier la connectivité
  ping: async (): Promise<{ message: string; timestamp: string }> => {
    const response = await apiClient.get("/ping")
    return response.data
  },

  // Obtenir les métriques de performance
  getMetrics: async (): Promise<{
    requests_per_minute: number
    average_response_time: number
    error_rate: number
    active_users: number
  }> => {
    const response = await apiClient.get("/health/metrics")
    return response.data
  },
}
