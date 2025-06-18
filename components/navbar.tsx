"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, User, Heart, BookOpen, Plus, Home, Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <nav className="navbar-custom text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors">
            Ô'Marmit
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-yellow-300 transition-colors flex items-center gap-2">
              <Home size={18} />
              Accueil
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-white hover:text-yellow-300 transition-colors flex items-center gap-2">
                <BookOpen size={18} />
                Menu
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                <DropdownMenuItem>
                  <Link href="/recipes" className="flex items-center gap-2">
                    <BookOpen size={16} />
                    Voir les recettes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/add-recipe" className="flex items-center gap-2">
                    <Plus size={16} />
                    Ajouter une recette
                  </Link>
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem>
                    <Link href="/favorites" className="flex items-center gap-2">
                      <Heart size={16} />
                      Mes favoris
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Rechercher une recette..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-custom w-64"
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1 btn-primary-custom">
                  <Search size={16} />
                </Button>
              </div>
            </form>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white hover:text-yellow-300 transition-colors flex items-center gap-2">
                  <User size={18} />
                  {user.username}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/collections">Mes collections</Link>
                  </DropdownMenuItem>
                  {user.is_admin && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Shield size={16} />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>Se déconnecter</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button asChild className="btn-secondary-custom">
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild className="btn-primary-custom">
                  <Link href="/register">Inscription</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile search */}
      <div className="md:hidden bg-white p-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Input
              type="search"
              placeholder="Rechercher une recette..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-custom w-full"
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1 btn-primary-custom">
              <Search size={16} />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
