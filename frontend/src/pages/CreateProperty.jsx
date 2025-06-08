import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Building, ArrowLeft, MapPin, Euro, Bed, Bath, FileText } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CreateProperty = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/api/properties', formData)
      toast.success('¡Propiedad creada exitosamente!')
      navigate('/properties')
    } catch (error) {
      toast.error(error.response?.data || 'Error al crear la propiedad')
    } finally {
      setLoading(false)
    }
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
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Crear Nueva Propiedad
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Completa la información para publicar tu propiedad en RentMeNow
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Propiedad
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ej: Hermoso apartamento en el centro"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Describe tu propiedad, sus características y comodidades..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Ubicación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Calle y número"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ciudad"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-2" />
                Detalles de la Propiedad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio por Mes (€)
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="input-field pl-12"
                      placeholder="800"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className="input-field pl-12"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} habitación{num > 1 ? 'es' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Baños
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className="input-field pl-12"
                      required
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} baño{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Building className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Creando...' : 'Crear Propiedad'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 p-6 bg-primary-50 rounded-xl"
        >
          <h4 className="text-lg font-semibold text-primary-800 mb-3">
            💡 Consejos para una buena publicación
          </h4>
          <ul className="text-primary-700 space-y-2 text-sm">
            <li>• Usa un título descriptivo y atractivo</li>
            <li>• Incluye todos los detalles importantes en la descripción</li>
            <li>• Asegúrate de que el precio sea competitivo</li>
            <li>• Verifica que la dirección sea correcta</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateProperty