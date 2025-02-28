"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    <div className="w-80 border-r border-gray-800 backdrop-blur-sm bg-black/60 text-gray-300 p-4 flex flex-col">
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

      <div className="space-y-1">
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
    </div>
  )
}