import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import CreateProperty from './pages/CreateProperty'
import Rentals from './pages/Rentals'
import CreateRental from './pages/CreateRental'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import UserProfile from './pages/UserProfile'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    // Simple routing based on URL
    const path = window.location.pathname
    console.log('Current path:', path) // Para debug
    
    if (path === '/login') setCurrentPage('login')
    else if (path === '/register') setCurrentPage('register')
    else if (path === '/properties') setCurrentPage('properties')
    else if (path.startsWith('/properties/')) setCurrentPage('property-detail')
    else if (path === '/create-property') setCurrentPage('create-property')
    else if (path === '/rentals') setCurrentPage('rentals')
    else if (path.startsWith('/create-rental/')) setCurrentPage('create-rental')
    else if (path === '/admin') setCurrentPage('admin')
    else if (path === '/dashboard') setCurrentPage('dashboard')
    else if (path === '/profile') setCurrentPage('profile')
    else setCurrentPage('home')

    setLoading(false)
  }, [])

  // Escuchar cambios en la URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path === '/login') setCurrentPage('login')
      else if (path === '/register') setCurrentPage('register')
      else if (path === '/properties') setCurrentPage('properties')
      else if (path.startsWith('/properties/')) setCurrentPage('property-detail')
      else if (path === '/create-property') setCurrentPage('create-property')
      else if (path === '/rentals') setCurrentPage('rentals')
      else if (path.startsWith('/create-rental/')) setCurrentPage('create-rental')
      else if (path === '/admin') setCurrentPage('admin')
      else if (path === '/dashboard') setCurrentPage('dashboard')
      else if (path === '/profile') setCurrentPage('profile')
      else setCurrentPage('home')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      )
    }

    switch (currentPage) {
      case 'login':
        return <Login />
      case 'register':
        return <Register />
      case 'properties':
        return <Properties />
      case 'property-detail':
        return <PropertyDetail />
      case 'create-property':
        return isAuthenticated ? <CreateProperty /> : <Login />
      case 'rentals':
        return isAuthenticated ? <Rentals /> : <Login />
      case 'create-rental':
        return isAuthenticated ? <CreateRental /> : <Login />
      case 'admin':
        return isAuthenticated && user?.role === 'ADMIN' ? <AdminDashboard /> : <Home />
      case 'dashboard':
        return isAuthenticated ? <UserDashboard /> : <Login />
      case 'profile':
        return isAuthenticated ? <UserProfile username={user?.username} isOwnProfile={true} /> : <Login />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        {renderPage()}
      </div>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            borderRadius: '16px',
          },
        }}
      />
    </div>
  )
}

export default App