"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Star } from "lucide-react"

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

interface RecipeCardProps {
  recipe: Recipe
  isFavorite?: boolean
  onToggleFavorite?: (recipeId: number) => void
  user?: any
}

export default function RecipeCard({ recipe, isFavorite = false, onToggleFavorite, user }: RecipeCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFavoriteToggle = async () => {
    if (!user || !onToggleFavorite) return

    setIsLoading(true)
    try {
      await onToggleFavorite(recipe.ID_RECETTE)
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalTime = (recipe.temps_preparation || 0) + (recipe.temps_cuisson || 0)
  const regimes = recipe.regime_alimentaire ? recipe.regime_alimentaire.split(",") : []

  return (
    <Card className="recipe-card group">
      <div className="relative">
        <div
          className="recipe-card-img"
          style={{
            backgroundImage: recipe.IMAGE
              ? `url(/images/${recipe.IMAGE})`
              : `url(/placeholder.svg?height=150&width=250)`,
          }}
        />
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite ? "text-red-500" : "text-gray-400"
            } hover:text-red-500 bg-white/80 hover:bg-white`}
            onClick={handleFavoriteToggle}
            disabled={isLoading}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{recipe.TITRE}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.DESCRIPTION}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{totalTime} min</span>
            </div>
          )}

          {recipe.note_moyenne && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span>{recipe.note_moyenne.toFixed(1)}</span>
              {recipe.nombre_notes && <span className="text-xs">({recipe.nombre_notes})</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="secondary" className="text-xs">
            {recipe.difficulte}
          </Badge>
          {recipe.calories && (
            <Badge variant="outline" className="text-xs">
              {recipe.calories} cal
            </Badge>
          )}
          {regimes.slice(0, 2).map((regime, index) => (
            <Badge key={index} variant="outline" className="text-xs nutrition-badge">
              {regime.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full btn-primary-custom">
          <Link href={`/recipe/${recipe.ID_RECETTE}`}>Voir la recette</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
