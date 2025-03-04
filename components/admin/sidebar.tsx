"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Users, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Agent = {
  id: string
  name: string
  steps: number
  lastModified: string
}

export function Sidebar() {
  const pathname = usePathname()
  const agents: Agent[] = [
    { id: "1", name: "Engineering Onboarding", steps: 15, lastModified: "2m" },
    { id: "2", name: "Design Onboarding", steps: 12, lastModified: "1h" },
    { id: "3", name: "Marketing Onboarding", steps: 10, lastModified: "2d" },
  ]

  return (
    <div className="w-80 border-r border-gray-800 backdrop-blur-sm bg-black/60 text-gray-300 p-4 flex flex-col h-screen">
      <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5 mb-6 text-gray-300 hover:text-white">
        <Home size={20} />
        <span>Home</span>
      </Link>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wider text-gray-500">AGENTS</h2>
        <Link href="/admin/create">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400 hover:text-white hover:bg-muted/30">
            <Plus size={16} />
            Create Agent
          </Button>
        </Link>
      </div>

      <div className="space-y-1 flex-grow overflow-auto">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/admin/agents/${agent.id}`}
            className={cn(
              "block p-3 rounded-lg text-md transition-colors",
              pathname === `/admin/agents/${agent.id}`
                ? "bg-gray-800/60 text-white"
                : "hover:bg-gray-800/50 text-gray-400",
            )}
          >
            <div className="font-medium mb-1">{agent.name}</div>
            <div className="flex items-center text-xs text-gray-500">
              <span>STEPS: {agent.steps}</span>
              <span className="ml-auto">{agent.lastModified}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="py-7">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start hover:bg-gray-800/50 rounded-lg"
            >
              <Avatar className="w-9 h-9 mr-3 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"></AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium text-gray-200">Admin User</span>
                <span className="text-xs text-gray-500 truncate w-full">admin@example.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-gray-200" align="end" forceMount>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
              <Link href="/admin/users" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4 text-gray-400" />
                <span>Manage Users</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer focus:bg-gray-800">
              <Link href="/login" className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4 text-gray-400" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

