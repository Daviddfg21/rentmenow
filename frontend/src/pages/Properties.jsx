import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Euro, Bed, Bath, Grid, List, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import toast from 'react-hot-toast'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    available: 'all'
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      const data = await response.json()
      setProperties(data)
    } catch (error) {
      toast.error('Error al cargar las propiedades')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.city) {
      filtered = filtered.filter(property =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property =>
        parseFloat(property.price) >= parseFloat(filters.minPrice)
      )
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property =>
        parseFloat(property.price) <= parseFloat(filters.maxPrice)
      )
    }

    if (filters.bedrooms) {
      const bedroomsNum = parseInt(filters.bedrooms)
      if (!isNaN(bedroomsNum) && bedroomsNum > 0) {
        filtered = filtered.filter(property =>
          property.bedrooms >= bedroomsNum
        )
      }
    }

    if (filters.available !== 'all') {
      filtered = filtered.filter(property =>
        property.available === (filters.available === 'true')
      )
    }

    setFilteredProperties(filtered)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    
    // Validación especial para habitaciones
    if (name === 'bedrooms') {
      // Solo permitir números positivos
      if (value !== '' && (isNaN(value) || parseInt(value) < 0)) {
        return // No actualizar si es inválido
      }
    }
    
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      available: 'all'
    })
  }

  const handlePropertyClick = (propertyId) => {
    window.location.href = `/properties/${propertyId}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const uniqueCities = [...new Set(properties.map(p => p.city))].sort()

  // Componente para imagen con navegación en vista lista
  const PropertyImageCarousel = ({ property }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const hasImages = property.images && property.images.length > 0
    const hasMultiple = hasImages && property.images.length > 1

    const nextImage = (e) => {
      e.stopPropagation()
      if (hasMultiple) {
        setCurrentIndex((prev) => (prev + 1) % property.images.length)
      }
    }

    const prevImage = (e) => {
      e.stopPropagation()
      if (hasMultiple) {
        setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
      }
    }

    return (
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl overflow-hidden group">
        {hasImages ? (
          <>
            <img 
              src={property.images[currentIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center absolute top-0 left-0" style={{display: 'none'}}>
              <span className="text-white text-4xl font-bold">
                {property.title.charAt(0)}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {property.title.charAt(0)}
            </span>
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          {property.available ? (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Disponible
            </div>
          ) : (
            <>
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Ocupado
              </div>
              {property.occupiedUntil && (
                <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(property.occupiedUntil)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Encuentra tu Propiedad Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestra amplia selección de propiedades disponibles para alquilar
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Filter className="w-6 h-6 mr-2" />
              Filtros
            </h2>
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
            >
              Limpiar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Buscar por título, descripción o dirección..."
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Todas las ciudades</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                name="available"
                value={filters.available}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="all">Todas</option>
                <option value="true">Disponibles</option>
                <option value="false">Ocupadas</option>
              </select>
            </div>

            <div>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Precio mínimo"
                  className="input-field pl-12"
                  min="0"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Precio máximo"
                  className="input-field pl-12"
                  min="0"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  placeholder="Habitaciones mínimas"
                  className="input-field pl-12"
                  min="0"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {filteredProperties.length} Propiedades Encontradas
            </h3>
            <p className="text-gray-600 mt-1">
              {filteredProperties.filter(p => p.available).length} disponibles para alquilar
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros para encontrar más resultados
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Limpiar Filtros
            </button>
          </motion.div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <PropertyCard 
                    property={property} 
                    onClick={() => handlePropertyClick(property.id)}
                  />
                ) : (
                  <div 
                    className="card p-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <div className="md:w-1/3">
                      <PropertyImageCarousel property={property} />
                    </div>
                    
                    <div className="md:w-2/3 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800 hover:text-primary-600 transition-colors duration-300">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-primary-600 font-bold text-xl">
                          <Euro className="w-5 h-5 mr-1" />
                          <span>{property.price}/mes</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600">
                        {property.description}
                      </p>

                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.address}, {property.city}</span>
                      </div>

                      {!property.available && property.occupiedUntil && (
                        <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">
                            Disponible desde: {formatDate(property.occupiedUntil)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-5 h-5 mr-2" />
                            <span>{property.bedrooms} habitaciones</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-5 h-5 mr-2" />
                            <span>{property.bathrooms} baños</span>
                          </div>
                        </div>
                        
                        {property.categoryName && (
                          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                            {property.categoryName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Propietario: 
                          <span className="text-primary-600 hover:text-primary-700 ml-1 cursor-pointer font-medium">
                            {property.ownerUsername}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {property.available ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              Solicitar Alquiler
                            </span>
                          ) : (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                              Solicitar para Futuro
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties