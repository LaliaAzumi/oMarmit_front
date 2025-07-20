"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, ChefHat, Plus, X, ImageIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { recipesAPI } from "@/lib/api"

interface Ingredient {
  name: string
  quantity: string
  unit: string
}

export default function RecipePublisher() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "",
    category: "",
  })
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "" }])
  const [instructions, setInstructions] = useState<string[]>([""])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { user } = useAuth()
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    setIngredients(updated)
  }

  const addInstruction = () => {
    setInstructions([...instructions, ""])
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((inst, i) => (i === index ? value : inst))
    setInstructions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const recipeFormData = new FormData()

      // Données de base
      recipeFormData.append("title", formData.title)
      recipeFormData.append("description", formData.description)
      recipeFormData.append("prepTime", formData.prepTime)
      recipeFormData.append("cookTime", formData.cookTime)
      recipeFormData.append("servings", formData.servings)
      recipeFormData.append("difficulty", formData.difficulty)
      recipeFormData.append("category", formData.category)

      // Ingrédients et instructions
      recipeFormData.append("ingredients", JSON.stringify(ingredients.filter((ing) => ing.name.trim())))
      recipeFormData.append("instructions", JSON.stringify(instructions.filter((inst) => inst.trim())))

      // Image
      if (selectedImage) {
        recipeFormData.append("image", selectedImage)
      }

      await recipesAPI.createRecipe(recipeFormData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        prepTime: "",
        cookTime: "",
        servings: "",
        difficulty: "",
        category: "",
      })
      setIngredients([{ name: "", quantity: "", unit: "" }])
      setInstructions([""])
      setSelectedImage(null)
      setImagePreview(null)
      setIsOpen(false)

      // Refresh page or redirect
      window.location.reload()
    } catch (error) {
      console.error("Erreur lors de la création de la recette:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <ChefHat size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600">Quoi de neuf dans votre cuisine, {user.username} ?</p>
                <p className="text-sm text-gray-500">Partagez votre dernière création culinaire</p>
              </div>
              <Button className="btn-primary-custom">
                <Plus size={16} className="mr-2" />
                Publier une recette
              </Button>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ChefHat size={24} />
                Créer une nouvelle recette
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photo de la recette</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-transparent"
                        onClick={() => {
                          setSelectedImage(null)
                          setImagePreview(null)
                        }}
                      >
                        Changer l'image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-2">Ajoutez une photo appétissante de votre recette</p>
                      <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs mx-auto" />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nom de la recette *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Tarte aux pommes de grand-mère"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrees">Entrées</SelectItem>
                      <SelectItem value="plats">Plats principaux</SelectItem>
                      <SelectItem value="desserts">Desserts</SelectItem>
                      <SelectItem value="vegetarien">Végétarien</SelectItem>
                      <SelectItem value="sans-gluten">Sans gluten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre recette, son origine, ce qui la rend spéciale..."
                  rows={3}
                />
              </div>

              {/* Time and Servings */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prepTime" className="flex items-center gap-1">
                    <Clock size={16} />
                    Préparation (min)
                  </Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookTime" className="flex items-center gap-1">
                    <Clock size={16} />
                    Cuisson (min)
                  </Label>
                  <Input
                    id="cookTime"
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) => setFormData({ ...formData, cookTime: e.target.value })}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings" className="flex items-center gap-1">
                    <Users size={16} />
                    Portions
                  </Label>
                  <Input
                    id="servings"
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                    placeholder="4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facile">Facile</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="difficile">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ingrédients</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                    <Plus size={16} className="mr-1" />
                    Ajouter
                  </Button>
                </div>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Ingrédient"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, "name", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Quantité"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                      className="w-24"
                    />
                    <Input
                      placeholder="Unité"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                      className="w-20"
                    />
                    {ingredients.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeIngredient(index)}>
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Instructions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                    <Plus size={16} className="mr-1" />
                    Ajouter une étape
                  </Button>
                </div>
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Badge variant="outline" className="mt-2 min-w-[2rem] justify-center">
                      {index + 1}
                    </Badge>
                    <Textarea
                      placeholder={`Étape ${index + 1}: Décrivez cette étape en détail...`}
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    {instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="mt-2"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                  {isLoading ? "Publication..." : "Publier la recette"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
