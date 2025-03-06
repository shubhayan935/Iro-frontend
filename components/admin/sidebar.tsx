"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Users, LogOut, Settings, Laptop, Sun, Moon } from "lucide-react"
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
import { useQuery } from "@tanstack/react-query"
import { getAgents } from "@/lib/api"
import { useTheme } from "next-themes"

// Theme toggle button component
function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  let Icon
  if (theme === "light") {
    Icon = Sun
  } else if (theme === "dark") {
    Icon = Moon
  } else {
    Icon = Laptop
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      title={`Switch theme (current: ${theme})`}
    >
      <Icon className="h-5 w-5" />
    </Button>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useUser()
  const router = useRouter()

  // Fetch agents if needed
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => getAgents(),
    enabled: !!user,
  })

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="w-80 border-r border-border backdrop-blur-sm bg-card/60 text-foreground p-4 flex flex-col h-screen">
      {/* Top area with theme toggle and Home link */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin">
          <div className="flex items-center gap-2 text-foreground hover:text-primary">
            <Home size={20} />
            <span>Home</span>
          </div>
        </Link>
        <ThemeToggleButton />
      </div>

      {/* AGENTS Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground">
          AGENTS
        </h2>
        <Link href="/admin/create">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-muted/30"
          >
            <Plus size={16} />
            Create Agent
          </Button>
        </Link>
      </div>

      <div className="space-y-1 flex-grow overflow-auto">
        {agents?.map((agent) => (
          <Link
            key={agent._id}
            href={`/admin/agents/${agent._id}`}
            className={cn(
              "block p-3 rounded-lg text-md transition-colors",
              pathname === `/admin/agents/${agent._id}`
                ? "bg-muted/60 text-foreground"
                : "hover:bg-muted/50 text-muted-foreground"
            )}
          >
            <div className="font-medium mb-1">{agent.name}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>ROLE: {agent.role}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile Dropdown at the bottom */}
      <div className="mt-auto pt-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start px-2 py-3 hover:bg-muted/50 rounded-lg"
            >
              <Avatar className="w-9 h-9 mr-3 border border-border">
                <AvatarImage src="/placeholder.svg" alt="Admin" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-sm font-medium text-foreground">
                  {user?.email}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {user?.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border text-foreground" align="end" forceMount>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer focus:bg-muted">
              <Link href="/admin/profile" className="flex items-center w-full">
                <Avatar className="w-4 h-4 mr-2">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                    {user?.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer focus:bg-muted">
              <Link href="/admin/users" className="flex items-center w-full">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Manage Users</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted cursor-pointer focus:bg-muted"
              onSelect={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
