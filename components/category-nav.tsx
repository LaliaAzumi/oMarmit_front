"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { categoriesAPI } from "@/lib/api"

interface Category {
  ID_CATEGORIE: number
  NOM_CATEGORIE: string
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchCategories()
    setActiveCategory(searchParams.get("category") || "")
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName)
    const params = new URLSearchParams(searchParams.toString())
    if (categoryName) {
      params.set("category", categoryName)
    } else {
      params.delete("category")
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="sub-navbar">
      <div className="container mx-auto px-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryClick("")}
            className={`category-link ${activeCategory === "" ? "active" : ""}`}
          >
            Toutes
          </button>
          {categories.map((category) => (
            <button
              key={category.ID_CATEGORIE}
              onClick={() => handleCategoryClick(category.NOM_CATEGORIE)}
              className={`category-link ${activeCategory === category.NOM_CATEGORIE ? "active" : ""}`}
            >
              {category.NOM_CATEGORIE}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
