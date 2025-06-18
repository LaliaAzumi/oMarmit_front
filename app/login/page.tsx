"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { authAPI } from "@/lib/api"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const successMessage = urlParams.get("success")
    if (successMessage) {
      // Vous pouvez afficher le message de succès ici
      console.log(successMessage)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const data = await authAPI.login(formData.email, formData.password)

      // Stocker le token et les informations utilisateur
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Rediriger vers la page d'accueil
      router.push("/")
      router.refresh()
    } catch (error: any) {
      setError(error.response?.data?.message || "Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Connexion à Ô'Marmit</CardTitle>
          <p className="text-gray-600">Connectez-vous pour accéder à vos recettes favorites</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Ajouter ceci pour le message de succès */}
            {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("success") && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {new URLSearchParams(window.location.search).get("success")}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control-custom pl-10"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-custom pl-10 pr-10"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full btn-primary-custom">
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Créer un compte
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Ou{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                continuer sans compte
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
