import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Activity, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Active Onboardings", value: "12", change: "+2", icon: Users },
            { title: "Completion Rate", value: "85%", change: "+5%", icon: Activity },
            { title: "Completed Today", value: "8", change: "+3", icon: CheckCircle },
          ].map((stat, index) => (
            <Card key={index} className="bg-black/40 border-white/10 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <span className="text-sm text-green-400">{stat.change}</span>
                    </div>
                  </div>
                  <stat.icon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription>Latest onboarding sessions</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Alice Johnson", role: "Software Engineer", time: "2h ago", status: "In Progress" },
                  { name: "Bob Smith", role: "Product Designer", time: "5h ago", status: "Completed" },
                  { name: "Carol White", role: "Marketing Manager", time: "1d ago", status: "In Progress" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-white">{activity.name}</p>
                      <p className="text-sm text-gray-400">{activity.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{activity.time}</p>
                      <p className={`text-sm ${activity.status === "Completed" ? "text-green-400" : "text-blue-400"}`}>
                        {activity.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Active Agents</CardTitle>
              <CardDescription>Currently running onboarding agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Engineering Onboarding", active: 5, total: 15 },
                  { name: "Design Onboarding", active: 3, total: 8 },
                  { name: "Marketing Onboarding", active: 2, total: 6 },
                ].map((agent, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-sm text-gray-400">{agent.active} active sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{agent.total} total employees</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}