"use client"

import { useEffect, useRef, useState } from "react"

export function GradientBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [breathingPhase, setBreathingPhase] = useState(0)
  const [stars, setStars] = useState<Array<{
    x: number;
    y: number;
    size: number;
    opacity: number;
    pulse: number;
    initialX: number;
    initialY: number;
  }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate stars on mount
  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      const starCount = Math.floor(window.innerWidth * window.innerHeight / 6000) // Slightly fewer stars
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * 100
        const y = Math.random() * 100
        newStars.push({
          x,
          y,
          initialX: x,
          initialY: y,
          size: Math.random() * 1.5 + 0.5, // Slightly smaller stars
          opacity: Math.random() * 0.7 + 0.2, // Slightly reduced opacity
          pulse: Math.random() * 2 * Math.PI
        })
      }
      
      setStars(newStars)
    }
    
    generateStars()
    
    // Regenerate stars on window resize
    window.addEventListener('resize', generateStars)
    return () => window.removeEventListener('resize', generateStars)
  }, [])

  // Handle mouse movement with reduced effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // Calculate position relative to the container's dimensions
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        
        // Smooth transition for position changes with reduced speed
        setMousePosition(prev => ({
          x: prev.x + (x - prev.x) * 0.05, // Slower response
          y: prev.y + (y - prev.y) * 0.05
        }))
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Animation loop for breathing and star movement
  useEffect(() => {
    let animationFrameId: number
    let lastTime = 0
    
    const animate = (time: number) => {
      if (!lastTime) lastTime = time
      const deltaTime = time - lastTime
      lastTime = time
      
      // Update breathing phase - slower breath cycle (8 seconds)
      setBreathingPhase(prev => (prev + deltaTime * 0.0002) % (Math.PI * 2))
      
      // Update star positions based on mouse movement with reduced effect
      setStars(prevStars => {
        return prevStars.map(star => {
          // Calculate new position with reduced mouse influence
          // Reduced movement factor from 10 to 4
          const offsetX = (mousePosition.x - 0.5) * 4 * star.size
          const offsetY = (mousePosition.y - 0.5) * 4 * star.size
          
          return {
            ...star,
            x: star.initialX - offsetX,
            y: star.initialY - offsetY
          }
        })
      })
      
      // Add very subtle random movement to mouse position
      setMousePosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 0.0005, // Reduced random movement
        y: prev.y + (Math.random() - 0.5) * 0.0005
      }))
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [mousePosition.x, mousePosition.y])

  // Calculate breathing effect values with reduced intensity
  const breathingScale = 1 + Math.sin(breathingPhase) * 0.03 // Reduced from 0.05 to 0.03
  const breathingOpacity = 0.7 + Math.sin(breathingPhase) * 0.05 // Reduced from 0.1 to 0.05

  // Calculate nebula positions based on mouse coordinates with reduced effect
  // Reduce color movement by multiplying mousePosition by 0.5 instead of 1.0
  const primaryX = `${(0.5 + (mousePosition.x - 0.5) * 0.5) * 100}%`
  const primaryY = `${(0.5 + (mousePosition.y - 0.5) * 0.5) * 100}%`
  const secondaryX = `${(0.5 + (0.5 - mousePosition.x) * 0.5) * 100}%`
  const secondaryY = `${(0.5 + (0.5 - mousePosition.y) * 0.5) * 100}%`
  const tertiaryX = `${(0.5 + (mousePosition.x * 0.5 + 0.25 - 0.5) * 0.5) * 100}%`
  const tertiaryY = `${(0.5 + (mousePosition.y * 0.5 + 0.25 - 0.5) * 0.5) * 100}%`

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${primaryX} ${primaryY}, rgba(63, 94, 251, ${breathingOpacity}) 0%, rgba(63, 94, 251, 0) ${30 * breathingScale}%),
          radial-gradient(circle at ${secondaryX} ${secondaryY}, rgba(252, 70, 107, ${breathingOpacity}) 0%, rgba(252, 70, 107, 0) ${30 * breathingScale}%),
          radial-gradient(circle at ${tertiaryX} ${tertiaryY}, rgba(124, 58, 237, ${breathingOpacity}) 0%, rgba(124, 58, 237, 0) ${35 * breathingScale}%),
          radial-gradient(circle at ${100 - parseInt(tertiaryX)}% ${100 - parseInt(tertiaryY)}%, rgba(29, 78, 216, ${breathingOpacity * 0.6}) 0%, rgba(29, 78, 216, 0) ${40 * breathingScale}%),
          radial-gradient(circle at ${100 - parseInt(primaryX)}% ${parseInt(primaryY)}%, rgba(232, 121, 249, ${breathingOpacity * 0.5}) 0%, rgba(232, 121, 249, 0) ${35 * breathingScale}%),
          linear-gradient(to bottom right, #0f172a, #000 70%, #0b0f19),
          #000
        `,
        backgroundBlendMode: "screen, screen, screen, screen, screen, normal, normal",
        transition: "background 0.8s cubic-bezier(0.22, 1, 0.36, 1)", // Slower transition
      }}
    >
      {/* Nebula dust particles with reduced movement */}
      <div className="absolute inset-0 opacity-20" // Reduced opacity from 0.25 to 0.20
        style={{ 
          backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          backgroundPosition: `${mousePosition.x * 5}px ${mousePosition.y * 5}px`, // Reduced from 10 to 5
          transition: "background-position 0.8s ease" // Slower transition
        }} 
      />
      
      {/* Individual moving stars with reduced pulsing */}
      {stars.map((star, index) => {
        // Individual star pulsing effect with reduced intensity
        const starPulse = 1 + Math.sin(breathingPhase + star.pulse) * 0.15 // Reduced from 0.3 to 0.15
        return (
          <div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * starPulse}px`,
              height: `${star.size * starPulse}px`,
              opacity: star.opacity * (0.8 + Math.sin(breathingPhase + star.pulse) * 0.1), // Reduced from 0.2 to 0.1
              boxShadow: `0 0 ${star.size * starPulse * 1.5}px rgba(255, 255, 255, ${star.opacity * 0.7 * starPulse})`, // Reduced glow
              zIndex: 1
            }}
          />
        )
      })}
    </div>
  )
}