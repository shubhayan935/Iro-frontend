import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { UserProvider } from "./context/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Iro",
  description: "AI Onboarding Manager - Streamline your employee onboarding process with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}



import './globals.css'