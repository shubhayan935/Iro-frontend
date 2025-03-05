"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  Github,
  ExternalLink,
  Code,
  Brain,
  Sparkles,
  Zap,
  ChevronDown,
  Search,
  Terminal,
  MessageSquare
} from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  
  // Refs for each section
  const featuresRef = useRef<HTMLElement>(null)
  const demosRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLElement>(null)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      
      // Check which section is currently in view
      const sections = [
        { id: "demos", ref: demosRef },
        { id: "features", ref: featuresRef },
        { id: "pricing", ref: pricingRef }
      ]
      
      for (const section of sections) {
        if (section.ref.current) {
          const offsetTop = section.ref.current.offsetTop
          const offsetBottom = offsetTop + section.ref.current.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }
  
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header/Navigation */}
      <header className="fixed w-full top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-500" />
                <span className="text-white text-2xl font-bold">Iro</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-8">
                  <button 
                    onClick={() => scrollToSection("demos")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "demos" ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Demos
                  </button>
                  <button 
                    onClick={() => scrollToSection("features")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "features" ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection("pricing")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "pricing" ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Pricing
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white">Sign up</Button>
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#1a1a1a] shadow-lg rounded-b-lg mt-1">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button 
                  onClick={() => {
                    scrollToSection("demos")
                    setMobileMenuOpen(false)
                  }}
                  className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                >
                  Demos
                </button>
                <button 
                  onClick={() => {
                    scrollToSection("features")
                    setMobileMenuOpen(false)
                  }}
                  className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    scrollToSection("pricing")
                    setMobileMenuOpen(false)
                  }}
                  className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                >
                  Pricing
                </button>
                <Link href="#docs" className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium">
                  Docs
                </Link>
              </div>
              <div className="pt-4 pb-3 border-t border-white/10">
                <div className="px-3 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">Sign in</Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">Sign up</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-24 px-4 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundPosition: 'center',
          }} 
        />
        
        {/* Purple/Blue gradient blobs */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-600 opacity-20 rounded-full filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600 opacity-20 rounded-full filter blur-[128px]"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              {/* <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-sm font-medium mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-white">BACKED BY Y COMBINATOR</span>
                </div>
              </div> */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Iro: The Ultimate<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  AI Onboarding Platform
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-10">
                Bring your team up to speed with the best AI-powered onboarding platform. 
                Built to streamline your employee experience from day one to full productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-lg px-8 py-6 h-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="text-white bg-white/10 border-white/20 hover:bg-white/70 text-lg px-8 py-6 h-auto">
                  Book a Demo
                </Button>
              </div>
            </div>
            
            <div className="w-full max-w-lg">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-75 blur"></div>
                <div className="relative bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-xl p-2">
                  <div className="absolute top-2 left-2 flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="pt-6 p-4 bg-[#111] rounded-lg">
                    {/* Feature cards */}
                    {[
                      { icon: Code, title: "Code with Cline", desc: "AI-powered code assistant" },
                      { icon: Sparkles, title: "Predict with Supermaven", desc: "Smart predictions for your data" },
                      { icon: Brain, title: "Remember with MemoAI", desc: "Contextual organizational memory" },
                      { icon: Zap, title: "Build with Agents", desc: "Custom AI agents for your workflow" }
                    ].map((feature, index) => (
                      <div key={index} className="mb-4 p-3 bg-[#1a1a1a] rounded-lg border border-white/10 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <feature.icon className="h-5 w-5 text-blue-400" />
                          <div>
                            <div className="font-medium text-white">{feature.title}</div>
                            <div className="text-sm text-gray-400">{feature.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-16">
            <button 
              onClick={() => scrollToSection("demos")}
              className="text-white hover:text-blue-400 transition-colors animate-bounce"
            >
              <span className="sr-only">Scroll down</span>
              <ChevronDown className="h-8 w-8" />
            </button>
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section id="demos" ref={demosRef} className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See Iro in Action</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch how our AI tools can transform your workflow
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-xl">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center mb-5">
                    <Terminal className="h-6 w-6 text-blue-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">Code automatically with Iro Agent</h3>
                  </div>
                  <div className="bg-[#121212] rounded-lg p-4 h-[350px] relative flex items-center justify-center">
                    {/* Video placeholder - replace with actual video component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-blue-500/90 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-300">
                    Let Iro handle repetitive coding tasks and generate entire functions based on your requirements.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-xl">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="h-6 w-6 text-purple-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">Make specific in-line changes with Iro Chat</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="p-5 text-gray-300">
                  <p className="mb-4">Ask questions or generate code with the context of your codebase for more accurate results with Iro Chat - an AI chat assistant, powered by Continue.</p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-xl">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Code className="h-6 w-6 text-blue-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">No more tedious changes with Iro Chat</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="hidden p-5"></div>
              </div>
              
              <div className="rounded-lg overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-xl">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Search className="h-6 w-6 text-purple-400 mr-3" />
                      <h3 className="text-xl font-bold text-white">Research anything with Iro Search</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="hidden p-5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">AI-Powered Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create exceptional onboarding experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Pathways",
                description: "Custom onboarding paths for each team member based on role and experience.",
                icon: "✨"
              },
              {
                title: "Interactive Tutorials",
                description: "Step-by-step guidance with interactive elements to ensure knowledge retention.",
                icon: "🔍"
              },
              {
                title: "Progress Analytics",
                description: "Real-time insights into employee progress with actionable recommendations.",
                icon: "📊"
              },
              {
                title: "Automation Workflows",
                description: "Automate routine tasks and approvals to save valuable time and resources.",
                icon: "⚙️"
              },
              {
                title: "Smart Integration",
                description: "Seamlessly connects with your existing tools and systems for a unified experience.",
                icon: "🔗"
              },
              {
                title: "Global Support",
                description: "24/7 assistance and multilingual support for teams across different regions.",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-lg p-6 bg-[#1a1a1a] border border-white/10 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Business Section */}
      <section className="py-20 px-4 bg-[#0e0e0e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">Built for business</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Private */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors">
              <div className="h-32 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M8 9V5a2 2 0 012-2h4a2 2 0 012 2v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Private</h3>
              <p className="text-gray-400">Your data stays on your servers</p>
            </div>
            
            {/* Secure */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors">
              <div className="h-32 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-[#FF6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
              <p className="text-gray-400">End-to-end encryption</p>
            </div>
            
            {/* 24/7 Support */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors">
              <div className="h-32 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-[#4CD964]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">24/7 support</h3>
              <p className="text-gray-400">Dedicated support team of AI experts</p>
            </div>
            
            {/* Enterprise-grade */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors">
              <div className="h-32 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  <path d="M3 7h18" />
                  <path d="M7 11h2" />
                  <path d="M7 15h2" />
                  <path d="M15 11h2" />
                  <path d="M15 15h2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise-grade</h3>
              <p className="text-gray-400">Built for large organizations</p>
            </div>
            
            {/* Customizable */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 flex flex-col items-center text-center hover:bg-[#1e1e1e] transition-colors">
              <div className="h-32 flex items-center justify-center mb-8">
                <svg className="w-16 h-16 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Customizable</h3>
              <p className="text-gray-400">Tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for your team
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for small teams just getting started",
                features: [
                  "Up to 10 team members",
                  "Basic AI onboarding paths",
                  "Standard templates",
                  "Email support"
                ]
              },
              {
                name: "Professional",
                price: "$79",
                description: "Ideal for growing teams with specific needs",
                features: [
                  "Up to 50 team members",
                  "Advanced AI customization",
                  "Custom templates",
                  "Priority support",
                  "Advanced analytics"
                ],
                highlighted: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations with complex requirements",
                features: [
                  "Unlimited team members",
                  "Full AI capabilities",
                  "Custom integration",
                  "Dedicated support",
                  "Advanced security",
                  "SLA guarantees"
                ]
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-lg p-6 border ${
                  plan.highlighted 
                    ? "bg-gradient-to-b from-[#1a1a1a] to-[#1a1a1a] border-blue-500 shadow-lg shadow-blue-500/20" 
                    : "bg-[#1a1a1a] border-white/10"
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-400 ml-2">/month</span>}
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "bg-[#232323] hover:bg-[#2a2a2a] text-white"
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Us" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="relative p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your onboarding?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using Iro to create exceptional employee experiences.
            </p>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-3 h-auto">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="mt-20 pb-10 px-4 border-t border-white/10 pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Integrations</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Updates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">About</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Careers</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Guides</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Privacy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Terms</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-white font-semibold">Iro</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Iro Technologies. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}