// app/admin/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Activity, CheckCircle } from "lucide-react"
import { useUser } from "../context/UserContext"
import { getAgents } from "@/lib/api"

export default function AdminDashboard() {
  const { user } = useUser()

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => getAgents(),
  })

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Active Onboardings", value: agents?.length.toString() || "0", change: "+2", icon: Users },
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
                {agents?.slice(0, 3).map((agent, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-sm text-gray-400">{agent.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Active</p>
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
                {agents?.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-white">{agent.name}</p>
                      <p className="text-sm text-gray-400">{agent.emails?.length || 0} active sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{agent.emails?.length || 0} total employees</p>
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
