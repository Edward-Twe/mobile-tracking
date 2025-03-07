"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { loginApi } from "../services/api"

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [authData, userData] = await Promise.all([
          AsyncStorage.getItem('authState'),
          AsyncStorage.getItem('userData')
        ])
        
        if (authData) {
          setIsAuthenticated(JSON.parse(authData))
        }
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAuthState()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginApi(username, password)
      
      // Store user data
      await AsyncStorage.setItem("userData", JSON.stringify(response.user))
      await AsyncStorage.setItem("sessionId", response.sessionId)
      
      // Check if employeeId is defined before storing
      if (response.employeeId) {
        await AsyncStorage.setItem("employeeId", response.employeeId)
      }

      setUser(response.user)
      setIsAuthenticated(true)
      await AsyncStorage.setItem('authState', JSON.stringify(true))
      console.log("Login successful")
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("authToken")
      await AsyncStorage.removeItem("userData")
      setUser(null)
      setIsAuthenticated(false)
      await AsyncStorage.removeItem('authState')
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

