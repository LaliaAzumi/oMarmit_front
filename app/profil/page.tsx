"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Edit, Save, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    regime_alimentaire: [] as string[],
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        regime_alimentaire: user.regime_alimentaire || [],
      })
    }
  }, [user])

  const handleSave = async () => {
    // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
    console.log("Sauvegarde des modifications:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        regime_alimentaire: user.regime_alimentaire || [],
      })
    }
    setIsEditing(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User size={24} />
                  Mon Profil
                </CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="btn-primary-custom">
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="btn-primary-custom">
                      <Save size={16} className="mr-2" />
                      Sauvegarder
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X size={16} className="mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                        className="form-control-custom"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <User size={16} className="text-gray-500" />
                        <span>{user?.username}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="form-control-custom"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={16} className="text-gray-500" />
                        <span>{user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                        className="form-control-custom"
                        rows={3}
                        placeholder="Parlez-nous de vous et de votre passion pour la cuisine..."
                      />
                    ) : (
                      <p className="mt-1 text-gray-700">{user?.bio || "Aucune bio renseignée"}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Régimes alimentaires */}
                <div>
                  <Label>Régimes alimentaires</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.regime_alimentaire && user.regime_alimentaire.length > 0 ? (
                      user.regime_alimentaire.map((regime, index) => (
                        <Badge key={index} variant="secondary" className="nutrition-badge">
                          {regime}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Aucun régime spécifique</span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Informations du compte */}
                <div className="space-y-2">
                  <h3 className="font-medium">Informations du compte</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>Membre depuis le {new Date().toLocaleDateString("fr-FR")}</span>
                    </div>
                    {user?.is_admin && <Badge className="bg-red-100 text-red-800">Administrateur</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
