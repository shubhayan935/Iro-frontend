"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useUser } from "@/app/context/UserContext"
import { OnboardingAssistant } from "@/components/employee/onboarding-assistant"
import { Sparkles, HelpCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getAgents } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

/**
 * A global floating button that can trigger the AI Assistant from anywhere
 * in the employee application. This component should be mounted at the app level.
 */
export function AssistantTrigger() {
  const { user } = useUser()
  const [assistantActive, setAssistantActive] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  // Fetch available agents for this employee
  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => getAgents(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Select the first agent by default
  useEffect(() => {
    if (agents && agents.length > 0 && !activeAgentId) {
      // Find the first agent where the employee's email is in the agent's emails array
      const matchingAgent = agents?.find(agent => 
        agent.emails.includes(user?.email || '')
      )
      
      if (matchingAgent) {
        setActiveAgentId(matchingAgent._id)
      }
    }
  }, [agents, activeAgentId, user])

  // Launch the assistant
  const launchAssistant = () => {
    if (!activeAgentId) {
      toast({
        title: "No onboarding guide available",
        description: "Please contact your administrator to assign you an onboarding process.",
        variant: "destructive"
      })
      return
    }
    
    setAssistantActive(true)
  }

  // Only show for logged-in users with the employee role
  if (!user || user.role !== "Employee") {
    return null
  }

  return (
    <>
      {/* Floating button */}
      <Button 
        onClick={launchAssistant}
        className="fixed bottom-4 right-4 z-40 rounded-full w-12 h-12 p-0 shadow-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
        title="Launch Onboarding Assistant"
      >
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </Button>

      {/* Render the assistant overlay if active */}
      {assistantActive && activeAgentId && (
        <OnboardingAssistant
          agentId={activeAgentId}
          onClose={() => setAssistantActive(false)}
          onMinimize={() => setAssistantActive(false)}
        />
      )}
    </>
  )
}