import {createContext, useContext, useEffect, useState} from "react";
import {apiFetch, refreshSession, setAccessToken} from "../utils/client.js";

const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async() => {
      const session = await refreshSession()
      setUser(session ? session.user : null);
      setLoading(false)
    }
    restoreSession()
  }, [])

  const login = async (email, password) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({email, password})
    })
    const data = await res.json()
    if(!res.ok) throw new Error(data.error)
    setAccessToken(data.accessToken)
    setUser(data.user)
  }

  const register = async (name, email, password) => {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({name, email, password})
    })

    const data = await res.json()
    if(!res.ok) throw new Error(data.error)

    await login(email, password)
  }

  const logout = async() => {
    await apiFetch("/auth/logout", {
      method: "POST",
    })
    setAccessToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, loading, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth() {
  return useContext(AuthContext)
}