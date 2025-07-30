"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Import Image for better image handling
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import Tabs components
import { Clock, Users, ChefHat, Plus, X, ImageIcon, Loader2, Info, ListOrdered, Utensils } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { recipesAPI } from "@/lib/api/recipes"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Ingredient {
  name: string
  quantity?: string
  unit: string
}

export default function RecipePublisher() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("general") // State to manage active tab

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prepTime: 0,
    cookTime: 0,
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
  const { toast } = useToast()

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.title.trim()) errors.title = "Le titre est requis."
    if (!formData.category) errors.category = "La catégorie est requise."
    if (formData.prepTime && (isNaN(Number(formData.prepTime)) || Number(formData.prepTime) < 0))
      errors.prepTime = "Doit être un nombre positif."
    if (formData.cookTime && (isNaN(Number(formData.cookTime)) || Number(formData.cookTime) < 0))
      errors.cookTime = "Doit être un nombre positif."
    if (formData.servings && (isNaN(Number(formData.servings)) || Number(formData.servings) <= 0))
      errors.servings = "Doit être un nombre positif."

    const hasValidIngredient = ingredients.some((ing) => ing.name.trim() !== "")
    if (ingredients.length === 0 || !hasValidIngredient) {
      errors.ingredients = "Au moins un ingrédient est requis."
    }

    const hasValidInstruction = instructions.some((inst) => inst.trim() !== "")
    if (instructions.length === 0 || !hasValidInstruction) {
      errors.instructions = "Au moins une instruction est requise."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage(null)
      setImagePreview(null)
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      prepTime: 0,
      cookTime: 0,
      servings: "",
      difficulty: "",
      category: "",
    })
    setIngredients([{ name: "", quantity: "", unit: "" }])
    setInstructions([""])
    setSelectedImage(null)
    setImagePreview(null)
    setFormErrors({})
    setSubmissionError(null)
    setActiveTab("general") // Reset to first tab
  }

  const handleSubmit = async () => {
    try {
      const response = await recipesAPI.createRecipe({
        titre: formData.title,
        description: formData.description,
        temps_preparation: formData.prepTime,
        temps_cuisson: formData.cookTime,
        // servings: formData.servings,
        difficulte: formData.difficulty,
        categorie: formData.category,
        image: selectedImage, // <-- c'est un File ou null
        ingredients: ingredients.filter((ingredient) => ingredient.name.trim() !== ""),
        instructions: instructions.filter((instruction) => instruction.trim() !== "")
      });

      console.log("Recette créée avec succès :", response);
    } catch (error) {
      console.error("Erreur lors de la création de la recette :", error);
    }
  };


  if (!user) return null

  return (
    <Card className="mb-6 border-none shadow-none">
      <CardContent className="p-0">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 border border-gray-100 group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200">
                <ChefHat size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-bold text-lg">Quoi de neuf dans votre cuisine, {user.username} ?</p>
                <p className="text-sm text-gray-500">Partagez votre dernière création culinaire avec la communauté !</p>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition-all duration-200 flex items-center gap-2 transform group-hover:scale-105">
                <Plus size={20} />
                Publier
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-8 bg-white rounded-xl shadow-2xl">
            <DialogHeader className="pb-6 border-b border-gray-200 mb-6">
              <DialogTitle className="flex items-center gap-4 text-3xl font-extrabold text-gray-900">
                <ChefHat size={32} className="text-orange-500" />
                Créer une nouvelle recette
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100 rounded-lg shadow-inner">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2 py-2 px-4 text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:rounded-md transition-all duration-200"
                  >
                    <Info size={18} /> Informations Générales
                  </TabsTrigger>
                  <TabsTrigger
                    value="ingredients"
                    className="flex items-center gap-2 py-2 px-4 text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:rounded-md transition-all duration-200"
                  >
                    <Utensils size={18} /> Ingrédients
                  </TabsTrigger>
                  <TabsTrigger
                    value="instructions"
                    className="flex items-center gap-2 py-2 px-4 text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md data-[state=active]:rounded-md transition-all duration-200"
                  >
                    <ListOrdered size={18} /> Instructions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6 space-y-8">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label className="text-xl font-bold text-gray-800">Photo de la recette</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative group cursor-pointer">
                      {imagePreview ? (
                        <div className="relative w-full h-64 mx-auto rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedImage(null)
                              setImagePreview(null)
                            }}
                            aria-label="Supprimer l'image"
                          >
                            <X size={20} />
                          </Button>
                        </div>
                      ) : (
                        <Label htmlFor="image-upload" className="cursor-pointer block">
                          <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-700 text-lg font-medium mb-3">
                            Glissez-déposez une image ici, ou cliquez pour sélectionner
                          </p>
                          <p className="text-sm text-gray-500">Formats supportés : JPG, PNG, GIF (Max 5MB)</p>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </Label>
                      )}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <Label className="text-xl font-bold text-gray-800">Informations de base</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">
                          Nom de la recette <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value })
                            setFormErrors((prev) => ({ ...prev, title: "" }))
                          }}
                          placeholder="Ex: Tarte aux pommes de grand-mère"
                          required
                          className={cn(formErrors.title && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Catégorie <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => {
                            setFormData({ ...formData, category: value })
                            setFormErrors((prev) => ({ ...prev, category: "" }))
                          }}
                        >
                          <SelectTrigger
                            className={cn(formErrors.category && "border-red-500 focus-visible:ring-red-500")}
                          >
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
                        {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez votre recette, son origine, ce qui la rend spéciale..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Time and Servings */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <Label className="text-xl font-bold text-gray-800">Durée et Portions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="prepTime" className="flex items-center gap-1">
                          <Clock size={18} className="text-gray-600" />
                          Préparation (min)
                        </Label>
                        <Input
                          id="prepTime"
                          type="number"
                          value={formData.prepTime}
                          onChange={(e) => {
                            setFormData({ ...formData, prepTime: e.target.value })
                            setFormErrors((prev) => ({ ...prev, prepTime: "" }))
                          }}
                          placeholder="30"
                          className={cn(formErrors.prepTime && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {formErrors.prepTime && <p className="text-red-500 text-sm mt-1">{formErrors.prepTime}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cookTime" className="flex items-center gap-1">
                          <Clock size={18} className="text-gray-600" />
                          Cuisson (min)
                        </Label>
                        <Input
                          id="cookTime"
                          type="number"
                          value={formData.cookTime}
                          onChange={(e) => {
                            setFormData({ ...formData, cookTime: e.target.value })
                            setFormErrors((prev) => ({ ...prev, cookTime: "" }))
                          }}
                          placeholder="45"
                          className={cn(formErrors.cookTime && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {formErrors.cookTime && <p className="text-red-500 text-sm mt-1">{formErrors.cookTime}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="servings" className="flex items-center gap-1">
                          <Users size={18} className="text-gray-600" />
                          Portions
                        </Label>
                        <Input
                          id="servings"
                          type="number"
                          value={formData.servings}
                          onChange={(e) => {
                            setFormData({ ...formData, servings: e.target.value })
                            setFormErrors((prev) => ({ ...prev, servings: "" }))
                          }}
                          placeholder="4"
                          className={cn(formErrors.servings && "border-red-500 focus-visible:ring-red-500")}
                        />
                        {formErrors.servings && <p className="text-red-500 text-sm mt-1">{formErrors.servings}</p>}
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
                  </div>
                </TabsContent>

                <TabsContent value="ingredients" className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xl font-bold text-gray-800">
                      Ingrédients <span className="text-red-500">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addIngredient}
                      className="flex items-center gap-1 text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-colors bg-transparent"
                    >
                      <Plus size={18} />
                      Ajouter
                    </Button>
                  </div>
                  {formErrors.ingredients && <p className="text-red-500 text-sm mt-1">{formErrors.ingredients}</p>}
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <Input
                        placeholder="Nom de l'ingrédient (ex: Farine)"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(index, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Quantité (ex: 250)"
                        value={ingredient.quantity}
                        onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                        className="w-full sm:w-28"
                      />
                      <Input
                        placeholder="Unité (ex: g)"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                        className="w-full sm:w-20"
                      />
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                          className="flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Supprimer l'ingrédient"
                        >
                          <X size={20} />
                        </Button>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="instructions" className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-xl font-bold text-gray-800">
                      Instructions <span className="text-red-500">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addInstruction}
                      className="flex items-center gap-1 text-orange-600 border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-colors bg-transparent"
                    >
                      <Plus size={18} />
                      Ajouter une étape
                    </Button>
                  </div>
                  {formErrors.instructions && <p className="text-red-500 text-sm mt-1">{formErrors.instructions}</p>}
                  {instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <Badge
                        variant="secondary"
                        className="mt-1.5 min-w-[2.5rem] h-9 flex items-center justify-center text-lg font-bold bg-orange-100 text-orange-700 flex-shrink-0"
                      >
                        {index + 1}
                      </Badge>
                      <Textarea
                        placeholder={`Étape ${index + 1}: Décrivez cette étape en détail...`}
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        className="flex-1"
                        rows={4}
                      />
                      {instructions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInstruction(index)}
                          className="mt-1.5 flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Supprimer l'instruction"
                        >
                          <X size={20} />
                        </Button>
                      )}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Submission Error Display */}
              {submissionError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  {submissionError}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    "Publier la recette"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}


