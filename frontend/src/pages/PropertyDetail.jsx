import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Bed, Bath, Euro, User, Calendar, 
  Key, Edit, Trash2, AlertCircle, CheckCircle 
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/api/properties/${id}`)
      setProperty(response.data)
    } catch (error) {
      toast.error('Error al cargar la propiedad')
      navigate('/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return
    }

    try {
      await api.delete(`/api/properties/${id}`)
      toast.success('Propiedad eliminada exitosamente')
      navigate('/properties')
    } catch (error) {
      toast.error('Error al eliminar la propiedad')
    }
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h2>
          <Link to="/properties" className="btn-primary">
            Volver a Propiedades
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(-1)}
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
              <div className="h-96 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <span className="text-white text-8xl font-bold">
                  {property.title.charAt(0)}
                </span>
              </div>
              <div className="absolute top-6 right-6">
                {property.available ? (
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Disponible
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Ocupado
                  </div>
                )}
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
                    <p className="font-semibold text-gray-800">{property.ownerUsername}</p>
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

              {canRent ? (
                <div className="space-y-4">
                  <Link
                    to={`/create-rental/${property.id}`}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    Alquilar Ahora
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    Contacta al propietario para más información
                  </p>
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-4">
                  <Link to="/login" className="w-full btn-primary flex items-center justify-center">
                    Iniciar Sesión para Alquilar
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    Necesitas una cuenta para alquilar propiedades
                  </p>
                </div>
              ) : !property.available ? (
                <div className="text-center">
                  <div className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-semibold">
                    Propiedad No Disponible
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Esta propiedad está actualmente ocupada
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold">
                    Esta es tu propiedad
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    No puedes alquilar tu propia propiedad
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