import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/recipes/${params.id}`, {
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
    })

    if (!response.ok) {
      throw new Error("Backend unavailable")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // Fallback avec données mockées
    const mockRecipe = {
      ID_RECETTE: Number.parseInt(params.id),
      TITRE: "Recette d'exemple",
      DESCRIPTION: "Description de la recette",
      INGREDIENTS: "Ingrédients de base",
      INSTRUCTIONS: "Instructions de préparation",
      IMAGE: "placeholder.jpg",
      temps_preparation: 30,
      temps_cuisson: 20,
      difficulte: "Moyen",
      regime_alimentaire: "",
      calories: 350,
      proteines: 15,
      glucides: 45,
      lipides: 12,
      USERNAME: "Chef Test",
      note_moyenne: 4.2,
      nombre_notes: 15,
    }

    return NextResponse.json(mockRecipe)
  }
}
