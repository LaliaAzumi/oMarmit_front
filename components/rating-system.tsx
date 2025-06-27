"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MessageCircle } from "lucide-react"
import { recipesAPI } from "@/lib/api"

interface Rating {
  ID_NOTE: number
  NOTE: number
  DATE_NOTE: string
  USERNAME: string
}

interface Comment {
  ID_COMMENTAIRE: number
  CONTENU: string
  DATE_COMMENTAIRE: string
  USERNAME: string
}

interface RatingSystemProps {
  recipeId: number
  user?: any
  averageRating?: number
  totalRatings?: number
}

export default function RatingSystem({ recipeId, user, averageRating = 0, totalRatings = 0 }: RatingSystemProps) {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRatingsAndComments()
    if (user) {
      fetchUserRating()
    }
  }, [recipeId, user])

  const fetchRatingsAndComments = async () => {
    try {
      const [ratingsData, commentsData] = await Promise.all([
        recipesAPI.getRecipeRatings(recipeId),
        recipesAPI.getComments(recipeId),
      ])

      setRatings(ratingsData)
      setComments(commentsData)
    } catch (error) {
      console.error("Erreur lors du chargement des évaluations:", error)
    }
  }

  const fetchUserRating = async () => {
    try {
      const data = await recipesAPI.getUserRating(recipeId)
      setUserRating(data.rating || 0)
    } catch (error) {
      console.error("Erreur lors du chargement de la note utilisateur:", error)
    }
  }

  const submitRating = async (rating: number) => {
    if (!user) return

    try {
      await recipesAPI.rateRecipe(recipeId, rating)
      setUserRating(rating)
      fetchRatingsAndComments()
    } catch (error) {
      console.error("Erreur lors de la soumission de la note:", error)
    }
  }

  const submitComment = async () => {
    if (!user || !comment.trim()) return

    setIsSubmitting(true)
    try {
      await recipesAPI.addComment(recipeId, comment)
      setComment("")
      fetchRatingsAndComments()
    } catch (error) {
      console.error("Erreur lors de la soumission du commentaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 20) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`cursor-pointer transition-colors ${
              star <= (interactive ? hoverRating || rating : rating) ? "text-yellow-500 fill-current" : "text-gray-300"
            }`}
            onClick={interactive ? () => submitRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Résumé des notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            Évaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div>
              {renderStars(averageRating)}
              <div className="text-sm text-gray-600 mt-1">
                {totalRatings} évaluation{totalRatings !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Note de l'utilisateur */}
          {user && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Votre note:</h4>
              {renderStars(userRating, true, 24)}
              {userRating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Vous avez donné {userRating} étoile{userRating !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commentaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle />
            Commentaires ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Ajouter un commentaire */}
          {user && (
            <div className="mb-6">
              <Textarea
                placeholder="Partagez votre avis sur cette recette..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-control-custom mb-2"
                rows={3}
              />
              <Button onClick={submitComment} disabled={!comment.trim() || isSubmitting} className="btn-primary-custom">
                {isSubmitting ? "Publication..." : "Publier le commentaire"}
              </Button>
            </div>
          )}

          {/* Liste des commentaires */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.ID_COMMENTAIRE} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{comment.USERNAME.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.USERNAME}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.DATE_COMMENTAIRE).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.CONTENU}</p>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
