import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error en el login' 
      }
    }
  }

  const register = async (userData) => {
    try {
      await api.post('/api/auth/register', userData)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Error en el registro' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}