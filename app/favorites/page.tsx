"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import RecipeCard from "@/components/recipe-card"
import ProtectedRoute from "@/components/protected-route"
import APIStatus from "@/components/api-status"
import { Button } from "@/components/ui/button"
import { Heart, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { recipesAPI, usersAPI } from "@/lib/api"

interface FavoriteRecipe {
  ID_RECETTE: number
  TITRE: string
  DESCRIPTION: string
  IMAGE: string
  DATE_AJOUT: string
  temps_preparation?: number
  temps_cuisson?: number
  difficulte?: string
  regime_alimentaire?: string
  calories?: number
  note_moyenne?: number
  nombre_notes?: number
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await usersAPI.getUserFavorites(user.id)
      setFavorites(data)
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
      setError("Erreur lors du chargement des favoris")
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (recipeId: number) => {
    try {
      await recipesAPI.removeFromFavorites(recipeId)
      setFavorites((prev) => prev.filter((fav) => fav.ID_RECETTE !== recipeId))
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error)
    }
  }

  const toggleFavorite = async (recipeId: number) => {
    await removeFavorite(recipeId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <APIStatus />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Heart className="text-red-500" size={32} />
              Mes Recettes Favorites
            </h1>
            <p className="text-gray-600">
              {favorites.length} recette{favorites.length !== 1 ? "s" : ""} dans vos favoris
            </p>
          </div>

          {/* Affichage des erreurs */}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Contenu principal */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg">Chargement de vos favoris...</div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {favorites.map((recipe) => (
                <RecipeCard
                  key={recipe.ID_RECETTE}
                  recipe={recipe}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune recette favorite</h3>
              <p className="text-gray-600 mb-4">
                Commencez à ajouter des recettes à vos favoris en cliquant sur le cœur ❤️
              </p>
              <Button asChild className="btn-primary-custom">
                <a href="/">
                  <Search size={16} className="mr-2" />
                  Découvrir des recettes
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
