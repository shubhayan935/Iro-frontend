"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientBackground } from "@/components/gradient-background"
import { EmployeeSidebar } from "@/components/employee/sidebar"
import { EmployeeHeader } from "@/components/employee/header"
import { ArrowRight, BookOpen, CheckCircle2, FileText, MessageSquare, Play } from "lucide-react"

export default function EmployeeDashboard() {
  const [sessionActive, setSessionActive] = useState(false)
  const progress = 60

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <GradientBackground />
      <div className="flex h-screen overflow-hidden">
        <EmployeeSidebar />
        <div className="flex-1 overflow-auto">
          <EmployeeHeader />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome, John!</h1>
              <p className="text-gray-400">Let's continue your onboarding journey.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Overall Progress</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{progress}%</div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Tasks Completed</CardTitle>
                  <FileText className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 / 20</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Time Remaining</CardTitle>
                  <MessageSquare className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3 days</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/40 border-white/10 backdrop-blur-xl mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Continue Your Onboarding</h2>
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => setSessionActive(true)}
                  >
                    {sessionActive ? "Resume Session" : "Start Session"}
                    {sessionActive ? <ArrowRight className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-gray-400 mb-4">
                  Pick up where you left off or start a new session with your AI onboarding assistant.
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="bg-black/40 border-white/10 backdrop-blur-xl">
                <TabsTrigger value="tasks">Upcoming Tasks</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {[
                        "Complete company policies review",
                        "Set up development environment",
                        "Attend team introduction meeting",
                        "Review project architecture",
                      ].map((task, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                          </div>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources">
                <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {[
                        "Employee Handbook",
                        "Technical Documentation",
                        "Company Policies",
                        "Benefits Guide",
                        "Development Guidelines",
                        "Team Directory",
                      ].map((resource, index) => (
                        <li key={index}>
                          <Button variant="link" className="gap-2 text-blue-400 hover:text-blue-300 p-0">
                            <BookOpen className="h-4 w-4" />
                            {resource}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="team">
                <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {[
                        { name: "Alice Johnson", role: "Team Lead" },
                        { name: "Bob Smith", role: "Senior Developer" },
                        { name: "Carol White", role: "Product Manager" },
                        { name: "David Brown", role: "Designer" },
                      ].map((member, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.role}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}

