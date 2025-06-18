import { NextResponse } from "next/server"

// Simulation de données - remplacez par votre vraie base de données
const mockIngredients = [
  { ID_INGREDIENT: 1, NOM_INGREDIENT: "Tomate" },
  { ID_INGREDIENT: 2, NOM_INGREDIENT: "Oignon" },
  { ID_INGREDIENT: 3, NOM_INGREDIENT: "Ail" },
  { ID_INGREDIENT: 4, NOM_INGREDIENT: "Basilic" },
  { ID_INGREDIENT: 5, NOM_INGREDIENT: "Parmesan" },
  { ID_INGREDIENT: 6, NOM_INGREDIENT: "Œuf" },
  { ID_INGREDIENT: 7, NOM_INGREDIENT: "Farine" },
  { ID_INGREDIENT: 8, NOM_INGREDIENT: "Beurre" },
  { ID_INGREDIENT: 9, NOM_INGREDIENT: "Lait" },
  { ID_INGREDIENT: 10, NOM_INGREDIENT: "Sucre" },
]

export async function GET() {
  return NextResponse.json(mockIngredients)
}
