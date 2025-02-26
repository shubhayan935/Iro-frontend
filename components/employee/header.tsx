import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmployeeHeader() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-black/20 border-white/10 text-white placeholder:text-gray-400 w-64"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-400">Software Engineer</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

