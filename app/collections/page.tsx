"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"
import APIStatus from "@/components/api-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BookOpen, Plus, Calendar, ChefHat } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { usersAPI } from "@/lib/api"

interface Collection {
  ID_COLLECTION: number
  NOM_COLLECTION: string
  DESCRIPTION: string
  DATE_CREATION: string
  nb_recettes: number
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCollection, setNewCollection] = useState({
    nom_collection: "",
    description: "",
  })

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCollections()
    }
  }, [user])

  const fetchCollections = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await usersAPI.getUserCollections(user.id)
      setCollections(data)
    } catch (error) {
      console.error("Erreur lors du chargement des collections:", error)
      setError("Erreur lors du chargement des collections")
    } finally {
      setLoading(false)
    }
  }

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !newCollection.nom_collection.trim()) return

    try {
      await usersAPI.createCollection(user.id, newCollection)
      setNewCollection({ nom_collection: "", description: "" })
      setIsCreateDialogOpen(false)
      fetchCollections()
    } catch (error) {
      console.error("Erreur lors de la création de la collection:", error)
      setError("Erreur lors de la création de la collection")
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <APIStatus />

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <BookOpen size={32} />
                Mes Collections
              </h1>
              <p className="text-gray-600">
                {collections.length} collection{collections.length !== 1 ? "s" : ""} créée
                {collections.length !== 1 ? "s" : ""}
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary-custom">
                  <Plus size={16} className="mr-2" />
                  Nouvelle Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle collection</DialogTitle>
                </DialogHeader>
                <form onSubmit={createCollection} className="space-y-4">
                  <div>
                    <Label htmlFor="nom_collection">Nom de la collection</Label>
                    <Input
                      id="nom_collection"
                      value={newCollection.nom_collection}
                      onChange={(e) => setNewCollection((prev) => ({ ...prev, nom_collection: e.target.value }))}
                      placeholder="Ex: Mes desserts préférés"
                      className="form-control-custom"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      value={newCollection.description}
                      onChange={(e) => setNewCollection((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre collection..."
                      className="form-control-custom"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="btn-primary-custom flex-1">
                      Créer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Affichage des erreurs */}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Contenu principal */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg">Chargement de vos collections...</div>
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.ID_COLLECTION} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen size={20} />
                      {collection.NOM_COLLECTION}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{collection.DESCRIPTION || "Aucune description"}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <ChefHat size={14} />
                        <span>{collection.nb_recettes} recettes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(collection.DATE_CREATION).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full btn-primary-custom">
                      <Link href={`/collections/${collection.ID_COLLECTION}`}>Voir la collection</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune collection créée</h3>
              <p className="text-gray-600 mb-4">
                Créez votre première collection pour organiser vos recettes préférées
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-primary-custom">
                <Plus size={16} className="mr-2" />
                Créer ma première collection
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
