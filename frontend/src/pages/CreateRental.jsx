import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Key, Calendar, Euro, Building, User } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CreateRental = () => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    monthlyRent: ''
  })

  useEffect(() => {
    fetchProperty()
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/api/properties/${propertyId}`)
      setProperty(response.data)
      setFormData(prev => ({
        ...prev,
        monthlyRent: response.data.price
      }))
    } catch (error) {
      toast.error('Error al cargar la propiedad')
      navigate('/properties')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const rentalData = {
      propertyId: parseInt(propertyId),
      tenantId: user.id,
      ...formData,
      monthlyRent: parseFloat(formData.monthlyRent)
    }

    try {
      await api.post('/api/rentals', rentalData)
      toast.success('¡Alquiler creado exitosamente!')
      navigate('/rentals')
    } catch (error) {
      toast.error(error.response?.data || 'Error al crear el alquiler')
    } finally {
      setLoading(false)
    }
  }

  const validateDates = () => {
    if (!formData.startDate || !formData.endDate) return true
    
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return start >= today && end > start
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMinEndDate = () => {
    if (!formData.startDate) return getMinDate()
    const startDate = new Date(formData.startDate)
    startDate.setDate(startDate.getDate() + 1)
    return startDate.toISOString().split('T')[0]
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!property.available) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Esta propiedad no está disponible
          </h2>
          <button 
            onClick={() => navigate('/properties')}
            className="btn-primary"
          >
            Buscar Otras Propiedades
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Crear Alquiler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Completa los detalles para alquilar esta propiedad
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-2" />
              Detalles de la Propiedad
            </h3>

            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {property.title.charAt(0)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {property.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  {property.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Dirección:</span>
                  <p className="font-medium text-gray-800">{property.address}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Ciudad:</span>
                  <p className="font-medium text-gray-800">{property.city}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Habitaciones:</span>
                  <p className="font-medium text-gray-800">{property.bedrooms}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600">Baños:</span>
                  <p className="font-medium text-gray-800">{property.bathrooms}</p>
                </div>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center text-primary-600 mb-2">
                  <User className="w-5 h-5 mr-2" />
                  <span className="font-medium">Propietario</span>
                </div>
                <p className="text-primary-800 font-semibold">{property.ownerUsername}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center text-green-600 mb-2">
                  <Euro className="w-5 h-5 mr-2" />
                  <span className="font-medium">Precio por mes</span>
                </div>
                <p className="text-2xl font-bold text-green-800">€{property.price}</p>
              </div>
            </div>
          </motion.div>

          {/* Rental Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card p-6"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Detalles del Alquiler
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={getMinEndDate()}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-2">
                  Renta Mensual (€)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    id="monthlyRent"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    className="input-field pl-12"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Precio sugerido: €{property.price}
                </p>
              </div>

              {/* Rental Summary */}
              {formData.startDate && formData.endDate && formData.monthlyRent && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Resumen del Alquiler</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Inquilino:</span>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duración:</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} días
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Renta mensual:</span>
                      <span className="font-medium">€{formData.monthlyRent}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Validation Messages */}
              {!validateDates() && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">
                    ⚠️ Las fechas no son válidas. La fecha de inicio debe ser hoy o posterior, y la fecha de fin debe ser posterior a la de inicio.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancelar
                </button>
                <motion.button
                  type="submit"
                  disabled={loading || !validateDates()}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Key className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Creando...' : 'Crear Alquiler'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl"
        >
          <h4 className="text-lg font-semibold text-yellow-800 mb-3">
            📋 Información Importante
          </h4>
          <ul className="text-yellow-700 space-y-2 text-sm">
            <li>• Al crear el alquiler, la propiedad se marcará como no disponible</li>
            <li>• El propietario será notificado de tu solicitud de alquiler</li>
            <li>• Revisa cuidadosamente las fechas antes de confirmar</li>
            <li>• Puedes modificar la renta mensual si has acordado un precio diferente</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateRental