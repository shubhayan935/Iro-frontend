"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, StopCircle } from "lucide-react"

interface RecordOnboardingProps {
  onFinish: (steps: string[]) => void
}

export function RecordOnboarding({ onFinish }: RecordOnboardingProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording])

  const startRecording = () => {
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Simulate AI processing
    setTimeout(() => {
      const generatedSteps = [
        "Introduction to company culture and values",
        "Setup of development environment",
        "Overview of project structure and architecture",
        "Introduction to team members and communication channels",
        "Review of coding standards and best practices",
      ]
      onFinish(generatedSteps)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Record Onboarding Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-gray-300 mb-2">
              {isRecording
                ? "Recording in progress... Narrate your onboarding process."
                : "Click 'Start Recording' and walk through your onboarding process."}
            </p>
            {isRecording && (
              <p className="text-red-500 font-semibold">
                Recording: {Math.floor(recordingTime / 60)}:{recordingTime % 60 < 10 ? "0" : ""}
                {recordingTime % 60}
              </p>
            )}
          </div>
          <div className="flex justify-center">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline" className="border-red-600 text-red-600">
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

