import { UserManagement } from "@/components/admin/user-management"

export default function UsersPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400">Add, edit, or remove users from your organization</p>
      </div>

      <UserManagement />
    </div>
  )
}

