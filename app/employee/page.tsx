"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useUser } from "@/app/context/UserContext"
import { getAgents, type Agent } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { EmployeeHeader } from "@/components/employee/header"
import { EmployeeSidebar } from "@/components/employee/sidebar"
import { OnboardingAssistant } from "@/components/employee/onboarding-assistant"
import { AssistantTrigger } from "@/components/employee/assistant-trigger"
import { toast } from "@/components/ui/use-toast"
import { Loader2, BookOpen, FileCheck, Clock, Calendar, ArrowRight, PlayCircle } from "lucide-react"

export default function EmployeeDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [assistantActive, setAssistantActive] = useState(false)
  const [assistantMinimized, setAssistantMinimized] = useState(false)
  
  // Fetch available agents for this employee
  const { 
    data: agents,
    isLoading: isLoadingAgents,
    error: agentsError
  } = useQuery({
    queryKey: ["agents"],
    queryFn: () => getAgents(),
    enabled: !!user,
    refetchOnWindowFocus: false,
  })
  
  // Select the first agent by default
  useEffect(() => {
    if (agents && agents.length > 0 && !activeAgentId) {
      // Find the first agent where the employee's email is in the agent's emails array
      const matchingAgent = agents.find(agent => 
        agent.emails.includes(user?.email || '')
      )
      
      if (matchingAgent) {
        setActiveAgentId(matchingAgent._id)
      }
    }
  }, [agents, activeAgentId, user])
  
  // Calculate progress stats
  const activeAgent = agents?.find(agent => agent._id === activeAgentId)
  const totalSteps = activeAgent?.steps?.length || 0
  const completedSteps = 0 // This would come from user progress tracking
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  
  // Check if the user has any agents available to them
  const hasAvailableAgents = agents && agents.some(agent => 
    agent.emails.includes(user?.email || '')
  )
  
  // Handle launching the AI assistant
  const handleLaunchAssistant = () => {
    if (!activeAgentId) {
      toast({
        title: "No onboarding path selected",
        description: "Please select an onboarding path to begin.",
        variant: "destructive",
      })
      return
    }
    
    setAssistantActive(true)
    setAssistantMinimized(false)
  }
  
  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])
  
  if (!user) return null
  
  if (isLoadingAgents) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-xl">Loading your onboarding...</span>
      </div>
    )
  }
  
  if (agentsError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Onboarding</h1>
        <p className="text-muted-foreground mb-6">
          We encountered a problem loading your onboarding information. Please try again later or contact support.
        </p>
        <Button onClick={() => router.push('/login')}>
          Back to Login
        </Button>
      </div>
    )
  }
  
  if (!hasAvailableAgents) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No Onboarding Assigned</h1>
        <p className="text-muted-foreground mb-6">
          You don't have any onboarding paths assigned to you yet. Please contact your administrator.
        </p>
        <Button onClick={() => router.push('/login')}>
          Back to Login
        </Button>
      </div>
    )
  }
  
  // Render the assistant overlay if active (but don't return early)
  const renderAssistantOverlay = () => {
    if (assistantActive && activeAgentId) {
      return (
        <OnboardingAssistant
          agentId={activeAgentId}
          onClose={() => setAssistantActive(false)}
          onMinimize={() => setAssistantMinimized(true)}
        />
      )
    }
    return null
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Render the assistant overlay */}
      {renderAssistantOverlay()}
      
      <div className="flex h-screen overflow-hidden">
        <EmployeeSidebar 
          agents={agents || []} 
          activeAgentId={activeAgentId}
          onSelectAgent={setActiveAgentId}
        />
        <div className="flex-1 overflow-auto">
          <EmployeeHeader user={user} />
          <main className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {user.email.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground">
                {activeAgent ? `Continue your ${activeAgent.role} onboarding journey.` : 'Select an onboarding path to begin.'}
              </p>
            </div>

            {activeAgent && (
              <>
                <div className="grid gap-6 md:grid-cols-3 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                      <FileCheck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">{progressPercentage.toFixed(0)}%</div>
                      <Progress value={progressPercentage} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                      <BookOpen className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{completedSteps} / {totalSteps}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Estimated Time</CardTitle>
                      <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{Math.ceil(totalSteps * 15 / 60)} hours</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{activeAgent.name}</h2>
                        <p className="text-muted-foreground">
                          {activeAgent.description || `Complete your ${activeAgent.role} onboarding`}
                        </p>
                      </div>
                      <Button
                        size="lg"
                        className="gap-2"
                        onClick={handleLaunchAssistant}
                      >
                        {completedSteps > 0 ? "Continue Onboarding" : "Start Onboarding"}
                        {completedSteps > 0 ? <ArrowRight className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {activeAgent.steps && activeAgent.steps.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-3">Onboarding Steps</h3>
                        <div className="space-y-3">
                          {activeAgent.steps.slice(0, 5).map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                index < completedSteps 
                                  ? "bg-primary/20 text-primary" 
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {index + 1}
                              </div>
                              <span className={index < completedSteps ? "text-primary font-medium" : ""}>
                                {step.title}
                              </span>
                            </div>
                          ))}
                          
                          {activeAgent.steps.length > 5 && (
                            <div className="text-center pt-2">
                              <Button variant="link" onClick={handleLaunchAssistant}>
                                View all {activeAgent.steps.length} steps
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            <Tabs defaultValue="resources">
              <TabsList className="bg-muted">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              <TabsContent value="resources">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Helpful Resources</h3>
                    <ul className="space-y-4">
                      {[
                        { title: "Employee Handbook", icon: BookOpen },
                        { title: "Company Policies", icon: FileCheck },
                        { title: "Benefits Guide", icon: FileCheck },
                        { title: "Development Guidelines", icon: BookOpen },
                      ].map((resource, index) => (
                        <li key={index}>
                          <Button variant="link" className="gap-2 text-primary hover:text-primary/80 p-0">
                            <resource.icon className="h-4 w-4" />
                            {resource.title}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="schedule">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
                    <div className="space-y-4">
                      {[
                        { title: "Team Introduction", date: "Tomorrow, 2:00 PM", icon: Calendar },
                        { title: "IT Setup", date: "Wednesday, 10:00 AM", icon: Calendar },
                        { title: "HR Orientation", date: "Friday, 1:00 PM", icon: Calendar },
                      ].map((event, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <event.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">{event.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="team">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Your Team</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Alice Johnson", role: "Team Lead", email: "alice@company.com" },
                        { name: "Bob Smith", role: "Senior Developer", email: "bob@company.com" },
                        { name: "Carol White", role: "Product Manager", email: "carol@company.com" },
                      ].map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.role}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <AssistantTrigger />
    </div>
  )
}