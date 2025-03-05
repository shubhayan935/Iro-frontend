"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Plus, X, Video } from "lucide-react"
import { RecordOnboarding } from "@/components/admin/record-onboarding"
import { useUser } from "@/app/context/UserContext"
import { createAgent, type AgentCreate } from "@/lib/api"
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
  const [recordedSteps, setRecordedSteps] = useState<
    Array<{ title: string; description: string }>
  >([])

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
    steps: Array<{ title: string; description: string }>
  ) => {
    setIsRecording(false)
    setRecordedSteps(steps)
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

    const newAgent: AgentCreate = {
      name,
      role,
      description,
      emails,
      steps: recordedSteps,
    }

    try {
      await createAgent(newAgent)
      toast({
        title: "Success",
        description: "Agent created successfully.",
      })
      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-200">
        Create New Agent
      </h1>
      <Card className="bg-[#1C1C1C] border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200">Agent Details</CardTitle>
          <CardDescription>
            Configure your new onboarding agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            {/* Agent Name */}
            <div className="grid gap-2">
              <Label htmlFor="agentName" className="text-gray-300">
                Agent Name
              </Label>
              <Input
                id="agentName"
                placeholder="Enter agent name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-900 border-gray-700 text-gray-200"
              />
            </div>
            {/* Agent Role */}
            <div className="grid gap-2">
              <Label htmlFor="agentRole" className="text-gray-300">
                Role
              </Label>
              <Input
                id="agentRole"
                placeholder="Enter agent role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-gray-900 border-gray-700 text-gray-200"
              />
            </div>
            {/* Agent Description */}
            <div className="grid gap-2">
              <Label htmlFor="agentDescription" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="agentDescription"
                placeholder="Enter agent description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-900 border-gray-700 text-gray-200"
              />
            </div>
            {/* Authorized Employee Emails */}
            <div className="grid gap-2">
              <Label className="text-gray-300">
                Authorized Employee Emails
              </Label>
              <form onSubmit={addEmail} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter employee email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-gray-200"
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
                      className="flex items-center justify-between bg-gray-800 p-2 rounded"
                    >
                      <span className="text-gray-200">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-gray-400 hover:text-gray-200"
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
              <Label className="text-gray-300">Onboarding Steps</Label>
              {recordedSteps.length > 0 ? (
                <ul className="space-y-2">
                  {recordedSteps.map((step, index) => (
                    <li key={index} className="bg-gray-800 p-2 rounded">
                      <h3 className="font-semibold text-gray-200">
                        {step.title}
                      </h3>
                      <p className="text-gray-400">{step.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">
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
            <Button variant="outline" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>Create Agent</Button>
          </div>
        </CardContent>
      </Card>

      {isRecording && (
        <RecordOnboarding onFinish={handleFinishRecording} />
      )}
    </div>
  )
}
