"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import RatingSystem from "@/components/rating-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, Clock, Users, ChefHat, Utensils, Plus, Minus } from "lucide-react"
import { recipesAPI, nutritionAPI } from "@/lib/api"

interface Recipe {
  ID_RECETTE: number
  TITRE: string
  DESCRIPTION: string
  INGREDIENTS: string
  INSTRUCTIONS: string
  IMAGE: string
  temps_preparation: number
  temps_cuisson: number
  difficulte: string
  regime_alimentaire: string
  calories: number
  proteines: number
  glucides: number
  lipides: number
  USERNAME: string
  note_moyenne: number
  nombre_notes: number
}

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [user, setUser] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [portions, setPortions] = useState(4)
  const [loading, setLoading] = useState(true)
  const [nutritionInfo, setNutritionInfo] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      fetchRecipe()
      fetchUser()
    }
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        checkFavoriteStatus(userData.id)
      }
    } catch (error) {
      console.log("Utilisateur non connecté")
    }
  }

  const fetchRecipe = async () => {
    try {
      const data = await recipesAPI.getRecipe(Number(params.id))
      setRecipe(data)
      generateNutritionInfo(data)
    } catch (error) {
      console.error("Erreur lors du chargement de la recette:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = async (userId: number) => {
    try {
      const data = await recipesAPI.getFavoriteStatus(Number(params.id))
      setIsFavorite(data.isFavorite)
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error)
    }
  }

  const generateNutritionInfo = async (recipeData: Recipe) => {
    try {
      const nutritionData = await nutritionAPI.analyzeIngredients(recipeData.INGREDIENTS, portions)
      setNutritionInfo(nutritionData)
    } catch (error) {
      console.error("Erreur lors de l'analyse nutritionnelle:", error)
    }
  }

  const toggleFavorite = async () => {
    if (!user) return

    try {
      if (isFavorite) {
        await recipesAPI.removeFromFavorites(Number(params.id))
      } else {
        await recipesAPI.addToFavorites(Number(params.id))
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error)
    }
  }

  const adjustPortions = (newPortions: number) => {
    if (newPortions < 1) return
    setPortions(newPortions)
    if (recipe) {
      generateNutritionInfo(recipe)
    }
  }

  const parseIngredients = (ingredientsText: string) => {
    return ingredientsText.split("\n").filter((line) => line.trim())
  }

  const parseInstructions = (instructionsText: string) => {
    return instructionsText.split("\n").filter((line) => line.trim())
  }

  const adjustIngredientQuantity = (ingredient: string, ratio: number) => {
    // Logique pour ajuster les quantités selon le nombre de portions
    const quantityRegex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]*)/
    const match = ingredient.match(quantityRegex)

    if (match) {
      const quantity = Number.parseFloat(match[1])
      const unit = match[2]
      const adjustedQuantity = (quantity * ratio).toFixed(1)
      return ingredient.replace(quantityRegex, `${adjustedQuantity} ${unit}`)
    }

    return ingredient
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Chargement de la recette...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Recette non trouvée</h2>
            <p className="text-gray-600">Cette recette n'existe pas ou a été supprimée.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalTime = (recipe.temps_preparation || 0) + (recipe.temps_cuisson || 0)
  const regimes = recipe.regime_alimentaire ? recipe.regime_alimentaire.split(",") : []
  const portionRatio = portions / 4 // Supposons que la recette de base est pour 4 personnes

  return (
    <div className="min-h-screen">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête de la recette */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.TITRE}</h1>
                    <p className="text-gray-600 mb-4">{recipe.DESCRIPTION}</p>
                    <p className="text-sm text-gray-500">
                      Par <span className="font-medium">{recipe.USERNAME}</span>
                    </p>
                  </div>

                  {user && (
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={toggleFavorite}
                      className={`${isFavorite ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                    >
                      <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </Button>
                  )}
                </div>

                {/* Image de la recette */}
                <div
                  className="w-full h-64 bg-gray-200 rounded-lg mb-4 bg-cover bg-center"
                  style={{
                    backgroundImage: recipe.IMAGE
                      ? `url(/images/${recipe.IMAGE})`
                      : `url(/placeholder.svg?height=256&width=512)`,
                  }}
                />

                {/* Informations rapides */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {recipe.temps_preparation > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Préparation: {recipe.temps_preparation} min</span>
                    </div>
                  )}
                  {recipe.temps_cuisson > 0 && (
                    <div className="flex items-center gap-1">
                      <Utensils size={16} />
                      <span>Cuisson: {recipe.temps_cuisson} min</span>
                    </div>
                  )}
                  {totalTime > 0 && (
                    <div className="flex items-center gap-1">
                      <ChefHat size={16} />
                      <span>Total: {totalTime} min</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">{recipe.difficulte}</Badge>
                  {recipe.calories && <Badge variant="outline">{recipe.calories} cal</Badge>}
                  {regimes.map((regime, index) => (
                    <Badge key={index} variant="outline" className="nutrition-badge">
                      {regime.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ajustement des portions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Portions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustPortions(portions - 1)}
                    disabled={portions <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="text-xl font-semibold">{portions} personnes</span>
                  <Button variant="outline" size="sm" onClick={() => adjustPortions(portions + 1)}>
                    <Plus size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ingrédients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingrédients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {parseIngredients(recipe.INGREDIENTS).map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{adjustIngredientQuantity(ingredient, portionRatio)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {parseInstructions(recipe.INSTRUCTIONS).map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <p className="pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations nutritionnelles */}
            {(recipe.calories || nutritionInfo) && (
              <Card>
                <CardHeader>
                  <CardTitle>Valeurs nutritionnelles</CardTitle>
                  <p className="text-sm text-gray-600">Par portion</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recipe.calories && (
                      <div className="flex justify-between">
                        <span>Calories</span>
                        <span className="font-semibold">{Math.round((recipe.calories / 4) * portions)} kcal</span>
                      </div>
                    )}
                    {recipe.proteines && (
                      <div className="flex justify-between">
                        <span>Protéines</span>
                        <span className="font-semibold">{((recipe.proteines / 4) * portions).toFixed(1)} g</span>
                      </div>
                    )}
                    {recipe.glucides && (
                      <div className="flex justify-between">
                        <span>Glucides</span>
                        <span className="font-semibold">{((recipe.glucides / 4) * portions).toFixed(1)} g</span>
                      </div>
                    )}
                    {recipe.lipides && (
                      <div className="flex justify-between">
                        <span>Lipides</span>
                        <span className="font-semibold">{((recipe.lipides / 4) * portions).toFixed(1)} g</span>
                      </div>
                    )}

                    {nutritionInfo && (
                      <>
                        <Separator />
                        <div className="text-xs text-gray-500">Analyse générée par IA</div>
                        {nutritionInfo.vitamins && (
                          <div className="space-y-1">
                            <h4 className="font-medium text-sm">Vitamines principales</h4>
                            {nutritionInfo.vitamins.map((vitamin: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{vitamin.name}</span>
                                <span>{vitamin.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions de recettes similaires */}
            <Card>
              <CardHeader>
                <CardTitle>Recettes similaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-sm">Spaghetti Bolognaise</h4>
                    <p className="text-xs text-gray-600">Plat principal • 30 min</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-sm">Pâtes à la Carbonara</h4>
                    <p className="text-xs text-gray-600">Plat principal • 20 min</p>
                  </div>
                  <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium text-sm">Risotto aux champignons</h4>
                    <p className="text-xs text-gray-600">Plat principal • 35 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Système de notation et commentaires */}
        <div className="mt-12">
          <RatingSystem
            recipeId={recipe.ID_RECETTE}
            user={user}
            averageRating={recipe.note_moyenne}
            totalRatings={recipe.nombre_notes}
          />
        </div>
      </div>
    </div>
  )
}
