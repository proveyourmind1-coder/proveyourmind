"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Settings,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addQuestion, fetchUsers, updateUserRole, fetchQuizzes, toggleQuizActiveStatus } from "@/app/admin/actions" // Import Server Actions
import type { User, Quiz, Question } from "@/lib/types" // Import types

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()

  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id" | "points">>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "easy",
    category: "general",
  })
  const [users, setUsers] = useState<User[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
      loadQuizzes()
    }
  }, [isAdmin])

  const loadUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      })
    }
  }

  const loadQuizzes = async () => {
    try {
      const fetchedQuizzes = await fetchQuizzes()
      setQuizzes(fetchedQuizzes)
    } catch (error) {
      console.error("Error loading quizzes:", error)
      toast({
        title: "Error",
        description: "Failed to load quizzes.",
        variant: "destructive",
      })
    }
  }

  const handleAddQuestion = async () => {
    try {
      // Assign default points based on difficulty (example logic)
      const points =
        newQuestion.difficulty === "easy"
          ? 10
          : newQuestion.difficulty === "medium"
            ? 20
            : newQuestion.difficulty === "hard"
              ? 30
              : 50

      await addQuestion({ ...newQuestion, points })
      toast({
        title: "Success",
        description: "Question added successfully!",
      })
      // Reset form
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        difficulty: "easy",
        category: "general",
      })
    } catch (error) {
      console.error("Error adding question:", error)
      toast({
        title: "Error",
        description: "Failed to add question.",
        variant: "destructive",
      })
    }
  }

  const handleChangeUserRole = async (userId: string, currentRole: "user" | "admin") => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    try {
      await updateUserRole(userId, newRole)
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      })
      loadUsers() // Reload users to reflect changes
    } catch (error) {
      console.error("Error changing user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const handleToggleQuizStatus = async (quizId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    try {
      await toggleQuizActiveStatus(quizId, newStatus)
      toast({
        title: "Success",
        description: `Quiz status updated to ${newStatus ? "Active" : "Inactive"}.`,
      })
      loadQuizzes() // Reload quizzes to reflect changes
    } catch (error) {
      console.error("Error toggling quiz status:", error)
      toast({
        title: "Error",
        description: "Failed to update quiz status.",
        variant: "destructive",
      })
    }
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p>Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    { title: "Total Users", value: users.length.toLocaleString(), change: "+12%", icon: Users, color: "text-blue-600" },
    {
      title: "Active Quizzes",
      value: quizzes.filter((q) => q.isActive).length.toLocaleString(),
      change: "+5%",
      icon: BookOpen,
      color: "text-green-600",
    },
    { title: "Revenue", value: "₹2,45,000", change: "+18%", icon: DollarSign, color: "text-purple-600" },
    { title: "Completion Rate", value: "78%", change: "+3%", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-7 w-7 text-purple-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your ProveYourMind platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-600">Admin</Badge>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map(
                      (
                        userItem, // Show only recent 5 users
                      ) => (
                        <div key={userItem.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{userItem.name}</p>
                            <p className="text-sm text-gray-500">{userItem.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={userItem.role === "admin" ? "default" : "secondary"}>{userItem.role}</Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Performance</CardTitle>
                  <CardDescription>Most popular quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizzes.slice(0, 5).map(
                      (
                        quizItem, // Show only recent 5 quizzes
                      ) => (
                        <div key={quizItem.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{quizItem.title}</p>
                            <p className="text-sm text-gray-500">
                              {quizItem.questions.length} questions • {quizItem.difficulty}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={quizItem.isActive ? "default" : "secondary"}>
                              {quizItem.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
                <CardDescription>Create questions for your quizzes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newQuestion.difficulty}
                      onValueChange={(value) =>
                        setNewQuestion({ ...newQuestion, difficulty: value as Question["difficulty"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newQuestion.category}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Knowledge</SelectItem>
                        <SelectItem value="science">Science & Technology</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Answer Options</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options]
                          newOptions[index] = e.target.value
                          setNewQuestion({ ...newQuestion, options: newOptions })
                        }}
                      />
                      <Button
                        type="button"
                        variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                      >
                        {newQuestion.correctAnswer === index ? "Correct" : "Mark Correct"}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Explain why this is the correct answer..."
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddQuestion} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userItem) => (
                    <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{userItem.name}</p>
                        <p className="text-sm text-gray-500">{userItem.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {userItem.lastLogin ? new Date(userItem.lastLogin).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={userItem.role === "admin" ? "default" : "secondary"}>{userItem.role}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeUserRole(userItem.id, userItem.role)}
                          disabled={userItem.id === user?.id} // Prevent admin from changing their own role
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          {userItem.role === "admin" ? "Demote" : "Promote"}
                        </Button>
                        {/* <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Management</CardTitle>
                <CardDescription>Manage your quiz collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quizItem) => (
                    <div key={quizItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{quizItem.title}</p>
                        <p className="text-sm text-gray-500">
                          {quizItem.questions.length} questions • {quizItem.difficulty} difficulty
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleQuizStatus(quizItem.id, quizItem.isActive)}
                        >
                          {quizItem.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="ml-1">{quizItem.isActive ? "Active" : "Inactive"}</span>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {/* <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track payments and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-700">₹2,45,000</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Pending Payouts</p>
                      <p className="text-2xl font-bold text-blue-700">₹15,000</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">This Month</p>
                      <p className="text-2xl font-bold text-purple-700">₹45,000</p>
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <p className="text-gray-500">Payment history and detailed analytics coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
