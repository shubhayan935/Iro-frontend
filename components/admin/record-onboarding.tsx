"use client"

import { useState, useRef, useEffect } from "react"
import { Reorder } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Mic, Video, X, Square, Loader2, Trash2 } from "lucide-react"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { deleteRecording, uploadRecording, updateAgentSteps, type OnboardingStep } from "@/lib/api"

interface RecordOnboardingProps {
  onFinish: (steps: OnboardingStep[]) => void
  // Optional agentId; if provided, reordering will update the DB
  agentId?: string
}

export function RecordOnboarding({ onFinish, agentId }: RecordOnboardingProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [processingStep, setProcessingStep] = useState(false)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [stepToDelete, setStepToDelete] = useState<number | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordingChunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [pollingInterval])

  const startRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always", displaySurface: "browser" },
        audio: true,
      })

      let micStream: MediaStream | null = null
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      } catch (err) {
        toast({
          title: "Microphone access denied",
          description: "Recording will continue without audio from microphone",
          variant: "destructive",
        })
      }

      const combinedStream = micStream
        ? new MediaStream([
            ...displayStream.getVideoTracks(),
            ...displayStream.getAudioTracks(),
            ...micStream.getAudioTracks(),
          ])
        : displayStream

      mediaStreamRef.current = combinedStream

      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: "video/webm;codecs=vp9,opus",
      })

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: "video/webm" })
        setRecordingBlob(blob)
        recordingChunksRef.current = []
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }

      mediaRecorderRef.current.start(1000)
      setIsRecording(true)

      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
      toast({
        title: "Recording failed",
        description:
          "Could not access screen recording. Please check permissions and try again.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const uploadRecordingHandler = async () => {
    if (!recordingBlob) {
      toast({
        title: "No recording to upload",
        description: "Please record your screen first.",
        variant: "destructive",
      })
      return
    }

    setProcessingStep(true)

    try {
      const { file_id } = await uploadRecording(recordingBlob, steps.length)

      const interval = setInterval(async () => {
        try {
          const metadataResponse = await fetch(`http://localhost:8000/recordings/${file_id}/metadata`)
          if (!metadataResponse.ok) {
            throw new Error("Failed to fetch metadata")
          }

          const metadata = await metadataResponse.json()

          if (metadata.extracted_steps && metadata.extracted_steps.length > 0) {
            const newSteps = metadata.extracted_steps.map((step: OnboardingStep) => ({
              ...step,
              recordingUrl: `http://localhost:8000/recordings/${file_id}`,
              _id: crypto.randomUUID() // Temporary ID for new steps
            }))

            setSteps((prevSteps) => [...prevSteps, ...newSteps])
            clearInterval(interval)
            setPollingInterval(null)
            setProcessingStep(false)
            setRecordingBlob(null)

            toast({
              title: "Processing complete",
              description: `Added ${newSteps.length} steps from your recording.`,
            })
          } else if (metadata.processing_error) {
            clearInterval(interval)
            setPollingInterval(null)
            setProcessingStep(false)

            toast({
              title: "Processing failed",
              description: metadata.processing_error,
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error polling for metadata:", error)
        }
      }, 3000)

      setPollingInterval(interval)
    } catch (error) {
      console.error("Error uploading recording:", error)
      setProcessingStep(false)
      toast({
        title: "Upload failed",
        description: "Could not upload recording. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleFinish = () => {
    onFinish(steps)
  }

  // Handler for when the steps are reordered via drag and drop.
  const handleReorder = async (newOrder: OnboardingStep[]) => {
    setSteps(newOrder)
    if (agentId) {
      try {
        await updateAgentSteps(agentId, newOrder)
        toast({
          title: "Success",
          description: "Steps order updated successfully.",
        })
      } catch (error) {
        console.error("Error updating steps order:", error)
        toast({
          title: "Error",
          description: "Failed to update steps order.",
          variant: "destructive",
        })
      }
    }
  }

  // Delete step functions remain the same
  const confirmDeleteStep = (index: number) => {
    setStepToDelete(index)
  }

  const handleDeleteStep = async () => {
    if (stepToDelete === null) return

    const stepToRemove = steps[stepToDelete]
    const newSteps = [...steps]
    newSteps.splice(stepToDelete, 1)
    setSteps(newSteps)

    if (stepToRemove.recordingUrl) {
      try {
        await deleteRecording(stepToRemove.recordingUrl)
      } catch (error) {
        console.error("Error deleting recording:", error)
      }
    }

    setStepToDelete(null)
  }

  const cancelDeleteStep = () => {
    setStepToDelete(null)
  }

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-card-foreground">
            Record Onboarding Steps
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFinish([])}
            className="text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="text-foreground text-lg mb-2">How to use</h3>
            <p className="text-muted-foreground mb-4">
              Simply record your screen while narrating the onboarding steps.
              Our AI will automatically extract step titles and descriptions
              from your recording.
            </p>

            {recordingBlob ? (
              <div className="flex items-center justify-between">
                <p className="text-card-foreground flex items-center">
                  <Video className="mr-2 h-4 w-4 text-yellow-500" />
                  Recording ready to process
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={uploadRecordingHandler}
                  disabled={processingStep}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {processingStep ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Process Recording</>
                  )}
                </Button>
              </div>
            ) : isRecording ? (
              <div className="flex items-center justify-between">
                <p className="text-destructive flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-destructive mr-2 animate-pulse"></span>
                  Recording: {formatTime(recordingTime)}
                </p>
                <Button variant="outline" size="sm" onClick={stopRecording}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">No recording yet</p>
                <Button variant="default" size="sm" onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              </div>
            )}
          </div>

          {/* Reorderable list of extracted steps */}
          {steps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-foreground text-lg">Extracted Steps</h3>
              <Reorder.Group
                axis="y"
                values={steps}
                onReorder={handleReorder}
                className="rounded-md bg-muted/40 p-1 space-y-1"
              >
                {steps.map((step, index) => (
                  <Reorder.Item
                    key={step._id || index}
                    value={step}
                    whileDrag={{ scale: 1.05 }}
                    className="flex items-center p-3 rounded-md transition-colors bg-card hover:bg-muted border border-border group"
                  >
                    {/* Grip icon as a visual drag handle */}
                    <div className="mr-2 cursor-grab select-none">
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M4 15h16" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-foreground font-medium">{step.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                        {step.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDeleteStep(index)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => onFinish([])}
              disabled={isRecording || processingStep}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinish}
              disabled={isRecording || processingStep || steps.length === 0}
            >
              {steps.length > 0 ? `Finish (${steps.length} steps)` : "Finish"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmation
        isOpen={stepToDelete !== null}
        title="Delete Onboarding Step"
        description="Are you sure you want to delete this step? This will also remove any associated recordings and cannot be undone."
        onConfirm={handleDeleteStep}
        onCancel={cancelDeleteStep}
      />
    </div>
  )
}
