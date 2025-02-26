"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pencil, MoreHorizontal, ArrowUpRight } from "lucide-react"
import Link from "next/link"

// This would come from your database
const MOCK_AGENTS = {
  "1": {
    name: "Engineering Onboarding",
    creator: "John Doe",
    steps: 15,
    employees: [
      { name: "Alice Johnson", started: "Feb 23, 2024", progress: "8/15", status: "In Progress" },
      { name: "Bob Smith", started: "Feb 22, 2024", progress: "15/15", status: "Completed" },
    ],
  },
  "2": {
    name: "Design Onboarding",
    creator: "Jane Smith",
    steps: 12,
    employees: [{ name: "Carol White", started: "Feb 24, 2024", progress: "4/12", status: "In Progress" }],
  },
}

export default function AgentPage({ params }: { params: { id: string } }) {
  const agent = MOCK_AGENTS[params.id as keyof typeof MOCK_AGENTS]
  const [activeTab, setActiveTab] = useState("activity")

  if (!agent) return <div>Agent not found</div>

  return (
    <div className="p-6 text-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">{agent.name}</h1>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-700" />
            <span>Created by {agent.creator}</span>
          </div>
          <div>last modified 2 minutes ago</div>
          <div>created 3 minutes ago</div>
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
                  <TableHead className="text-gray-400">Started</TableHead>
                  <TableHead className="text-gray-400">Progress</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agent.employees.map((employee, i) => (
                  <TableRow key={i} className="border-gray-800">
                    <TableCell className="text-gray-300">{employee.name}</TableCell>
                    <TableCell className="text-gray-400">{employee.started}</TableCell>
                    <TableCell className="text-gray-400">{employee.progress}</TableCell>
                    <TableCell className="text-gray-300">{employee.status}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
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
            <p className="text-gray-400">Workflow content goes here</p>
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
            <p className="text-gray-400">Settings content goes here</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

