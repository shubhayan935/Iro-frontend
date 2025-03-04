"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { type User, loginUser } from "@/lib/api"

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const loggedInUser = await loginUser(email, password)
    setUser(loggedInUser)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
    return loggedInUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <UserContext.Provider value={{ user, setUser, login, logout }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

