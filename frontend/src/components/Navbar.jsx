import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Building, Key, Plus, Settings, LogOut, Menu, X, User, ChevronDown, BarChart3 } from 'lucide-react'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        setIsAdmin(parsedUser.role === 'ADMIN')
      } catch (error) {
        // Si hay error, limpiar datos corruptos
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    setIsOpen(false)
    setUserMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUserMenuOpen(false)
    setIsOpen(false)
    window.location.href = '/'
  }

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Propiedades', path: '/properties', icon: Building },
    ...(isAuthenticated ? [
      { name: 'Mi Dashboard', path: '/dashboard', icon: BarChart3 },
      { name: 'Solicitudes', path: '/rentals', icon: Key }, // CAMBIADO DE "Mis Alquileres" A "Solicitudes"
      { name: 'Crear Propiedad', path: '/create-property', icon: Plus },
      ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: Settings }] : [])
    ] : [])
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <button onClick={() => navigateTo('/')} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                RentMeNow
              </span>
            </button>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.path} whileHover={{ y: -2 }}>
                <button
                  onClick={() => navigateTo(item.path)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-300"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium">{user?.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                            <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                              {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => navigateTo('/dashboard')}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300 w-full text-left"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>Mi Dashboard</span>
                        </button>
                        <button
                          onClick={() => navigateTo('/profile')}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300 w-full text-left"
                        >
                          <User className="w-4 h-4" />
                          <span>Mi Perfil</span>
                        </button>
                        <button
                          onClick={() => navigateTo('/rentals')}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300 w-full text-left"
                        >
                          <Key className="w-4 h-4" />
                          <span>Solicitudes</span>
                        </button>
                        <button
                          onClick={() => navigateTo('/create-property')}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300 w-full text-left"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Crear Propiedad</span>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => navigateTo('/admin')}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300 w-full text-left"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Panel Admin</span>
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigateTo('/login')} 
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => navigateTo('/register')} 
                  className="btn-primary"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 w-full text-left"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
              
              {isAuthenticated ? (
                <div className="border-t pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user?.username} - {user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </div>
                  <button
                    onClick={() => navigateTo('/profile')}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-all duration-300 w-full text-left"
                  >
                    <User className="w-4 h-4" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <div className="border-t pt-2 mt-2 space-y-1">
                  <button
                    onClick={() => navigateTo('/login')}
                    className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-all duration-300 w-full text-left"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigateTo('/register')}
                    className="block px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300 w-full text-left"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar