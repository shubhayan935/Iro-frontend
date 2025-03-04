"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, GripVertical } from "lucide-react"
import { getAgent, updateAgent, type Agent, type AgentUpdate } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function EditAgent({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [steps, setSteps] = useState<Array<{ title: string; description: string }>>([])
  const [newStep, setNewStep] = useState({ title: "", description: "" })
  const router = useRouter()

  useEffect(() => {
    fetchAgent()
  }, [])

  const fetchAgent = async () => {
    try {
      const fetchedAgent = await getAgent(params.id)
      setAgent(fetchedAgent)
      setName(fetchedAgent.name)
      setRole(fetchedAgent.role)
      setDescription(fetchedAgent.description || "")
      setEmails(fetchedAgent.emails || [])
      setSteps(fetchedAgent.steps || [])
    } catch (error) {
      console.error("Failed to fetch agent:", error)
      toast({
        title: "Error",
        description: "Failed to load agent details. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  const addStep = () => {
    if (newStep.title) {
      setSteps([...steps, newStep])
      setNewStep({ title: "", description: "" })
    }
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleUpdate = async () => {
    if (!agent) return

    const updatedAgent: AgentUpdate = {
      name,
      role,
      description,
      emails,
      steps,
    }

    try {
      await updateAgent(agent._id, updatedAgent)
      toast({
        title: "Success",
        description: "Agent updated successfully.",
      })
      router.push(`/admin/agents/${agent._id}`)
    } catch (error) {
      console.error("Failed to update agent:", error)
      toast({
        title: "Error",
        description: "Failed to update agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!agent) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-200">Edit Agent</h1>
      <Card className="bg-[#1C1C1C] border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200">Agent Details</CardTitle>
          <CardDescription>Modify your onboarding agent configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-300">
              Agent Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role" className="text-gray-300">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-300">Authorized Employees</Label>
            <form onSubmit={addEmail} className="flex gap-2">
              <Input
                type="email"
                placeholder="Add employee email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-gray-900 border-gray-700 text-gray-200"
              />
              <Button type="submit">
                <Plus size={16} className="mr-2" />
                Add
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 mt-2">
              {emails.map((email) => (
                <div key={email} className="flex items-center gap-2 bg-gray-800 text-gray-200 px-3 py-1 rounded-full">
                  {email}
                  <button onClick={() => removeEmail(email)} className="text-gray-400 hover:text-gray-200">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-300">Onboarding Steps</Label>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="bg-gray-900 border-gray-700">
                  <CardContent className="flex items-start gap-4 p-4">
                    <GripVertical className="text-gray-500 mt-1" size={20} />
                    <div className="flex-1">
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...steps]
                          newSteps[index].title = e.target.value
                          setSteps(newSteps)
                        }}
                        className="bg-gray-800 border-gray-600 text-gray-200 mb-2"
                        placeholder="Step title"
                      />
                      <Textarea
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...steps]
                          newSteps[index].description = e.target.value
                          setSteps(newSteps)
                        }}
                        className="bg-gray-800 border-gray-600 text-gray-200"
                        placeholder="Step description"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(index)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <X size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Card className="bg-gray-900 border-gray-700 border-dashed">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Input
                      value={newStep.title}
                      onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-gray-200"
                      placeholder="New step title"
                    />
                    <Textarea
                      value={newStep.description}
                      onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-gray-200"
                      placeholder="New step description"
                    />
                    <Button onClick={addStep} className="w-full">
                      <Plus size={16} className="mr-2" />
                      Add Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => router.push(`/admin/agents/${agent._id}`)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

