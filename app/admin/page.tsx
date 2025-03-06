"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Active Onboardings",
              value: agents?.length.toString() || "0",
              change: "+2",
              icon: Users,
            },
            {
              title: "Completion Rate",
              value: "85%",
              change: "+5%",
              icon: Activity,
            },
            {
              title: "Completed Today",
              value: "8",
              change: "+3",
              icon: CheckCircle,
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-card/40 border border-border backdrop-blur-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <span className="text-sm text-green-500">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity and Active Agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-card/40 border border-border backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Latest onboarding sessions
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents?.slice(0, 3).map((agent, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {agent.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {agent.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Agents */}
          <Card className="bg-card/40 border border-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-foreground">
                Active Agents
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Currently running onboarding agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents?.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {agent.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {agent.emails?.length || 0} active sessions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {agent.emails?.length || 0} total employees
                      </p>
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
