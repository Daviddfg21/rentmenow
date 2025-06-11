import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Building, Key, Euro, Plus, TrendingUp, Calendar, 
  MapPin, Home, Settings, Percent, BarChart3, Target,
  CheckCircle, Clock, XCircle, Eye, Edit, Search, Check, X
} from 'lucide-react'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const [user, setUser] = useState(null)
  const [myProperties, setMyProperties] = useState([])
  const [myRentals, setMyRentals] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Estados para selección de propiedades
  const [selectedProperties, setSelectedProperties] = useState([])
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log('👤 Usuario cargado:', parsedUser)
        fetchUserData(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        toast.error('Error al cargar datos del usuario')
        setLoading(false)
      }
    } else {
      console.log('❌ No hay datos de usuario en localStorage')
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (userData) => {
    console.log('🔄 Iniciando fetchUserData para:', userData.username)
    setLoading(true)
    try {
      await Promise.all([
        fetchMyProperties(userData.username),
        fetchMyRentals(),
        fetchReceivedRequests()
      ])
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyProperties = async (username) => {
    try {
      console.log('🏠 Buscando propiedades de:', username)
      
      const response = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const allProperties = await response.json()
      console.log('📋 Todas las propiedades:', allProperties)
      
      const userProperties = allProperties.filter(p => p.ownerUsername === username)
      console.log('🏡 Propiedades del usuario:', userProperties)
      
      setMyProperties(userProperties)
      // Limpiar selecciones cuando se actualizan las propiedades
      setSelectedProperties([])
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Error al cargar propiedades')
    }
  }

  const fetchMyRentals = async () => {
    try {
      console.log('🔑 Obteniendo mis solicitudes...')
      
      const response = await fetch('/api/rentals/my-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const rentals = await response.json()
      console.log('📝 Mis solicitudes:', rentals)
      setMyRentals(rentals)
    } catch (error) {
      console.error('Error fetching rentals:', error)
      toast.error('Error al cargar solicitudes')
    }
  }

  const fetchReceivedRequests = async () => {
    try {
      console.log('📥 Obteniendo solicitudes recibidas...')
      
      const response = await fetch('/api/rentals/property-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const requests = await response.json()
      console.log('📨 Solicitudes recibidas:', requests)
      setReceivedRequests(requests)
    } catch (error) {
      console.error('Error fetching received requests:', error)
      toast.error('Error al cargar solicitudes recibidas')
    }
  }

  // Funciones para selección de propiedades
  const togglePropertySelection = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const selectAllProperties = () => {
    setSelectedProperties(myProperties.map(p => p.id))
  }

  const clearSelection = () => {
    setSelectedProperties([])
  }

  // Función de descuento mejorada con selección
  const handleApplyDiscountToSelected = async () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecciona al menos una propiedad')
      return
    }

    const discountNum = parseFloat(discountPercentage)
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 50) {
      toast.error('El descuento debe estar entre 0% y 50%')
      return
    }

    if (!window.confirm(`¿Aplicar ${discountPercentage}% de descuento a ${selectedProperties.length} propiedades seleccionadas?`)) {
      return
    }

    try {
      console.log('💰 Aplicando descuento del', discountPercentage, '% a', selectedProperties.length, 'propiedades')
      
      const discountFactor = 1 - (discountNum / 100)
      let updatedCount = 0
      
      const selectedPropsData = myProperties.filter(p => selectedProperties.includes(p.id))
      
      for (const property of selectedPropsData) {
        const newPrice = parseFloat((property.price * discountFactor).toFixed(2))
        
        const response = await fetch(`/api/properties/${property.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...property,
            price: newPrice
          })
        })

        if (response.ok) {
          updatedCount++
          console.log(`✅ Propiedad ${property.id} actualizada: €${property.price} → €${newPrice}`)
        } else {
          console.error(`❌ Error actualizando propiedad ${property.id}`)
        }
      }

      toast.success(`Descuento del ${discountPercentage}% aplicado a ${updatedCount} propiedades`)
      setShowDiscountModal(false)
      setDiscountPercentage('')
      setSelectedProperties([])
      
      if (user) {
        fetchMyProperties(user.username)
      }
    } catch (error) {
      console.error('Error aplicando descuento:', error)
      toast.error('Error al aplicar descuento')
    }
  }

  const handleToggleAvailability = async (propertyId, currentStatus) => {
    const newStatus = !currentStatus
    const action = newStatus ? 'disponible' : 'ocupada'
    
    if (!window.confirm(`¿Marcar esta propiedad como ${action}?`)) return

    try {
      console.log(`🔄 Cambiando disponibilidad de propiedad ${propertyId} a:`, newStatus)
      
      const property = myProperties.find(p => p.id === propertyId)
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...property,
          available: newStatus
        })
      })

      if (response.ok) {
        toast.success(`Propiedad marcada como ${action}`)
        if (user) {
          fetchMyProperties(user.username)
        }
      } else {
        toast.error('Error al cambiar disponibilidad')
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
      toast.error('Error al cambiar disponibilidad')
    }
  }

  // Estadísticas del usuario
  const totalRevenue = myProperties.reduce((sum, prop) => sum + parseFloat(prop.price || 0), 0)
  const averageRent = myProperties.length > 0 ? totalRevenue / myProperties.length : 0
  const availableProperties = myProperties.filter(p => p.available).length
  const occupiedProperties = myProperties.filter(p => !p.available).length
  const pendingRequests = receivedRequests.filter(r => r.status === 'PENDING').length
  const approvedRequests = receivedRequests.filter(r => r.status === 'APPROVED').length
  const myPendingRentals = myRentals.filter(r => r.status === 'PENDING').length
  const myApprovedRentals = myRentals.filter(r => r.status === 'APPROVED').length

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Estadísticas Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{myProperties.length}</div>
          <div className="text-gray-600">Mis Propiedades</div>
          <div className="text-sm text-gray-500 mt-2">
            {availableProperties} disponibles
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Euro className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">€{totalRevenue.toFixed(0)}</div>
          <div className="text-gray-600">Ingresos Potenciales</div>
          <div className="text-sm text-gray-500 mt-2">
            €{averageRent.toFixed(0)} promedio
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{pendingRequests}</div>
          <div className="text-gray-600">Solicitudes Pendientes</div>
          <div className="text-sm text-gray-500 mt-2">
            {approvedRequests} aprobadas
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{myRentals.length}</div>
          <div className="text-gray-600">Mis Solicitudes</div>
          <div className="text-sm text-gray-500 mt-2">
            {myApprovedRentals} aprobadas
          </div>
        </motion.div>
      </div>

      {/* Acciones Rápidas - SIN gestión de precios */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-2" />
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/create-property'}
            className="p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nueva Propiedad
          </button>
          <button
            onClick={() => setActiveTab('my-properties')}
            className="p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
          >
            <Building className="w-5 h-5 mr-2" />
            Gestionar Mis Propiedades
          </button>
          <button
            onClick={() => window.location.href = '/rentals'}
            className="p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center"
          >
            <Key className="w-5 h-5 mr-2" />
            Ver Solicitudes
          </button>
          <button
            onClick={() => window.location.href = '/properties'}
            className="p-4 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Buscar Propiedades para Alquilar
          </button>
        </div>
      </div>

      {/* Resumen de Actividad */}
      {(myRentals.length > 0 || receivedRequests.length > 0) && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRentals.slice(0, 3).map((rental) => (
              <div key={rental.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mr-3">
                  {getStatusIcon(rental.status)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Solicitud para {rental.propertyTitle}</p>
                  <p className="text-xs text-gray-500">{formatDate(rental.createdAt)}</p>
                </div>
              </div>
            ))}
            
            {receivedRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 mr-3">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{request.tenantUsername} solicita {request.propertyTitle}</p>
                  <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderMyProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">Mis Propiedades ({myProperties.length})</h3>
        <button
          onClick={() => window.location.href = '/create-property'}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar Propiedad
        </button>
      </div>

      {/* Herramientas de Selección y Descuento */}
      {myProperties.length > 0 && (
        <div className="card p-6 bg-yellow-50 border border-yellow-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Percent className="w-5 h-5 mr-2" />
            Gestión de Precios en Lote
          </h4>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={selectAllProperties}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Seleccionar Todas
            </button>
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Limpiar Selección
            </button>
            <button
              onClick={() => setShowDiscountModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              disabled={selectedProperties.length === 0}
            >
              Aplicar Descuento ({selectedProperties.length})
            </button>
          </div>
          
          {selectedProperties.length > 0 && (
            <div className="text-sm text-yellow-700">
              ✓ {selectedProperties.length} propiedades seleccionadas
            </div>
          )}
        </div>
      )}

      {myProperties.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No tienes propiedades publicadas
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza a generar ingresos publicando tu primera propiedad
          </p>
          <button 
            onClick={() => window.location.href = '/create-property'} 
            className="btn-primary"
          >
            Publicar Mi Primera Propiedad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties.map((property) => (
            <motion.div
              key={property.id}
              whileHover={{ y: -5 }}
              className={`card p-6 cursor-pointer transition-all duration-300 ${
                selectedProperties.includes(property.id) 
                  ? 'ring-2 ring-yellow-500 bg-yellow-50' 
                  : ''
              }`}
              onClick={() => togglePropertySelection(property.id)}
            >
              <div className="relative mb-4">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className="w-full h-48 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center" style={{display: property.images && property.images.length > 0 ? 'none' : 'flex'}}>
                  <Home className="w-12 h-12 text-white" />
                </div>
                
                <div className="absolute top-3 right-3 flex space-x-2">
                  {selectedProperties.includes(property.id) && (
                    <div className="bg-yellow-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {property.available ? 'Disponible' : 'Ocupada'}
                  </span>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">{property.title}</h4>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {property.city}
              </div>
              <div className="text-2xl font-bold text-green-600 mb-4">€{property.price}/mes</div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{property.bedrooms} hab</span>
                <span>{property.bathrooms} baños</span>
              </div>

              <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => window.location.href = `/properties/${property.id}`}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </button>
                <button
                  onClick={() => handleToggleAvailability(property.id, property.available)}
                  className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    property.available 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {property.available ? 'Marcar Ocupada' : 'Marcar Disponible'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Descuento */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Aplicar Descuento a {selectedProperties.length} Propiedades
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje de Descuento (0-50%)
              </label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ej: 10"
                min="0"
                max="50"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDiscountModal(false)
                  setDiscountPercentage('')
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyDiscountToSelected}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Aplicar Descuento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay datos de usuario</h2>
          <p className="text-gray-600 mb-4">No se pudieron cargar los datos del usuario.</p>
          <button onClick={() => window.location.href = '/login'} className="btn-primary">
            Ir a Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
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
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mi Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bienvenido {user?.firstName || user?.username}, gestiona tus propiedades y solicitudes
          </p>
        </motion.div>

        {/* Tabs - Solo 2 tabs ahora */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2 inline" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('my-properties')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'my-properties'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Building className="w-5 h-5 mr-2 inline" />
              Mis Propiedades ({myProperties.length})
            </button>
          </div>
        </div>

        {/* Content - Solo 2 contenidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'my-properties' && renderMyProperties()}
        </motion.div>

        {/* Información útil */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Consejos para maximizar tus ingresos
          </h4>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>• Usa fotos de alta calidad para atraer más inquilinos</li>
            <li>• Ajusta precios según la temporada y demanda</li>
            <li>• Responde rápidamente a las solicitudes de alquiler</li>
            <li>• Mantén actualizadas las descripciones de tus propiedades</li>
            <li>• Ofrece descuentos temporales para llenar vacantes rápido</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard