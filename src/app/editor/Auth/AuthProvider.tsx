'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import {
  GoogleAuthProvider,
  Unsubscribe,
  User,
  getAuth,
  signInWithPopup
} from 'firebase/auth'
import { useObservable } from '@legendapp/state/react'
import {
  ObservableHint,
  type OpaqueObject,
  type Observable,
  type ObservableBoolean
} from '@legendapp/state'

if (typeof window !== 'undefined' && !getApps().length) {
  if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    throw new Error('NEXT_PUBLIC_FIREBASE_CONFIG has not been setup')
  }
  const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)

  initializeApp(firebaseConfig)
}

const AuthContext = createContext<{
  login: () => void
  signout: () => void
  user$: Observable<OpaqueObject<User> | null>
  loading$: ObservableBoolean
  authLoading$: ObservableBoolean
}>(undefined as any)

const provider = new GoogleAuthProvider()

const AuthProviderImpl = ({ children }: React.PropsWithChildren) => {
  const user$ = useObservable<OpaqueObject<User> | null>(null)
  const loading$ = useObservable(true)
  const authLoading$ = useObservable(false)
  const authSub = useRef<Unsubscribe[]>([])

  useEffect(() => {
    const auth = getAuth()
    const initAuth = async () => {
      authSub.current.push(
        auth.onIdTokenChanged((user) => {
          user$.set(user ? ObservableHint.opaque(user) : null)
        })
      )
      await auth.authStateReady()

      user$.set(
        auth.currentUser ? ObservableHint.opaque(auth.currentUser) : null
      )

      loading$.set(false)
    }

    initAuth()

    return () => {
      if (authSub.current.length) {
        const totalSub = authSub.current.length
        for (let i = 0; i < totalSub; i++) authSub.current.pop()?.()
      }
    }
  }, [])

  const login = async () => {
    const auth = getAuth()
    authLoading$.set(true)
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.log('🚀 ~ login ~ error:', error)
    } finally {
      authLoading$.set(false)
    }
  }

  const signout = async () => {
    const auth = getAuth()
    await auth.signOut()

    // Clear storage
    localStorage.clear()
    const databases = await indexedDB.databases()
    databases.forEach((db) => {
      if (db.name) indexedDB.deleteDatabase(db.name)
    })
  }

  return (
    <AuthContext.Provider
      value={{ login, user$, loading$, authLoading$, signout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  return <AuthProviderImpl>{children}</AuthProviderImpl>
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext)
