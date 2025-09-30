import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Enhanced auth debug logging
  const debugAuth = (message, data = null) => {
    console.log(`[AUTH DEBUG] ${message}`, data);
  };

  // Isolated async operations - never called from auth callbacks
  const profileOperations = {
    async load(userId) {
      if (!userId) return
      setProfileLoading(true)
      try {
        debugAuth('Loading profile for user:', userId);
        const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
        if (!error) {
          setUserProfile(data)
          debugAuth('Profile loaded successfully:', data);
        } else {
          debugAuth('Profile load error:', error);
          setAuthError(`Profile load error: ${error?.message}`);
        }
      } catch (error) {
        console.error('Profile load error:', error)
        setAuthError(`Profile load failed: ${error?.message}`);
      } finally {
        setProfileLoading(false)
      }
    },

    clear() {
      setUserProfile(null)
      setProfileLoading(false)
      setAuthError(null)
      debugAuth('Profile cleared');
    }
  }

  // Auth state handlers - PROTECTED from async modification
  const authStateHandlers = {
    // This handler MUST remain synchronous - Supabase requirement
    onChange: (event, session) => {
      debugAuth('Auth state changed:', { event, hasSession: !!session, userId: session?.user?.id });
      setUser(session?.user ?? null)
      setLoading(false)
      setAuthError(null) // Clear errors on auth change
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id) // Fire-and-forget
      } else {
        profileOperations?.clear()
      }
    }
  }

  useEffect(() => {
    debugAuth('Initializing auth context');
    // Initial session check
    supabase?.auth?.getSession()?.then(({ data: { session }, error }) => {
      if (error) {
        debugAuth('Initial session error:', error);
        setAuthError(`Session error: ${error?.message}`);
      }
      authStateHandlers?.onChange(null, session)
    })

    // CRITICAL: This must remain synchronous
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    )

    return () => {
      debugAuth('Cleaning up auth subscription');
      subscription?.unsubscribe()
    }
  }, [])

  // Auth methods
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      debugAuth('Attempting sign in for:', email);
      const { data, error } = await supabase?.auth?.signInWithPassword({ email, password })
      
      if (error) {
        debugAuth('Sign in error:', error);
        setAuthError(error?.message);
      } else {
        debugAuth('Sign in successful:', data?.user?.email);
      }
      
      return { data, error }
    } catch (error) {
      const errorMsg = 'Network error. Please try again.';
      setAuthError(errorMsg);
      debugAuth('Sign in exception:', error);
      return { error: { message: errorMsg } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (!error) {
        setUser(null)
        profileOperations?.clear()
      }
      return { error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: 'No user logged in' } }
    
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      if (!error) setUserProfile(data)
      return { data, error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    authError, // Add auth error to context
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    // Add debug helper for components
    debugAuth: process.env?.NODE_ENV === 'development' ? debugAuth : () => {}
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}