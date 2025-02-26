"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"

export default function CreateAgent() {
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-200">Create New Agent</h1>
      <Card className="bg-[#1C1C1C] border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200">Agent Details</CardTitle>
          <CardDescription>Configure your new onboarding agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-300">
              Agent Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Engineering Onboarding"
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role" className="text-gray-300">
              Role
            </Label>
            <Input
              id="role"
              placeholder="e.g. Software Engineer"
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose of this onboarding agent..."
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
            <Button className="w-full" variant="outline">
              <Plus size={16} className="mr-2" />
              Add Step
            </Button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline">Cancel</Button>
            <Button>Create Agent</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

