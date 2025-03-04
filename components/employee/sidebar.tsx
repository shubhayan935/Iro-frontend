"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Users, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/app/context/UserContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getAgents, type Agent } from "@/lib/api"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useUser()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    if (user) {
      fetchAgents()
    }
  }, [user])

  const fetchAgents = async () => {
    try {
      // Fetch all agents without filtering by organization.
      const fetchedAgents = await getAgents()
      setAgents(fetchedAgents)
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="w-80 border-r border-gray-800 backdrop-blur-sm bg-black/60 text-gray-300 p-4 flex flex-col h-screen">
      <Link
        href="/employee"
        className="flex items-center gap-2 px-2 py-1.5 mb-6 text-gray-300 hover:text-white"
      >
        <Home size={20} />
        <span>Home</span>
      </Link>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wider text-gray-500">
          AGENTS
        </h2>
        <Link href="/employee/create">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-400 hover:text-white hover:bg-muted/30"
          >
            <Plus size={16} />
            Create Agent
          </Button>
        </Link>
      </div>

      <div className="space-y-1 flex-grow overflow-auto">
        {agents.map((agent) => (
          <Link
            key={agent._id}
            href={`/employee/agents/${agent._id}`}
            className={cn(
              "block p-3 rounded-lg text-md transition-colors",
              pathname === `/employee/agents/${agent._id}`
                ? "bg-gray-800/60 text-white"
                : "hover:bg-gray-800/50 text-gray-400"
            )}
          >
            <div className="font-medium mb-1">{agent.name}</div>
            <div className="flex items-center text-xs text-gray-500">
              <span>ROLE: {agent.role}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start px-2 py-3 hover:bg-gray-800/50 rounded-lg"
            >
              <Avatar className="w-9 h-9 mr-3 border border-gray-700">
                <AvatarImage
                  src="/placeholder.svg?height=36&width=36"
                  alt="Employee"
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {user?.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium text-gray-200">
                  {user?.email}
                </span>
                <span className="text-xs text-gray-500 truncate w-full">
                  {user?.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-gray-900 border-gray-700 text-gray-200"
            align="end"
            forceMount
          >
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
              <Link href="/employee/profile" className="flex items-center w-full">
                <Avatar className="w-4 h-4 mr-2">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px]">
                    {user?.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
              <Link href="/employee/settings" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4 text-gray-400" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 text-gray-400" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
