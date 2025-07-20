"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, Heart, BookOpen, Home, Shield, LogOut, ChefHat, Settings } from "lucide-react"
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
      <nav className="navbar-custom text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors flex items-center gap-2"
          >
            <ChefHat size={24} />
            Ô'Marmit
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-yellow-300 transition-colors flex items-center gap-2">
              <Home size={18} />
              Accueil
            </Link>
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
                <DropdownMenuContent className="bg-white w-48">
                  <DropdownMenuItem>
                    <Link href="/profil" className="flex items-center gap-2 w-full">
                      <User size={16} />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-recipes" className="flex items-center gap-2 w-full">
                      <ChefHat size={16} />
                      Mes recettes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/favorites" className="flex items-center gap-2 w-full">
                      <Heart size={16} />
                      Favoris
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/collections" className="flex items-center gap-2 w-full">
                      <BookOpen size={16} />
                      Collections
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex items-center gap-2 w-full">
                      <Settings size={16} />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  {user.is_admin && (
                    <DropdownMenuItem>
                      <Link href="/admin" className="flex items-center gap-2 w-full">
                        <Shield size={16} />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 cursor-pointer">
                    <LogOut size={16} className="mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
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
