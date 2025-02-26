"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, GripVertical } from "lucide-react"

// This would come from your database
const MOCK_AGENTS = {
  "1": {
    name: "Engineering Onboarding",
    role: "Software Engineer",
    description: "Complete onboarding process for new engineering hires",
    emails: ["alice@company.com", "bob@company.com"],
    steps: [
      { title: "Setup Development Environment", description: "Install necessary tools and configure workspace" },
      { title: "Code Review Process", description: "Learn about the team's code review practices" },
      { title: "Architecture Overview", description: "Understanding the system architecture" },
    ],
  },
}

export default function EditAgent({ params }: { params: { id: string } }) {
  const agent = MOCK_AGENTS[params.id as keyof typeof MOCK_AGENTS]
  const [emails, setEmails] = useState<string[]>(agent?.emails || [])
  const [newEmail, setNewEmail] = useState("")
  const [steps, setSteps] = useState(agent?.steps || [])
  const [newStep, setNewStep] = useState({ title: "", description: "" })

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

  if (!agent) return <div>Agent not found</div>

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
            <Input id="name" defaultValue={agent.name} className="bg-gray-900 border-gray-700 text-gray-200" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role" className="text-gray-300">
              Role
            </Label>
            <Input id="role" defaultValue={agent.role} className="bg-gray-900 border-gray-700 text-gray-200" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              defaultValue={agent.description}
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
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

