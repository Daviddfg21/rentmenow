import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, ArrowLeft, MapPin, Euro, Bed, Bath, FileText, Image, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateProperty = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    images: []
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type } = e.target
    
    // Limpiar el error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }

    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? '' : parseInt(value) || '') : value
    })
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres'
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres'
    }

    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria'
    }

    // Validar ciudad
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria'
    }

    // Validar precio
    if (!formData.price || formData.price === '') {
      newErrors.price = 'El precio es obligatorio'
    } else {
      const priceNum = parseFloat(formData.price)
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'El precio debe ser un número mayor a 0'
      } else if (priceNum < 50) {
        newErrors.price = 'El precio debe ser al menos €50'
      } else if (priceNum > 10000) {
        newErrors.price = 'El precio no puede ser mayor a €10,000'
      }
    }

    // Validar habitaciones
    if (!formData.bedrooms || formData.bedrooms < 1) {
      newErrors.bedrooms = 'Debe tener al menos 1 habitación'
    }

    // Validar baños
    if (!formData.bathrooms || formData.bathrooms < 1) {
      newErrors.bathrooms = 'Debe tener al menos 1 baño'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Ingresa la URL de la imagen:')
    if (url && url.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, url.trim()]
      })
    }
  }

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar formulario antes de enviar
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario')
      return
    }

    setLoading(true)

    try {
      // Preparar datos para envío
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms)
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        toast.success('¡Propiedad creada exitosamente!')
        window.location.href = '/properties'
      } else {
        const errorData = await response.text()
        toast.error(errorData || 'Error al crear la propiedad')
      }
    } catch (error) {
      toast.error('Error al crear la propiedad')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
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
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Propiedad *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Ej: Hermoso apartamento en el centro"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe tu propiedad, sus características y comodidades..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {formData.description.length}/20 caracteres mínimo
                  </p>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Image className="w-6 h-6 mr-2" />
                Imágenes de la Propiedad
              </h3>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors duration-300"
                >
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Agregar URL de imagen</p>
                  <p className="text-sm text-gray-500 mt-1">Haz clic para agregar una imagen desde una URL</p>
                </button>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEw3NCA2MUw2MSA3NEw3NCA4N0w4NyA3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K'
                          }}
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    Dirección *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                    placeholder="Calle y número"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="Ciudad"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
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
                    Precio por Mes (€) *
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`input-field pl-12 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="800"
                      min="50"
                      max="10000"
                      step="0.01"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Entre €50 y €10,000
                  </p>
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Habitaciones *
                  </label>
                  <div className="relative">
                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className={`input-field pl-12 ${errors.bedrooms ? 'border-red-500' : ''}`}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} habitación{num > 1 ? 'es' : ''}</option>
                      ))}
                    </select>
                  </div>
                  {errors.bedrooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                    Baños *
                  </label>
                  <div className="relative">
                    <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      id="bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className={`input-field pl-12 ${errors.bathrooms ? 'border-red-500' : ''}`}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} baño{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
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

            {/* Validation Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-red-800 font-semibold mb-2">
                  ⚠️ Por favor, corrige los siguientes errores:
                </h4>
                <ul className="text-red-700 text-sm space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
            <li>• Usa un título descriptivo y atractivo (mínimo 5 caracteres)</li>
            <li>• Escribe una descripción detallada (mínimo 20 caracteres)</li>
            <li>• Puedes agregar imágenes usando URLs de servicios como Imgur</li>
            <li>• Asegúrate de que el precio sea competitivo (€50 - €10,000)</li>
            <li>• Verifica que la dirección y ciudad sean correctas</li>
            <li>• Los campos marcados con * son obligatorios</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateProperty