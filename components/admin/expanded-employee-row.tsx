"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Employee {
  name: string
  email: string
  started: string
  progress: string
  status: string
  lastActivity: string
  nextStep: string
  notes: string
}

interface ExpandedEmployeeRowProps {
  employee: Employee
}

export function ExpandedEmployeeRow({ employee }: ExpandedEmployeeRowProps) {
  const progressPercentage =
    (Number.parseInt(employee.progress.split("/")[0]) /
      Number.parseInt(employee.progress.split("/")[1])) *
    100

  return (
    <div className="animate-fadeIn">
      <Card className="bg-card/40 border-border/10">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Email
              </h4>
              <p className="text-card-foreground">{employee.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Started
              </h4>
              <p className="text-card-foreground">{employee.started}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Progress
            </h4>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {employee.progress} steps completed
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Last Activity
            </h4>
            <p className="text-card-foreground">{employee.lastActivity}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Next Step
            </h4>
            <p className="text-card-foreground">{employee.nextStep}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Notes
            </h4>
            <p className="text-card-foreground">{employee.notes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
