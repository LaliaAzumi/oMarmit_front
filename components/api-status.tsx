"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { healthAPI } from "@/lib/api"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function APIStatus() {
  const [status, setStatus] = useState<"healthy" | "unhealthy" | "checking">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkAPIHealth = async () => {
    try {
      setStatus("checking")
      await healthAPI.checkHealth()
      setStatus("healthy")
      setLastCheck(new Date())
    } catch (error) {
      setStatus("unhealthy")
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    checkAPIHealth()

    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkAPIHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "checking":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "unhealthy":
        return "bg-red-100 text-red-800 border-red-200"
      case "checking":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "healthy":
        return "API Connectée"
      case "unhealthy":
        return "API Déconnectée"
      case "checking":
        return "Vérification..."
    }
  }

  if (status === "healthy") {
    return null // Ne pas afficher si tout va bien
  }

  return (
    <Alert className={`mb-4 ${getStatusColor()}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              <Badge variant="outline" className="mr-2">
                {getStatusText()}
              </Badge>
              {status === "unhealthy" && <span>Mode hors ligne activé - Données limitées disponibles</span>}
              {status === "checking" && <span>Connexion au serveur en cours...</span>}
            </span>
            {lastCheck && (
              <span className="text-xs opacity-70">Dernière vérification: {lastCheck.toLocaleTimeString()}</span>
            )}
          </div>
        </AlertDescription>
      </div>
    </Alert>
  )
}
