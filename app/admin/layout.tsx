import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"
import Image from "next/image"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Content with background overlay */}
      <div className="flex w-full h-full relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}