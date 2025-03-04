// app/admin/users/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { UserManagement } from "@/components/admin/user-management"
import { useUser } from "@/app/context/UserContext"
import { getUsers } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function UsersPage() {
  const { user } = useUser()

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load users. Please try again.",
      variant: "destructive",
    })
    return <div>Error loading users.</div>
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400">Add, edit, or remove users</p>
      </div>

      <UserManagement users={users || []} onUserChange={refetch} />
    </div>
  )
}
