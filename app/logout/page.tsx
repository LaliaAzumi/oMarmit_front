"use client"

import { useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    logout()
    router.push("/")
  }, [logout, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Déconnexion en cours...</div>
    </div>
  )
}
