"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  BookOpen,
  MessageCircle,
  Star,
  Eye,
  TrendingUp,
  Search,
  Award,
  PieChartIcon as RechartsPieChart,
} from "lucide-react"
import { adminAPI, authAPI } from "@/lib/api"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"

interface AdminStats {
  general_stats: {
    total_users: number
    total_recipes: number
    total_comments: number
    total_ratings: number
    active_users: number
    new_users: number
    total_consultations: number
  }
  consultations_by_day: Array<{
    date: string
    consultations: number
  }>
  popular_recipes: Array<{
    title: string
    consultations: number
  }>
  top_rated_recipes: Array<{
    title: string
    average_rating: number
    total_ratings: number
  }>
  popular_searches: Array<{
    term: string
    count: number
  }>
  categories_stats: Array<{
    category: string
    count: number
  }>
}

interface User {
  ID_USER: number
  USERNAME: string
  EMAIL: string
  DATE_INSCRIPTION: string
  DERNIERE_CONNEXION: string
  IS_ADMIN: boolean
  recipe_count: number
}

const COLORS = ["#855f42", "#6e7e56", "#c97c5d", "#e1ad01", "#7296a6", "#a5573f"]

const Pie = ({ data, cx, cy, labelLine, label, outerRadius, fill, dataKey }) => (
  <RechartsPieChart>
    <Pie
      data={data}
      cx={cx}
      cy={cy}
      labelLine={labelLine}
      label={label}
      outerRadius={outerRadius}
      fill={fill}
      dataKey={dataKey}
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </RechartsPieChart>
)

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [usersPage, setUsersPage] = useState(1)
  const [totalUsersPages, setTotalUsersPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const user = await authAPI.getCurrentUser()
      if (!user.is_admin) {
        router.push("/")
        return
      }
      setCurrentUser(user)
      await Promise.all([fetchStats(), fetchUsers()])
    } catch (error) {
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getStats()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    }
  }

  const fetchUsers = async (page = 1) => {
    try {
      const data = await adminAPI.getUsers(page, 20)
      setUsers(data.users)
      setTotalUsersPages(data.total_pages)
      setUsersPage(page)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
    }
  }

  const toggleUserAdmin = async (userId: number) => {
    try {
      await adminAPI.toggleUserAdmin(userId)
      fetchUsers(usersPage) // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement du panneau d'administration...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Erreur lors du chargement des données</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panneau d'Administration</h1>
          <p className="text-gray-600">Bienvenue, {currentUser?.username}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_users}</div>
                  <p className="text-xs text-muted-foreground">+{stats.general_stats.new_users} cette semaine</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recettes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_recipes}</div>
                  <p className="text-xs text-muted-foreground">Recettes publiées</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_consultations}</div>
                  <p className="text-xs text-muted-foreground">Vues totales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.active_users}</div>
                  <p className="text-xs text-muted-foreground">30 derniers jours</p>
                </CardContent>
              </Card>
            </div>

            {/* Graphique des consultations */}
            <Card>
              <CardHeader>
                <CardTitle>Consultations par jour (7 derniers jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.consultations_by_day.reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="consultations" stroke="#855f42" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recettes populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Recettes les plus consultées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.popular_recipes.slice(0, 5).map((recipe, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{recipe.title}</h4>
                          <p className="text-xs text-gray-500">{recipe.consultations} consultations</p>
                        </div>
                        <Badge variant="secondary">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recettes les mieux notées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} />
                    Recettes les mieux notées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.top_rated_recipes.slice(0, 5).map((recipe, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{recipe.title}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              <span className="text-xs ml-1">{recipe.average_rating.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-500">({recipe.total_ratings} votes)</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recherches populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search size={20} />
                    Termes de recherche populaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.popular_searches.slice(0, 8).map((search, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{search.term}</span>
                        <Badge variant="outline">{search.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Répartition par catégorie */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RechartsPieChart size={20} />
                    Répartition par catégorie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <Pie
                      data={stats.categories_stats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    />
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <p className="text-sm text-gray-600">Total: {stats.general_stats.total_users} utilisateurs</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom d'utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Recettes</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.ID_USER}>
                        <TableCell className="font-medium">{user.USERNAME}</TableCell>
                        <TableCell>{user.EMAIL}</TableCell>
                        <TableCell>{new Date(user.DATE_INSCRIPTION).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          {user.DERNIERE_CONNEXION
                            ? new Date(user.DERNIERE_CONNEXION).toLocaleDateString("fr-FR")
                            : "Jamais"}
                        </TableCell>
                        <TableCell>{user.recipe_count}</TableCell>
                        <TableCell>
                          {user.IS_ADMIN ? (
                            <Badge className="bg-red-100 text-red-800">Admin</Badge>
                          ) : (
                            <Badge variant="secondary">Utilisateur</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserAdmin(user.ID_USER)}
                            disabled={user.ID_USER === currentUser?.id}
                          >
                            {user.IS_ADMIN ? "Retirer admin" : "Promouvoir admin"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalUsersPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(usersPage - 1)}
                      disabled={usersPage === 1}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm">
                      Page {usersPage} sur {totalUsersPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(usersPage + 1)}
                      disabled={usersPage === totalUsersPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Recettes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_recipes}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commentaires</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_comments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Évaluations</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_ratings}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.general_stats.total_consultations}</div>
                </CardContent>
              </Card>
            </div>

            {/* Graphique des catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des recettes par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categories_stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#855f42" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
