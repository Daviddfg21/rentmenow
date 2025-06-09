import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Bed, Bath, Euro, User, Calendar, 
  Key, Edit, Trash2, AlertCircle, CheckCircle, ChevronLeft, ChevronRight 
} from 'lucide-react'

const PropertyDetail = () => {
  const [property, setProperty] = useState(null)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [message, setMessage] = useState('')

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

    // Get property ID from URL
    const pathParts = window.location.pathname.split('/')
    const propertyId = pathParts[pathParts.length - 1]
    
    if (propertyId && !isNaN(propertyId)) {
      fetchProperty(propertyId)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProperty = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
      } else {
        setMessage('Error al cargar la propiedad')
        setTimeout(() => {
          window.location.href = '/properties'
        }, 2000)
      }
    } catch (error) {
      setMessage('Error al cargar la propiedad')
      setTimeout(() => {
        window.location.href = '/properties'
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        setMessage('Propiedad eliminada exitosamente')
        setTimeout(() => {
          window.location.href = '/properties'
        }, 1000)
      } else {
        setMessage('Error al eliminar la propiedad')
      }
    } catch (error) {
      setMessage('Error al eliminar la propiedad')
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleRentRequest = () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    window.location.href = `/create-rental/${property.id}`
  }

  const nextImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const canEdit = user && (user.username === property?.ownerUsername || user.role === 'ADMIN')
  const canRent = isAuthenticated && property?.available && user?.username !== property?.ownerUsername

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {message && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{message}</p>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h2>
          <button onClick={() => window.location.href = '/properties'} className="btn-primary">
            Volver a Propiedades
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      {/* Toast Message */}
      {message && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`shadow-lg rounded-xl p-4 border-l-4 max-w-md ${
            message.includes('Error') ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
          }`}>
            <p className={message.includes('Error') ? 'text-red-800' : 'text-green-800'}>{message}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-2xl mb-8"
            >
              <div className="relative h-96 group">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img 
                      src={property.images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="h-96 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-white text-8xl font-bold">
                        {property.title.charAt(0)}
                      </span>
                    </div>
                    
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-96 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <span className="text-white text-8xl font-bold">
                      {property.title.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="absolute top-6 right-6">
                  {property.available ? (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Disponible
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Ocupado
                      </div>
                      {property.occupiedUntil && (
                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Hasta: {formatDate(property.occupiedUntil)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card p-8 mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 text-lg">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.address}, {property.city}</span>
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-300">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Bed className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Habitaciones</p>
                    <p className="text-2xl font-bold text-gray-800">{property.bedrooms}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Bath className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Baños</p>
                    <p className="text-2xl font-bold text-gray-800">{property.bathrooms}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Euro className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Precio/mes</p>
                    <p className="text-2xl font-bold text-gray-800">€{property.price}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Descripción</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Propietario</p>
                    <button 
                      onClick={() => window.location.href = `/profile/${property.ownerUsername}`}
                      className="font-semibold text-gray-800 hover:text-primary-600 transition-colors duration-300"
                    >
                      {property.ownerUsername}
                    </button>
                  </div>
                </div>
                
                {property.categoryName && (
                  <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-medium">
                    {property.categoryName}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  €{property.price}
                </div>
                <p className="text-gray-600">por mes</p>
              </div>

              {canRent || !property.available ? (
                <div className="space-y-4">
                  <button
                    onClick={handleRentRequest}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    {property.available ? 'Solicitar Alquiler' : 'Solicitar para Futuro'}
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    {property.available 
                      ? 'Envía una solicitud al propietario'
                      : `Disponible desde: ${formatDate(property.occupiedUntil)}`
                    }
                  </p>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => window.location.href = '/login'} 
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    Iniciar Sesión para Solicitar
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    Necesitas una cuenta para solicitar alquileres
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
                    Esta es tu propiedad
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    No puedes solicitar el alquiler de tu propia propiedad
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Detalles de la Propiedad</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${
                      property.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {property.available ? 'Disponible' : 'Ocupado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Habitaciones:</span>
                    <span className="font-medium text-gray-800">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Baños:</span>
                    <span className="font-medium text-gray-800">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ciudad:</span>
                    <span className="font-medium text-gray-800">{property.city}</span>
                  </div>
                  {property.categoryName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-medium text-gray-800">{property.categoryName}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail