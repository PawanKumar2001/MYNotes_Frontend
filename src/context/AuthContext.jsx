import { createContext, useContext, useState, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authorization-token'))

  const getUsername = useCallback(() => {
    const t = localStorage.getItem('authorization-token')
    if (!t) return 'User'
    try {
      const decoded = jwtDecode(t)
      const name = decoded.user?.name
      return name
        ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        : 'User'
    } catch {
      return 'User'
    }
  }, [])

  const login = useCallback((newToken) => {
    localStorage.setItem('authorization-token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authorization-token')
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, login, logout, getUsername }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
