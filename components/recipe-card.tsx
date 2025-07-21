"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Clock, Star, ChefHat } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Recipe {
  ID_RECETTE: number
  TITRE: string
  DESCRIPTION: string
  IMAGE?: string
  temps_preparation?: number
  temps_cuisson?: number
  note_moyenne?: number
  nombre_notes?: number
  difficulte: "Facile" | "Moyen" | "Difficile"
  calories?: number
  regime_alimentaire: string
}

interface User {
  id: string
  // Add other user properties if needed, e.g., name, email
}

interface RecipeCardProps {
  recipe: Recipe
  user?: any
  isFavorite?: boolean
  onFavoriteToggle?: (recipeId: number) => Promise<void>
  
}

const difficultyColors = {
  "Facile": "bg-lime-500 text-white",
  "Moyen": "bg-yellow-500 text-white",
  "Difficile": "bg-orange-500 text-white",
}

export default function RecipeCard({ recipe, user, isFavorite = false, onFavoriteToggle }: RecipeCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFavoriteToggle = async () => {
    if (!user || !onFavoriteToggle) return

    setIsLoading(true)
    try {
      await onFavoriteToggle(recipe.ID_RECETTE)
    } catch (error) {
      console.error("Failed to toggle favorite status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalTime = (recipe.temps_preparation || 0) + (recipe.temps_cuisson || 0)
  const regimes = recipe.regime_alimentaire ? recipe.regime_alimentaire.split(","): []

  return (
    <Card className="group flex flex-col h-full max-w-sm rounded-xl overflow-hidden border border-gray-200 shadow-xl bg-white transition-all duration-300 hover:shadow-2xl hover:border-yellow-400 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <Image
          src={recipe.IMAGE ? `/images/${recipe.IMAGE}` : `/placeholder.svg?height=200&width=350&text=Recipe Image`}
          alt={recipe.TITRE || "Recipe image"}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 group-hover:scale-110 group-hover:brightness-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isFavorite ? "text-red-500" : "text-gray-300"
            } hover:text-red-500 bg-white/90 hover:bg-white shadow-lg transition-colors duration-200 z-10`}
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-xl md:text-2xl mb-2 text-gray-900 line-clamp-2 leading-tight">
            {recipe.TITRE}
          </h3>
          <p className="text-gray-700 text-sm line-clamp-3 mb-4">{recipe.DESCRIPTION}</p>
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 border-t border-b border-gray-100 py-2">
            {totalTime > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-gray-500" />
                <span className="font-semibold">{totalTime} min</span>
              </div>
            )}
            {recipe.note_moyenne && (
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                <span className="font-semibold">{recipe.note_moyenne.toFixed(1)}</span>
                {recipe.nombre_notes && <span className="text-xs text-gray-500">({recipe.nombre_notes})</span>}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Badges and Button */}
        <CardFooter className="p-0 flex flex-col gap-3 mt-auto">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge
              className={`capitalize px-3 py-1 rounded-full font-bold ${
                difficultyColors[recipe.difficulte] || "bg-gray-100 text-gray-700"
              }`}
            >
              <ChefHat size={12} className="mr-1" />
              {recipe.difficulte}
            </Badge>
            {recipe.calories && (
              <Badge
                variant="outline"
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-semibold"
              >
                {recipe.calories} cal
              </Badge>
            )}
            {regimes.slice(0, 2).map((regime, index) => (
              <Badge
                key={index}
                variant="outline"
                className="capitalize px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-semibold"
              >
                {regime.trim()}
              </Badge>
            ))}
          </div>
          <Button
            asChild
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            <Link href={`/recipe/${recipe.ID_RECETTE}`}>Voir la recette</Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
