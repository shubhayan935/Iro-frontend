"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pencil, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { ExpandedEmployeeRow } from "@/components/admin/expanded-employee-row"
import { getAgent } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export default function AgentPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("activity")
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const router = useRouter()

  const {
    data: agent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agent", params.id],
    queryFn: () => getAgent(params.id),
  })

  const toggleRowExpansion = (employeeName: string) => {
    setExpandedRows((prev) =>
      prev.includes(employeeName) ? prev.filter((name) => name !== employeeName) : [...prev, employeeName],
    )
  }

  if (isLoading) return <div>Loading...</div>
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load agent details. Please try again.",
      variant: "destructive",
    })
    return <div>Error loading agent details.</div>
  }
  if (!agent) return <div>Agent not found</div>

  return (
    <div className="p-6 text-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">{agent.name}</h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-700" />
            <span>Role: {agent.role}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button className="gap-2">
            <Play size={16} />
            Run
          </Button>
          <Link href={`/admin/agents/${params.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Pencil size={16} />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-800">
          {["Activity", "Workflow", "Settings"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "activity" && (
        <Card className="bg-[#1C1C1C] border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gray-200">Recent Activity</CardTitle>
              <CardDescription>View recent onboarding sessions and employee progress</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Employee</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Progress</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agent.emails?.map((email, i) => (
                  <>
                    <TableRow
                      key={i}
                      className="border-gray-800 cursor-pointer hover:bg-gray-800/50"
                      onClick={() => toggleRowExpansion(email)}
                    >
                      <TableCell className="text-gray-300">{email.split("@")[0]}</TableCell>
                      <TableCell className="text-gray-400">{email}</TableCell>
                      <TableCell className="text-gray-400">In Progress</TableCell>
                      <TableCell className="text-gray-300">Active</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          {expandedRows.includes(email) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(email) && (
                      <TableRow>
                        <TableCell colSpan={5} className="bg-gray-800/30 px-4 py-2">
                          <ExpandedEmployeeRow
                            employee={{
                              name: email.split("@")[0],
                              email: email,
                              started: "N/A",
                              progress: "In Progress",
                              status: "Active",
                              lastActivity: "N/A",
                              nextStep: "N/A",
                              notes: "No additional notes",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "workflow" && (
        <Card className="bg-[#1C1C1C] border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200">Workflow</CardTitle>
            <CardDescription>Manage the onboarding workflow for this agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {agent.steps?.map((step, index) => (
                <li key={index} className="text-gray-300">
                  <strong>{step.title}</strong>: {step.description}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {activeTab === "settings" && (
        <Card className="bg-[#1C1C1C] border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200">Settings</CardTitle>
            <CardDescription>Configure agent settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">{agent.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

