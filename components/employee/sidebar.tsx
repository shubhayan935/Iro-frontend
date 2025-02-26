import Link from "next/link"
import { Home, BookOpen, Users, MessageSquare, Settings } from "lucide-react"

export function EmployeeSidebar() {
  return (
    <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-4">
      <nav className="space-y-2">
        {[
          { icon: Home, label: "Dashboard", href: "/employee" },
          { icon: BookOpen, label: "Learning Path", href: "/employee/learning" },
          { icon: Users, label: "Team", href: "/employee/team" },
          { icon: MessageSquare, label: "Chat", href: "/employee/chat" },
          { icon: Settings, label: "Settings", href: "/employee/settings" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

