"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Home, 
  Book, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@/app/context/UserContext"
import { cn } from "@/lib/utils"
import { type Agent } from "@/lib/api"

interface EmployeeSidebarProps {
  agents: Agent[]
  activeAgentId: string | null
  onSelectAgent: (agentId: string) => void
}

export function EmployeeSidebar({ 
  agents, 
  activeAgentId, 
  onSelectAgent 
}: EmployeeSidebarProps) {
  const { user, logout } = useUser()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filter agents to only show those that include the user's email
  const userAgents = agents.filter(agent => 
    agent.emails.includes(user?.email || '')
  )

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const sidebarContent = (
    <>
      <div className="p-6">
        <Link href="/employee" className="flex items-center gap-2 text-xl font-semibold mb-8">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            IR
          </div>
          <span>Iro Onboarding</span>
        </Link>

        <nav className="space-y-1 mb-8">
          <Link 
            href="/employee" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/employee/resources" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
          >
            <Book className="h-5 w-5" />
            <span>Resources</span>
          </Link>
          <Link 
            href="/employee/progress" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-foreground"
          >
            <FileText className="h-5 w-5" />
            <span>My Progress</span>
          </Link>
        </nav>

        {userAgents.length > 0 && (
          <>
            <div className="mb-2">
              <h3 className="text-xs uppercase text-muted-foreground font-medium tracking-wider px-3">
                My Onboarding Paths
              </h3>
            </div>
            <div className="space-y-1 mb-8">
              {userAgents.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => onSelectAgent(agent._id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-left",
                    activeAgentId === agent._id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                    {agent.name.charAt(0)}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-sm truncate">{agent.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {agent.role}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 border-r bg-card h-screen overflow-y-auto">
        {sidebarContent}
      </div>
    </>
  )
}