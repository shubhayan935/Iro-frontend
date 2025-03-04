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
    (Number.parseInt(employee.progress.split("/")[0]) / Number.parseInt(employee.progress.split("/")[1])) * 100

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400">Email</h4>
            <p className="text-gray-200">{employee.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400">Started</h4>
            <p className="text-gray-200">{employee.started}</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Progress</h4>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-gray-400 mt-1">{employee.progress} steps completed</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400">Last Activity</h4>
          <p className="text-gray-200">{employee.lastActivity}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400">Next Step</h4>
          <p className="text-gray-200">{employee.nextStep}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-400">Notes</h4>
          <p className="text-gray-200">{employee.notes}</p>
        </div>
      </CardContent>
    </Card>
  )
}

