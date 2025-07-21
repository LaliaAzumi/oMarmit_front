"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import CategoryNav from "@/components/category-nav"
import RecipeCard from "@/components/recipe-card"
import RecipePublisher from "@/components/recipe-publisher"
import AdvancedSearch from "@/components/advanced-search"
import APIStatus from "@/components/api-status"
import { Button } from "@/components/ui/button"
import { Filter, Search, TrendingUp, Clock, Star } from "lucide-react"
import { useRecipes } from "@/hooks/use-api"
import { useAuth } from "@/components/auth-provider"
import { recipesAPI, usersAPI } from "@/lib/api"

export default function HomePage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [activeTab, setActiveTab] = useState<"recent" | "trending" | "favorites">("recent")

  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { recipes, totalPages, currentPage, loading, error, fetchRecipes } = useRecipes()

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    // Ajouter le tri selon l'onglet actif
    if (activeTab === "trending") {
      params.sort = "rating"
    } else if (activeTab === "recent") {
      params.sort = "created_at"
    }
    fetchRecipes(params)
  }, [searchParams, activeTab])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      const data = await usersAPI.getUserFavorites(user.id)
      setFavorites(data.map((fav: any) => fav.ID_RECETTE))
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
    }
  }

  const toggleFavorite = async (recipeId: number) => {
    if (!user) return

    try {
      const isFavorite = favorites.includes(recipeId)

      if (isFavorite) {
        await recipesAPI.removeFromFavorites(recipeId)
      } else {
        await recipesAPI.addToFavorites(recipeId)
      }

      setFavorites((prev) => (isFavorite ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]))
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", i.toString())
            window.history.pushState(null, "", `?${params.toString()}`)
            fetchRecipes(Object.fromEntries(params.entries()))
          }}
          className={i === currentPage ? "btn-primary-custom" : ""}
        >
          {i}
        </Button>,
      )
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = Math.max(1, currentPage - 1)
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", newPage.toString())
            window.history.pushState(null, "", `?${params.toString()}`)
            fetchRecipes(Object.fromEntries(params.entries()))
          }}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newPage = Math.min(totalPages, currentPage + 1)
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", newPage.toString())
            window.history.pushState(null, "", `?${params.toString()}`)
            fetchRecipes(Object.fromEntries(params.entries()))
          }}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CategoryNav />

      <div className="container mx-auto px-6 py-6">
        {/* Statut de l'API */}
        <APIStatus />

        {/* Composant de publication de recette */}
        <RecipePublisher />

        {/* Onglets de navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={activeTab === "recent" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("recent")}
              className="flex items-center gap-2"
            >
              <Clock size={16} />
              Récentes
            </Button>
            <Button
              variant={activeTab === "trending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("trending")}
              className="flex items-center gap-2"
            >
              <TrendingUp size={16} />
              Populaires
            </Button>
            {user && (
              <Button
                variant={activeTab === "favorites" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("favorites")}
                className="flex items-center gap-2"
              >
                <Star size={16} />
                Mes favoris
              </Button>
            )}
          </div>

          <Button onClick={() => setShowAdvancedSearch(true)} className="btn-secondary-custom flex items-center gap-2">
            <Filter size={16} />
            Recherche Avancée
          </Button>
        </div>

        {/* Affichage des erreurs */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {/* Résultats */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Chargement des recettes...</div>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.ID_RECETTE}
                  recipe={recipe}
                  user={user}
                  isFavorite={favorites.includes(recipe.ID_RECETTE)}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "favorites" ? "Aucun favori pour le moment" : "Aucune recette trouvée"}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === "favorites"
                ? "Commencez à ajouter des recettes à vos favoris !"
                : "Essayez de modifier vos critères de recherche ou explorez nos catégories."}
            </p>
            {activeTab === "favorites" && user && (
              <Button onClick={() => setActiveTab("recent")} className="btn-primary-custom">
                Découvrir des recettes
              </Button>
            )}
          </div>
        )}
      </div>

      <AdvancedSearch isOpen={showAdvancedSearch} onClose={() => setShowAdvancedSearch(false)} />
    </div>
  )
}
