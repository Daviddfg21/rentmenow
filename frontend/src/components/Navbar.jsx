import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Building, Key, Plus, Settings, LogOut, Menu, X, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const navItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Propiedades', path: '/properties', icon: Building },
    ...(isAuthenticated ? [
      { name: 'Mis Alquileres', path: '/rentals', icon: Key },
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
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                RentMeNow
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.path} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-300"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.username}</span>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors duration-300">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="border-t pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user.username} - {user.role}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="border-t pt-2 mt-2 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar