"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState, LoginCredentials } from "./types"
import { supabase } from "@/lib/supabase/config.supabase"
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
     supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log("The full user is here finally:", session.user)
         setState({ user: session.user as User , loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
      }
    })
    const   { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth event:", event)
        if (event === "SIGNED_IN" && session?.user) {
          console.log("User signed in:", session.user)
          setState({ user: session.user as User , loading: false, error: null })
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out")
          setState({ user: null, loading: false, error: null })
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

 

  const signIn = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error
      if (!data.user) throw new Error("No user returned from sign in")

      console.log("Sign in successful:", data.user.email)
    } catch (error: any) {
      const errorMessage = error?.message || "Sign in failed"
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw new Error(errorMessage)
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setState({ user: null, loading: false, error: null })
    } catch (error: any) {
      console.error("Sign out error:", error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error?.message || "Sign out failed",
      }))
    }
  }

 
  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
