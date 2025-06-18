import { NextResponse } from "next/server"

// Simulation de données - remplacez par votre vraie base de données
const mockCategories = [
  { ID_CATEGORIE: 1, NOM_CATEGORIE: "Plats principaux" },
  { ID_CATEGORIE: 2, NOM_CATEGORIE: "Entrées" },
  { ID_CATEGORIE: 3, NOM_CATEGORIE: "Desserts" },
  { ID_CATEGORIE: 4, NOM_CATEGORIE: "Soupes" },
  { ID_CATEGORIE: 5, NOM_CATEGORIE: "Salades" },
  { ID_CATEGORIE: 6, NOM_CATEGORIE: "Boissons" },
]

export async function GET() {
  return NextResponse.json(mockCategories)
}
