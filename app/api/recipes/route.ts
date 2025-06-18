import { type NextRequest, NextResponse } from "next/server"

// Simulation de données - remplacez par votre vraie base de données
const mockRecipes = [
  {
    ID_RECETTE: 1,
    TITRE: "Spaghetti Carbonara",
    DESCRIPTION: "Un classique italien avec des œufs, du parmesan et des lardons",
    IMAGE: "carbonara.jpg",
    temps_preparation: 15,
    temps_cuisson: 20,
    difficulte: "Facile",
    regime_alimentaire: "",
    note_moyenne: 4.5,
    nombre_notes: 23,
    calories: 450,
    ID_CATEGORIE: 1,
  },
  {
    ID_RECETTE: 2,
    TITRE: "Salade César",
    DESCRIPTION: "Salade fraîche avec croûtons, parmesan et sauce césar",
    IMAGE: "cesar.jpg",
    temps_preparation: 10,
    temps_cuisson: 0,
    difficulte: "Facile",
    regime_alimentaire: "Végétarien",
    note_moyenne: 4.2,
    nombre_notes: 18,
    calories: 320,
    ID_CATEGORIE: 2,
  },
  {
    ID_RECETTE: 3,
    TITRE: "Tarte aux Pommes",
    DESCRIPTION: "Délicieuse tarte aux pommes avec pâte brisée maison",
    IMAGE: "tarte-pommes.jpg",
    temps_preparation: 30,
    temps_cuisson: 45,
    difficulte: "Moyen",
    regime_alimentaire: "Végétarien",
    note_moyenne: 4.8,
    nombre_notes: 35,
    calories: 280,
    ID_CATEGORIE: 3,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  // Filtrage des recettes
  let filteredRecipes = mockRecipes

  if (query) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.TITRE.toLowerCase().includes(query.toLowerCase()) ||
        recipe.DESCRIPTION.toLowerCase().includes(query.toLowerCase()),
    )
  }

  if (category) {
    // Ici vous filtrerez par catégorie selon votre logique
    // filteredRecipes = filteredRecipes.filter(recipe => recipe.category === category)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex)

  const totalPages = Math.ceil(filteredRecipes.length / limit)

  return NextResponse.json({
    recipes: paginatedRecipes,
    currentPage: page,
    totalPages,
    totalRecipes: filteredRecipes.length,
  })
}
