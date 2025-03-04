"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

type User = {
  id: string
  name: string
  email: string
  role: "Employee" | "Admin"
}

// Mock data for users
const MOCK_USERS: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Employee" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Admin" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Employee" },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS)
  const [newUser, setNewUser] = useState<Omit<User, "id">>({ name: "", email: "", role: "Employee" })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        user.role.toLowerCase().includes(lowercasedSearch),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const addUser = () => {
    if (newUser.name && newUser.email) {
      const newId = String(Math.max(...users.map((u) => Number.parseInt(u.id))) + 1)
      setUsers([...users, { ...newUser, id: newId }])
      setNewUser({ name: "", email: "", role: "Employee" })
    }
  }

  const updateUser = () => {
    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
      setEditingUser(null)
      setIsEditDialogOpen(false)
    }
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">User Management</CardTitle>
        <CardDescription>Add, edit, or remove users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "Employee" | "Admin" })}
              className="bg-gray-900 border-gray-700 text-gray-200 rounded-md px-3 py-2"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
            <Button
              onClick={addUser}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-200 pl-10"
            />
          </div>

          <div className="rounded-md border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-900/50">
                <TableRow className="hover:bg-transparent border-gray-800">
                  <TableHead className="text-gray-400 font-medium">Name</TableHead>
                  <TableHead className="text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="text-gray-400 font-medium">Role</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/30">
                    <TableCell className="font-medium text-gray-300">{user.name}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "Admin" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 text-gray-200">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Make changes to the user here. Click save when you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={editingUser?.name ?? ""}
                                onChange={(e) =>
                                  setEditingUser((prev) => (prev ? { ...prev, name: e.target.value } : null))
                                }
                                className="col-span-3 bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                value={editingUser?.email ?? ""}
                                onChange={(e) =>
                                  setEditingUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
                                }
                                className="col-span-3 bg-gray-800 border-gray-700"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                              <select
                                id="role"
                                value={editingUser?.role ?? "Employee"}
                                onChange={(e) =>
                                  setEditingUser((prev) =>
                                    prev ? { ...prev, role: e.target.value as "Employee" | "Admin" } : null,
                                  )
                                }
                                className="col-span-3 bg-gray-800 border-gray-700 rounded-md px-3 py-2"
                              >
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={updateUser} className="bg-blue-500 hover:bg-blue-600">
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 text-gray-200">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account and remove
                              their data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 text-gray-200 hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteUser(user.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No users found. Try adjusting your search or add a new user.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

