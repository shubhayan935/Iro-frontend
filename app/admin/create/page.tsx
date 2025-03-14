"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Reorder } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Video, Trash2, Loader2 } from "lucide-react"
import { RecordOnboarding } from "@/components/admin/record-onboarding"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { useUser } from "@/app/context/UserContext"
import {
  createAgent,
  updateAgentSteps,
  deleteStep,
  type AgentCreate,
  type OnboardingStep
} from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function CreateAgent() {
  const { user } = useUser()
  const router = useRouter()
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedSteps, setRecordedSteps] = useState<OnboardingStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [stepToDelete, setStepToDelete] = useState<number | null>(null)
  const [agentId, setAgentId] = useState<string | null>(null)

  useEffect(() => {
    // If we have an agentId from URL, we're in edit mode and should fetch the steps
    const id = new URLSearchParams(window.location.search).get('id')
    if (id) {
      setAgentId(id)
      // You'd also fetch other agent details here
    }
  }, [])

  const addEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail])
      setNewEmail("")
    }
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleFinishRecording = (
    steps: OnboardingStep[]
  ) => {
    setIsRecording(false)
    
    // Merge new steps with existing ones
    setRecordedSteps(prevSteps => [...prevSteps, ...steps])
    
    // If we already have an agentId (edit mode), update the steps in the database
    if (agentId) {
      updateStepsInDatabase([...recordedSteps, ...steps])
    }
  }
  
  const updateStepsInDatabase = async (steps: OnboardingStep[]) => {
    if (!agentId) return
    
    try {
      await updateAgentSteps(agentId, steps)
      toast({
        title: "Success",
        description: "Onboarding steps updated successfully.",
      })
    } catch (error) {
      console.error("Error updating steps:", error)
    }
  }

  const handleCreateAgent = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an agent.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const newAgent: AgentCreate = {
        name,
        role,
        description,
        emails,
        steps: recordedSteps,
      }

      const result = await createAgent(newAgent)
      toast({
        title: "Success",
        description: "Agent created successfully.",
      })
      
      // Update the agentId if it's a new agent
      if (!agentId && result.id) {
        setAgentId(result.id)
      }
      
      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reorder handler for Framer Motion
  const handleReorder = async (newOrder: OnboardingStep[]) => {
    setRecordedSteps(newOrder)
    
    // If we have an agentId, update the steps in the database
    if (agentId) {
      updateStepsInDatabase(newOrder)
    }
  }

  // Delete step functions
  const confirmDeleteStep = (index: number) => {
    setStepToDelete(index)
  }

  const handleDeleteStep = async () => {
    if (stepToDelete === null) return
    
    const stepToRemove = recordedSteps[stepToDelete]
    
    // Remove the step locally first for better UX
    const newSteps = [...recordedSteps]
    newSteps.splice(stepToDelete, 1)
    setRecordedSteps(newSteps)
    
    // If we have an agentId and the step has an id, delete it from the database
    if (agentId && stepToRemove._id) {
      try {
        await deleteStep(agentId, stepToRemove._id)
        toast({
          title: "Success",
          description: "Step deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting step:", error)
        
        // Put the step back if deletion failed
        setRecordedSteps(recordedSteps)
        
        toast({
          title: "Error",
          description: "Failed to delete step. Please try again.",
          variant: "destructive",
        })
      }
    }
    
    // Reset the delete dialog
    setStepToDelete(null)
  }

  const cancelDeleteStep = () => {
    setStepToDelete(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">
        {agentId ? "Edit Agent" : "Create New Agent"}
      </h1>
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Agent Details</CardTitle>
          <CardDescription>
            Configure your {agentId ? "" : "new"} onboarding agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Agent Name */}
            <div className="grid gap-2">
              <Label htmlFor="agentName" className="text-muted-foreground">
                Agent Name
              </Label>
              <Input
                id="agentName"
                placeholder="Enter agent name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-input text-foreground"
              />
            </div>
            {/* Agent Role */}
            <div className="grid gap-2">
              <Label htmlFor="agentRole" className="text-muted-foreground">
                Role
              </Label>
              <Input
                id="agentRole"
                placeholder="Enter agent role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-input border-input text-foreground"
              />
            </div>
            {/* Agent Description */}
            <div className="grid gap-2">
              <Label htmlFor="agentDescription" className="text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="agentDescription"
                placeholder="Enter agent description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-input text-foreground"
              />
            </div>
            {/* Authorized Employee Emails */}
            <div className="grid gap-2">
              <Label className="text-muted-foreground">
                Authorized Employee Emails
              </Label>
              <form onSubmit={addEmail} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter employee email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-input border-input text-foreground"
                />
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </form>
              {emails.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {emails.map((email, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-card p-2 rounded"
                    >
                      <span className="text-foreground">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Onboarding Steps */}
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Onboarding Steps</Label>
              
              {recordedSteps.length > 0 ? (
                <Reorder.Group
                  axis="y"
                  values={recordedSteps}
                  onReorder={handleReorder}
                  className="rounded-md bg-muted/40 p-1 space-y-1"
                >
                  {recordedSteps.map((step, index) => (
                    <Reorder.Item
                      key={step._id || `step-${index}-${Date.now()}`}
                      value={step}
                      whileDrag={{ scale: 1.02 }}
                      className="flex items-center p-3 rounded-md transition-colors bg-card hover:bg-muted border border-border group"
                    >
                      {/* Grip icon as a visual drag handle */}
                      <div className="mr-2 cursor-grab select-none">
                        <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M4 15h16" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-1">
                          {step.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDeleteStep(index)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              ) : (
                <p className="text-muted-foreground">
                  No onboarding steps recorded yet.
                </p>
              )}
              <Button
                variant="outline"
                onClick={handleStartRecording}
                className="mt-2"
              >
                <Video className="mr-2 h-4 w-4" />
                Record Onboarding
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => router.push("/admin")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAgent}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {agentId ? "Updating..." : "Creating..."}
                </>
              ) : (
                agentId ? "Update Agent" : "Create Agent"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isRecording && (
        <RecordOnboarding onFinish={handleFinishRecording} agentId={agentId || undefined} />
      )}
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmation
        isOpen={stepToDelete !== null}
        title="Delete Onboarding Step"
        description="Are you sure you want to delete this step? This action cannot be undone."
        onConfirm={handleDeleteStep}
        onCancel={cancelDeleteStep}
      />
    </div>
  )
}