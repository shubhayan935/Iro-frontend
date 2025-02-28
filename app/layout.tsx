import type React from "react"
import "./globals.css"
import { UserProvider } from "./context/UserContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen">
        <UserProvider>
            {/* Content */}
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
          </UserProvider>
        </div>
      </body>
    </html>
  )
}