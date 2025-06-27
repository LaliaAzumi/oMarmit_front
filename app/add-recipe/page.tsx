"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import APIStatus from "@/components/api-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Clock, ChefHat, Upload } from "lucide-react"
import { useCategories } from "@/hooks/use-api"
import { recipesAPI } from "@/lib/api"

export default function AddRecipePage() {
  const router = useRouter()
  const { categories } = useCategories()

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    ingredients: "",
    instructions: "",
    id_categorie: "",
    temps_preparation: "",
    temps_cuisson: "",
    difficulte: "Facile",
    calories: "",
    proteines: "",
    glucides: "",
    lipides: "",
    regime_alimentaire: [] as string[],
    image: null as File | null,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const dietaryOptions = ["Végétarien", "Végétalien", "Sans gluten", "Sans lactose", "Paleo", "Keto"]
  const difficultyOptions = ["Facile", "Moyen", "Difficile"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation basique
      if (!formData.titre || !formData.ingredients || !formData.instructions) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      const recipeData = {
        ...formData,
        id_categorie: Number.parseInt(formData.id_categorie),
        temps_preparation: Number.parseInt(formData.temps_preparation) || 0,
        temps_cuisson: Number.parseInt(formData.temps_cuisson) || 0,
        calories: Number.parseInt(formData.calories) || 0,
        proteines: Number.parseFloat(formData.proteines) || 0,
        glucides: Number.parseFloat(formData.glucides) || 0,
        lipides: Number.parseFloat(formData.lipides) || 0,
        regime_alimentaire: formData.regime_alimentaire.join(","),
      }

      const result = await recipesAPI.createRecipe(recipeData)

      setSuccess(true)
      setTimeout(() => {
        router.push(`/recipe/${result.id}`)
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Erreur lors de la création de la recette")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDietaryRestriction = (restriction: string) => {
    setFormData((prev) => ({
      ...prev,
      regime_alimentaire: prev.regime_alimentaire.includes(restriction)
        ? prev.regime_alimentaire.filter((r) => r !== restriction)
        : [...prev.regime_alimentaire, restriction],
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  if (success) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <h2 className="text-xl font-bold mb-2">Recette créée avec succès ! 🎉</h2>
                <p>Redirection en cours...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <APIStatus />

          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Plus size={32} />
                Ajouter une Recette
              </h1>
              <p className="text-gray-600">Partagez votre recette avec la communauté</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations de base */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titre">Titre de la recette *</Label>
                      <Input
                        id="titre"
                        value={formData.titre}
                        onChange={(e) => handleInputChange("titre", e.target.value)}
                        placeholder="Ex: Tarte aux pommes de grand-mère"
                        className="form-control-custom"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Décrivez votre recette en quelques mots..."
                        className="form-control-custom"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="categorie">Catégorie</Label>
                      <Select
                        value={formData.id_categorie}
                        onValueChange={(value) => handleInputChange("id_categorie", value)}
                      >
                        <SelectTrigger className="form-control-custom">
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.ID_CATEGORIE} value={cat.ID_CATEGORIE.toString()}>
                              {cat.NOM_CATEGORIE}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="image">Image de la recette</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="form-control-custom"
                        />
                        <Upload size={20} className="text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Temps et difficulté */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock size={20} />
                      Temps et Difficulté
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="temps_preparation">Préparation (min)</Label>
                        <Input
                          id="temps_preparation"
                          type="number"
                          value={formData.temps_preparation}
                          onChange={(e) => handleInputChange("temps_preparation", e.target.value)}
                          placeholder="30"
                          className="form-control-custom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="temps_cuisson">Cuisson (min)</Label>
                        <Input
                          id="temps_cuisson"
                          type="number"
                          value={formData.temps_cuisson}
                          onChange={(e) => handleInputChange("temps_cuisson", e.target.value)}
                          placeholder="45"
                          className="form-control-custom"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="difficulte">Difficulté</Label>
                      <Select
                        value={formData.difficulte}
                        onValueChange={(value) => handleInputChange("difficulte", value)}
                      >
                        <SelectTrigger className="form-control-custom">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyOptions.map((diff) => (
                            <SelectItem key={diff} value={diff}>
                              {diff}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Régimes alimentaires */}
                    <div>
                      <Label>Régimes alimentaires</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {dietaryOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={formData.regime_alimentaire.includes(option)}
                              onCheckedChange={() => toggleDietaryRestriction(option)}
                            />
                            <Label htmlFor={option} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ingrédients */}
              <Card>
                <CardHeader>
                  <CardTitle>Ingrédients *</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange("ingredients", e.target.value)}
                    placeholder={`Listez les ingrédients, un par ligne:
200g de farine
3 œufs
250ml de lait
50g de beurre`}
                    className="form-control-custom"
                    rows={8}
                    required
                  />
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat size={20} />
                    Instructions *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => handleInputChange("instructions", e.target.value)}
                    placeholder={`Décrivez les étapes de préparation:
1. Préchauffer le four à 180°C
2. Mélanger la farine et les œufs
3. Ajouter le lait progressivement
4. Faire cuire 30 minutes`}
                    className="form-control-custom"
                    rows={10}
                    required
                  />
                </CardContent>
              </Card>

              {/* Informations nutritionnelles */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations nutritionnelles (optionnel)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={formData.calories}
                        onChange={(e) => handleInputChange("calories", e.target.value)}
                        placeholder="350"
                        className="form-control-custom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="proteines">Protéines (g)</Label>
                      <Input
                        id="proteines"
                        type="number"
                        step="0.1"
                        value={formData.proteines}
                        onChange={(e) => handleInputChange("proteines", e.target.value)}
                        placeholder="15.5"
                        className="form-control-custom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="glucides">Glucides (g)</Label>
                      <Input
                        id="glucides"
                        type="number"
                        step="0.1"
                        value={formData.glucides}
                        onChange={(e) => handleInputChange("glucides", e.target.value)}
                        placeholder="45.2"
                        className="form-control-custom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lipides">Lipides (g)</Label>
                      <Input
                        id="lipides"
                        type="number"
                        step="0.1"
                        value={formData.lipides}
                        onChange={(e) => handleInputChange("lipides", e.target.value)}
                        placeholder="12.8"
                        className="form-control-custom"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="btn-primary-custom flex-1">
                  {loading ? "Création en cours..." : "Publier la recette"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
