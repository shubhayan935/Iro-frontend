"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

type User = {
  email: string
  isAdmin: boolean
} | null

type UserContextType = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

