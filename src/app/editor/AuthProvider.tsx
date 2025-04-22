'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { initializeApp, getApps } from 'firebase/app'
import {
  GoogleAuthProvider,
  Unsubscribe,
  User,
  getAuth,
  signInWithPopup
} from 'firebase/auth'

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
  user: User | null
  loading: boolean
  authLoading: boolean
}>({
  login: () => null,
  signout: () => null,
  user: null,
  loading: true,
  authLoading: false
})

const provider = new GoogleAuthProvider()

const AuthProviderImpl = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const authSub = useRef<Unsubscribe[]>([])

  useEffect(() => {
    const auth = getAuth()
    const initAuth = async () => {
      authSub.current.push(
        auth.onIdTokenChanged((user) => {
          setUser(user)
        })
      )
      await auth.authStateReady()
      setUser(auth.currentUser)
      setLoading(false)
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
    setAuthLoading(true)
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.log('🚀 ~ login ~ error:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const signout = async () => {
    const auth = getAuth()
    await auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ login, user, loading, authLoading, signout }}
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
