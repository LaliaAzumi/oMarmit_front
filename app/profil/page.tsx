"use client"

import { useState, useEffect, useRef } from "react"
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
import { Camera, Shield } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      console.log("Image sélectionnée:", file.name)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
                <CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <Avatar
                        className="w-16 h-16 cursor-pointer border-4 border-white shadow-lg transition-transform hover:scale-105"
                        onClick={handleImageClick}
                      >
                        {selectedImage ? (
                          <AvatarImage src={selectedImage || "/placeholder.svg"} alt="Photo de profil" />
                        ) : (
                          <AvatarFallback className="bg-amber-800 text-white text-xl font-bold">
                            {user?.username
                              ? user.username
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        onClick={handleImageClick}
                      >
                        <Camera size={20} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Mon profil</h2>
                      <p className="text-amber-100 text-sm">Gérez vos informations personnelles</p>
                    </div>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary-custom bg-white text-amber-700 hover:bg-amber-50 border-2 border-white shadow-md transition-all duration-300"
                    >
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSave}
                        className="btn-primary-custom bg-green-600 hover:bg-green-700 text-white border-0 shadow-md transition-all duration-300"
                      >
                        <Save size={16} className="mr-2" />
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 shadow-md transition-all duration-300"
                      >
                        <X size={16} className="mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Input file caché */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Section changement d'image */}
                <div className="flex flex-col items-center space-y-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="relative group">
                    <Avatar
                      className="w-32 h-32 cursor-pointer border-4 border-amber-200 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                      onClick={handleImageClick}
                    >
                      {selectedImage ? (
                        <AvatarImage
                          src={selectedImage || "/placeholder.svg"}
                          alt="Photo de profil"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-800 text-white text-4xl font-bold">
                          {user?.username
                            ? user.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <div className="text-center">
                        <Camera size={24} className="text-white mx-auto mb-1" />
                        <p className="text-white text-xs font-medium">Changer</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleImageClick}
                    className="border-2 border-amber-400 text-amber-700 hover:bg-amber-100 bg-white shadow-md transition-all duration-300 px-6 py-2"
                  >
                    <Camera size={18} className="mr-2" />
                    Changer la photo de profil
                  </Button>
                  {selectedImage && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Nouvelle image sélectionnée
                    </div>
                  )}
                </div>

                {/* Informations de base */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-amber-800 border-b-2 border-amber-200 pb-2">
                    Informations personnelles
                  </h3>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-amber-800 font-medium text-sm">
                        Nom d'utilisateur
                      </Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                          className="form-control-custom border-2 border-amber-200 focus:border-amber-400 rounded-lg p-3 transition-all duration-300"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <User size={18} className="text-amber-600" />
                          <span className="font-medium text-gray-800">{user?.username}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-800 font-medium text-sm">
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          className="form-control-custom border-2 border-amber-200 focus:border-amber-400 rounded-lg p-3 transition-all duration-300"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Mail size={18} className="text-amber-600" />
                          <span className="font-medium text-gray-800">{user?.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-amber-800 font-medium text-sm">
                        Bio
                      </Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                          className="form-control-custom border-2 border-amber-200 focus:border-amber-400 rounded-lg p-3 transition-all duration-300 min-h-[100px]"
                          rows={4}
                          placeholder="Parlez-nous de vous et de votre passion pour la cuisine..."
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-800 leading-relaxed">{user?.bio || "Aucune bio renseignée"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-amber-300 to-transparent h-px" />

                {/* Régimes alimentaires */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-800 border-b-2 border-amber-200 pb-2">
                    Préférences alimentaires
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {user?.regime_alimentaire && user.regime_alimentaire.length > 0 ? (
                      user.regime_alimentaire.map((regime, index) => (
                        <Badge
                          key={index}
                          className="nutrition-badge px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          {regime}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm italic bg-gray-50 px-4 py-2 rounded-full">
                        Aucun régime spécifique
                      </span>
                    )}
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-amber-300 to-transparent h-px" />

                {/* Informations du compte */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-800 border-b-2 border-amber-200 pb-2">
                    Informations du compte
                  </h3>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={18} className="text-amber-600" />
                      <span className="text-gray-700 font-medium">
                        Membre depuis le {new Date().toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {user?.is_admin && (
                      <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300 px-4 py-2 rounded-full shadow-sm">
                        🛡️ Administrateur
                      </Badge>
                    )}
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
