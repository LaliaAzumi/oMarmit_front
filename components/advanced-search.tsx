"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Search, Filter } from "lucide-react"

// Remplacer fetch par axios
// 1. Importer les APIs :
import { ingredientsAPI, categoriesAPI } from "@/lib/api"

interface SearchFilters {
  query: string
  category: string
  ingredients: string[]
  maxPrepTime: number
  difficulty: string
  dietaryRestrictions: string[]
  minRating: number
  maxCalories: number
}

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdvancedSearch({ isOpen, onClose }: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    ingredients: [],
    maxPrepTime: 120,
    difficulty: "",
    dietaryRestrictions: [],
    minRating: 0,
    maxCalories: 1000,
  })

  const [availableIngredients, setAvailableIngredients] = useState<string[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const dietaryOptions = ["Végétarien", "Végétalien", "Sans gluten", "Sans lactose", "Paleo", "Keto"]

  const difficultyOptions = ["Facile", "Moyen", "Difficile"]

  useEffect(() => {
    if (isOpen) {
      fetchIngredients()
      fetchCategories()
      loadFiltersFromURL()
    }
  }, [isOpen, searchParams])

  // 2. Remplacer fetchIngredients :
  const fetchIngredients = async () => {
    try {
      const data = await ingredientsAPI.getIngredients()
      setAvailableIngredients(data.map((ing: any) => ing.NOM_INGREDIENT))
    } catch (error) {
      console.error("Erreur lors du chargement des ingrédients:", error)
    }
  }

  // 3. Remplacer fetchCategories :
  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    }
  }

  const loadFiltersFromURL = () => {
    setFilters({
      query: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      ingredients: searchParams.get("ingredients")?.split(",").filter(Boolean) || [],
      maxPrepTime: Number.parseInt(searchParams.get("maxPrepTime") || "120"),
      difficulty: searchParams.get("difficulty") || "",
      dietaryRestrictions: searchParams.get("diet")?.split(",").filter(Boolean) || [],
      minRating: Number.parseFloat(searchParams.get("minRating") || "0"),
      maxCalories: Number.parseInt(searchParams.get("maxCalories") || "1000"),
    })
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (filters.query) params.set("q", filters.query)
    if (filters.category) params.set("category", filters.category)
    if (filters.ingredients.length > 0) params.set("ingredients", filters.ingredients.join(","))
    if (filters.maxPrepTime !== 120) params.set("maxPrepTime", filters.maxPrepTime.toString())
    if (filters.difficulty) params.set("difficulty", filters.difficulty)
    if (filters.dietaryRestrictions.length > 0) params.set("diet", filters.dietaryRestrictions.join(","))
    if (filters.minRating > 0) params.set("minRating", filters.minRating.toString())
    if (filters.maxCalories !== 1000) params.set("maxCalories", filters.maxCalories.toString())

    router.push(`/search?${params.toString()}`)
    onClose()
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      ingredients: [],
      maxPrepTime: 120,
      difficulty: "",
      dietaryRestrictions: [],
      minRating: 0,
      maxCalories: 1000,
    })
  }

  const addIngredient = (ingredient: string) => {
    if (!filters.ingredients.includes(ingredient)) {
      setFilters((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }))
    }
  }

  const removeIngredient = (ingredient: string) => {
    setFilters((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing !== ingredient),
    }))
  }

  const toggleDietaryRestriction = (restriction: string) => {
    setFilters((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter((r) => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Recherche Avancée
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recherche textuelle */}
          <div>
            <Label htmlFor="query">Rechercher</Label>
            <Input
              id="query"
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Nom de la recette, ingrédient..."
              className="form-control-custom"
            />
          </div>

          {/* Catégorie */}
          <div>
            <Label>Catégorie</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="form-control-custom">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.ID_CATEGORIE} value={cat.NOM_CATEGORIE}>
                    {cat.NOM_CATEGORIE}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ingrédients */}
          <div>
            <Label>Ingrédients</Label>
            <Select onValueChange={addIngredient}>
              <SelectTrigger className="form-control-custom">
                <SelectValue placeholder="Ajouter un ingrédient" />
              </SelectTrigger>
              <SelectContent>
                {availableIngredients
                  .filter((ing) => !filters.ingredients.includes(ing))
                  .map((ingredient) => (
                    <SelectItem key={ingredient} value={ingredient}>
                      {ingredient}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                  {ingredient}
                  <X size={12} className="cursor-pointer" onClick={() => removeIngredient(ingredient)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temps de préparation */}
            <div>
              <Label>Temps de préparation max: {filters.maxPrepTime} min</Label>
              <Slider
                value={[filters.maxPrepTime]}
                onValueChange={([value]) => setFilters((prev) => ({ ...prev, maxPrepTime: value }))}
                max={240}
                min={5}
                step={5}
                className="mt-2"
              />
            </div>

            {/* Calories max */}
            <div>
              <Label>Calories max: {filters.maxCalories}</Label>
              <Slider
                value={[filters.maxCalories]}
                onValueChange={([value]) => setFilters((prev) => ({ ...prev, maxCalories: value }))}
                max={2000}
                min={100}
                step={50}
                className="mt-2"
              />
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <Label>Difficulté</Label>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger className="form-control-custom">
                <SelectValue placeholder="Toutes les difficultés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les difficultés</SelectItem>
                {difficultyOptions.map((diff) => (
                  <SelectItem key={diff} value={diff}>
                    {diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note minimum */}
          <div>
            <Label>Note minimum: {filters.minRating} étoiles</Label>
            <Slider
              value={[filters.minRating]}
              onValueChange={([value]) => setFilters((prev) => ({ ...prev, minRating: value }))}
              max={5}
              min={0}
              step={0.5}
              className="mt-2"
            />
          </div>

          {/* Régimes alimentaires */}
          <div>
            <Label>Régimes alimentaires</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={filters.dietaryRestrictions.includes(option)}
                    onCheckedChange={() => toggleDietaryRestriction(option)}
                  />
                  <Label htmlFor={option} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSearch} className="btn-primary-custom flex-1">
              <Search size={16} className="mr-2" />
              Rechercher
            </Button>
            <Button onClick={clearFilters} variant="outline" className="flex-1">
              Effacer les filtres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
