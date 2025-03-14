"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/app/context/UserContext"
import { getAgent, type Agent, type OnboardingStep } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { 
  MinimizeIcon, 
  MaximizeIcon, 
  X, 
  Mic, 
  Video, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Lightbulb,
  Camera,
  ScreenShare,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  sendAssistantMessage,
  loadSessionState,
  saveSessionState,
  type AssistantMessage,
  type SessionState
} from "@/lib/assistant-api"

interface OnboardingAssistantProps {
  agentId: string
  onClose: () => void
}

export function OnboardingAssistant({ 
  agentId, 
  onClose 
}: OnboardingAssistantProps) {
  // State for the overlay UI
  const [isMinimized, setIsMinimized] = useState(false)
  const [size, setSize] = useState({ width: 'w-80', height: 'h-auto' })
  const [activeTab, setActiveTab] = useState<'guide' | 'chat'>('guide')
  const [userQuery, setUserQuery] = useState('')
  const [recording, setRecording] = useState<{
    active: boolean;
    stream: MediaStream | null;
    type: 'screen' | 'camera' | 'both';
  }>({
    active: false,
    stream: null,
    type: 'screen'
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [position, setPosition] = useState({
    x: 'auto',
    y: 'auto',
    right: '20px',
    bottom: '20px'
  })
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{x: number, y: number}>({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Fetch agent data
  const { data: agent } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => getAgent(agentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Current step data
  const currentStep = agent?.steps?.[currentStepIndex]

  // Load saved session state
  useEffect(() => {
    if (agent) {
      const savedState = loadSessionState(agentId)
      if (savedState) {
        setCurrentStepIndex(savedState.currentStepIndex)
        setCompletedSteps(savedState.completedSteps)
        setMessages(savedState.messages)
      } else {
        // Initialize with welcome message if no saved state
        setMessages([{
          role: 'assistant',
          content: `Hi there! I'm your onboarding assistant. I'll guide you through the ${agent.role} onboarding process. Let's start with: ${agent.steps?.[0]?.title || 'your onboarding'}`,
          timestamp: Date.now()
        }])
      }
    }
  }, [agent, agentId])

  // Save session state when relevant state changes
  useEffect(() => {
    if (agent && messages.length > 0) {
      const state: SessionState = {
        agentId,
        currentStepIndex,
        completedSteps,
        messages
      }
      saveSessionState(state)
    }
  }, [agent, agentId, currentStepIndex, completedSteps, messages])

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Make the assistant draggable
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    function handleMouseDown(e: MouseEvent) {
      if ((e.target as HTMLElement).closest('.handle')) {
        e.preventDefault()
        dragStartRef.current = { x: e.clientX, y: e.clientY }
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
    }
    
    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return
      
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      
      const rect = containerRef.current.getBoundingClientRect()
      
      setPosition({
        x: `${rect.left + dx}px`,
        y: `${rect.top + dy}px`,
        right: 'auto',
        bottom: 'auto'
      })
    }
    
    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    container.addEventListener('mousedown', handleMouseDown)
    
    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Cleanup MediaStream when unmounted
  useEffect(() => {
    return () => {
      if (recording.stream) {
        recording.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [recording.stream])

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!userQuery.trim() || !currentStep) return
    
    // Add user message to the chat
    const userMessage: AssistantMessage = {
      role: 'user',
      content: userQuery,
      timestamp: Date.now()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Clear the input
    setUserQuery('')
    
    // Show loading state
    setIsLoading(true)
    
    try {
      // Send message to assistant
      const response = await sendAssistantMessage(userQuery, {
        agentId,
        currentStep,
        currentStepIndex,
        previousMessages: messages
      })
      
      // Add assistant response
      setMessages(prev => [...prev, response])
      
      // Check if message indicates completion
      if (response.content.toLowerCase().includes('mark this step as complete')) {
        goToNextStep()
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error getting response:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.", 
        timestamp: Date.now()
      }])
      setIsLoading(false)
    }
  }

  // Handle keypress for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle step navigation
  const goToNextStep = () => {
    if (agent?.steps && currentStepIndex < agent.steps.length - 1) {
      // Mark current step as completed
      if (currentStep?._id) {
        setCompletedSteps(prev => [...prev.includes(currentStep._id as string) ? prev : [...prev, currentStep._id as string]])
      }
      
      // Go to next step
      setCurrentStepIndex(prev => prev + 1)
      
      // Add a transition message
      const nextStep = agent.steps[currentStepIndex + 1]
      if (nextStep) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Great! Let's move on to the next step: ${nextStep.title}`,
          timestamp: Date.now()
        }])
      }
    } else if (agent?.steps && currentStepIndex === agent.steps.length - 1) {
      // Complete the onboarding
      if (currentStep?._id) {
        setCompletedSteps(prev => [...prev.includes(currentStep._id as string) ? prev : [...prev, currentStep._id as string]])
      }
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Congratulations! You've completed all the onboarding steps. Is there anything else you'd like help with?",
        timestamp: Date.now()
      }])
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1)
      
      // Add a transition message
      const prevStep = agent?.steps?.[currentStepIndex - 1]
      if (prevStep) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Let's go back to: ${prevStep.title}`,
          timestamp: Date.now()
        }])
      }
    }
  }

  // Toggle between expanded and minimized states
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  // Calculate progress percentage
  const progressPercentage = agent?.steps 
    ? (completedSteps.length / agent.steps.length) * 100
    : 0

  // Start screen recording
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: true
      })
      
      setRecording({
        active: true,
        stream,
        type: 'screen'
      })
      
      // Connect the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      // Add message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm now watching your screen. I'll guide you through the process. What would you like to do first?",
        timestamp: Date.now()
      }])
      
      // Handle when the user stops sharing
      stream.getVideoTracks()[0].onended = () => {
        stopRecording()
      }
    } catch (error) {
      console.error('Error starting screen recording:', error)
      toast({
        title: "Couldn't access screen",
        description: "Please allow screen sharing to continue with the onboarding.",
        variant: "destructive"
      })
    }
  }
  
  // Start camera recording
  const startCameraRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setRecording({
        active: true,
        stream,
        type: 'camera'
      })
      
      // Connect the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error('Error starting camera recording:', error)
      toast({
        title: "Couldn't access camera",
        description: "Please allow camera access to continue with the onboarding.",
        variant: "destructive"
      })
    }
  }
  
  // Stop recording
  const stopRecording = () => {
    if (recording.stream) {
      recording.stream.getTracks().forEach(track => track.stop())
    }
    
    setRecording({
      active: false,
      stream: null,
      type: 'screen'
    })
    
    // Clear the video
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // If in minimized state, show just the floating icon
  if (isMinimized) {
    return (
      <button
        onClick={toggleMinimize}
        className="fixed z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        style={{
          right: '20px',
          bottom: '20px'
        }}
      >
        <Sparkles className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-lg shadow-xl bg-card border border-border",
        size.width,
        size.height,
        recording.active ? "w-auto" : ""
      )}
      style={{
        right: position.right,
        bottom: position.bottom,
        left: position.x,
        top: position.y,
        resize: 'both'
      }}
    >
      {/* Header - Draggable */}
      <div className="handle flex items-center justify-between p-3 bg-primary text-primary-foreground cursor-move">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="font-medium">AI Onboarding Assistant</span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={toggleMinimize}>
            <MinimizeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content and video area */}
      <div className="flex">
        {/* Video container for screen or camera recording */}
        {recording.active && (
          <div className="relative">
            <video 
              ref={videoRef} 
              className={cn(
                "object-cover",
                recording.type === 'screen' ? "w-96 h-auto" : "w-48 h-auto"
              )}
              muted
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
              onClick={stopRecording}
            >
              <X className="h-4 w-4 mr-1" /> Stop
            </Button>
          </div>
        )}
        
        {/* Assistant container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button 
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium",
                activeTab === 'guide' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('guide')}
            >
              Guide
            </button>
            <button 
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium",
                activeTab === 'chat' 
                  ? "border-b-2 border-primary text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>
          
          {/* Guide Tab Content */}
          {activeTab === 'guide' && (
            <div className="flex-1 overflow-y-auto p-4">
              {agent && currentStep ? (
                <>
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Step {currentStepIndex + 1} of {agent.steps?.length || 0}
                    </div>
                    <Progress value={progressPercentage} className="h-1.5 mb-2" />
                    <h3 className="text-lg font-semibold mb-1">{currentStep.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                  </div>
                  
                  {/* Recording/screen sharing buttons */}
                  {!recording.active && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex flex-col gap-1 h-auto py-3"
                        onClick={startScreenRecording}
                      >
                        <ScreenShare className="h-4 w-4" />
                        <span className="text-xs">Share Screen</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex flex-col gap-1 h-auto py-3"
                        onClick={startCameraRecording}
                      >
                        <Camera className="h-4 w-4" />
                        <span className="text-xs">Turn on Camera</span>
                      </Button>
                    </div>
                  )}
                  
                  {/* Recording active message */}
                  {recording.active && (
                    <div className="bg-primary/10 rounded-md p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <span>{recording.type === 'screen' ? 'Screen sharing' : 'Camera'} active</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        I can now see your {recording.type} and guide you more effectively.
                      </p>
                    </div>
                  )}
                  
                  {/* Step guidance */}
                  <div className="space-y-3 mb-4">
                    {/* If there's a recording link */}
                    {currentStep.recordingUrl && (
                      <div className="bg-muted/50 rounded-md p-3">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Video className="h-4 w-4 text-primary" />
                          <span>Watch demonstration</span>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(currentStep.recordingUrl, '_blank')}
                        >
                          View Recording
                        </Button>
                      </div>
                    )}
                    
                    {/* Assistant tips */}
                    <div className="bg-primary/10 rounded-md p-3">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <span>Assistant Tip</span>
                      </div>
                      <p className="text-sm">
                        Share your screen so I can guide you through this process step by step. 
                        I'll be able to see exactly what you're doing and provide real-time assistance.
                      </p>
                    </div>
                  </div>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={goToPreviousStep}
                      disabled={currentStepIndex === 0}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={goToNextStep}
                    >
                      {currentStepIndex < (agent.steps?.length || 0) - 1 ? (
                        <>
                          Next
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Complete
                          <CheckCircle className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">Loading onboarding guide...</p>
                </div>
              )}
            </div>
          )}
          
          {/* Chat Tab Content */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              {/* Chat messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex", 
                      message.role === 'assistant' ? "justify-start" : "justify-end"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                        message.role === 'assistant' 
                          ? "bg-muted text-foreground rounded-tl-none" 
                          : "bg-primary text-primary-foreground rounded-tr-none"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted max-w-[85%] rounded-lg px-3 py-2 text-sm rounded-tl-none">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about this step..."
                    className="min-h-9 resize-none"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    size="icon" 
                    disabled={!userQuery.trim() || isLoading}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}