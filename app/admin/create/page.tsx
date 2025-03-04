// app/admin/create/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [recordedSteps, setRecordedSteps] = useState<Array<{ title: string; description: string }>>([])

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

  const handleFinishRecording = (steps: Array<{ title: string; description: string }>) => {
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
      <h1 className="text-2xl font-semibold mb-6 text-gray-200">Create New Agent</h1>
      <Card className="bg-[#1C1C1C] border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200">Agent Details</CardTitle>
          <CardDescription>Configure your new onboarding agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ... form fields for name, role, description, emails, and recording workflow ... */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>Create Agent</Button>
          </div>
        </CardContent>
      </Card>

      {isRecording && <RecordOnboarding onFinish={handleFinishRecording} />}
    </div>
  )
}
