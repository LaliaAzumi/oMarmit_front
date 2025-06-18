"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import CategoryNav from "@/components/category-nav"
import RecipeCard from "@/components/recipe-card"
import AdvancedSearch from "@/components/advanced-search"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"
import { recipesAPI } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

interface Recipe {
  ID_RECETTE: number
  TITRE: string
  DESCRIPTION: string
  IMAGE: string
  temps_preparation: number
  temps_cuisson: number
  difficulte: string
  regime_alimentaire: string
  note_moyenne?: number
  nombre_notes?: number
  calories?: number
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  const searchParams = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    fetchRecipes()
  }, [searchParams, currentPage])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      const data = await recipesAPI.getUserFavorites(user.id)
      setFavorites(data.map((fav: any) => fav.ID_RECETTE))
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
    }
  }

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(searchParams.entries())
      params.page = currentPage.toString()

      const data = await recipesAPI.getRecipes(params)
      setRecipes(data.recipes || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Erreur lors du chargement des recettes:", error)
      setRecipes([])
    } finally {
      setLoading(false)
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
          onClick={() => setCurrentPage(i)}
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
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <CategoryNav />

      <div className="container mx-auto px-4 py-6">
        {/* Barre de recherche avancée */}
        <div className="flex justify-center mb-6">
          <Button onClick={() => setShowAdvancedSearch(true)} className="btn-secondary-custom flex items-center gap-2">
            <Filter size={16} />
            Recherche Avancée
          </Button>
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Chargement des recettes...</div>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.ID_RECETTE}
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.ID_RECETTE)}
                  onToggleFavorite={toggleFavorite}
                  user={user}
                />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune recette trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche ou explorez nos catégories.</p>
          </div>
        )}
      </div>

      <AdvancedSearch isOpen={showAdvancedSearch} onClose={() => setShowAdvancedSearch(false)} />
    </div>
  )
}
