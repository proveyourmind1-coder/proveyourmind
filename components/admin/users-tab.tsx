"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Search, Crown, Shield, Ban, MoreHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchUsers, updateUserRole, banUser } from "@/app/admin/actions"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "admin"
  rank: number
  score: number
  status: "active" | "banned"
  joinedAt: Date
  lastActive: Date
}

export function UsersTab() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      await updateUserRole(userId, newRole)
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      toast({ title: "Success", description: `User role updated to ${newRole}` })
    } catch {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
    }
  }

  const handleBanUser = async (userId: string) => {
    try {
      await banUser(userId)
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: "banned" } : user)))
      toast({ title: "Success", description: "User banned" })
    } catch {
      toast({ title: "Error", description: "Failed to ban user", variant: "destructive" })
    }
  }

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 🔍 Search */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* 👥 Users Table */}
      <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.rank}</TableCell>
                  <TableCell>{user.score}</TableCell>
                  <TableCell>
                    <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.lastActive).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role === "admin" ? "user" : "admin")}>
                          {user.role === "admin" ? <Shield className="h-4 w-4 mr-2" /> : <Crown className="h-4 w-4 mr-2" />}
                          Make {user.role === "admin" ? "User" : "Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
