import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Building, Key, Euro, Plus, TrendingUp, Calendar, 
  MapPin, Home, Settings, Percent, BarChart3, Target,
  CheckCircle, Clock, XCircle, Eye, Edit, Search
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const [user, setUser] = useState(null)
  const [myProperties, setMyProperties] = useState([])
  const [myRentals, setMyRentals] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchMyProperties(),
        fetchMyRentals(),
        fetchReceivedRequests()
      ])
    } catch (error) {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyProperties = async () => {
    try {
      const response = await api.get('/api/properties')
      const allProperties = response.data
      const userProperties = allProperties.filter(p => p.ownerUsername === user?.username)
      setMyProperties(userProperties)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const fetchMyRentals = async () => {
    try {
      const response = await api.get('/api/rentals/my-requests')
      setMyRentals(response.data)
    } catch (error) {
      console.error('Error fetching rentals:', error)
    }
  }

  const fetchReceivedRequests = async () => {
    try {
      const response = await api.get('/api/rentals/property-requests')
      setReceivedRequests(response.data)
    } catch (error) {
      console.error('Error fetching received requests:', error)
    }
  }

  // Funciones de usuario para gestionar sus propiedades
  const handleDiscountToMyProperties = async () => {
    if (myProperties.length === 0) {
      toast.error('No tienes propiedades para aplicar descuento')
      return
    }

    const discount = prompt('¿Qué porcentaje de descuento quieres aplicar a todas tus propiedades? (0-50):')
    if (!discount) return

    const discountNum = parseFloat(discount)
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 50) {
      toast.error('El descuento debe estar entre 0% y 50%')
      return
    }

    if (!window.confirm(`¿Aplicar ${discount}% de descuento a todas tus ${myProperties.length} propiedades?`)) return

    try {
      // Aplicar descuento solo a las propiedades del usuario
      const discountFactor = 1 - (discountNum / 100)
      
      for (const property of myProperties) {
        const newPrice = (property.price * discountFactor).toFixed(2)
        await api.put(`/api/properties/${property.id}`, {
          ...property,
          price: parseFloat(newPrice)
        })
      }

      toast.success(`Descuento del ${discount}% aplicado a ${myProperties.length} propiedades`)
      fetchMyProperties()
    } catch (error) {
      toast.error('Error al aplicar descuento')
    }
  }

  const handleAdjustMyPrices = async () => {
    if (myProperties.length === 0) {
      toast.error('No tienes propiedades para ajustar precios')
      return
    }

    const adjustment = prompt('¿Qué porcentaje de ajuste quieres aplicar? (Ejemplo: 5 para subir 5%, -3 para bajar 3%):')
    if (!adjustment) return

    const adjustmentNum = parseFloat(adjustment)
    if (isNaN(adjustmentNum) || adjustmentNum < -50 || adjustmentNum > 50) {
      toast.error('El ajuste debe estar entre -50% y +50%')
      return
    }

    const action = adjustmentNum > 0 ? 'incrementar' : 'reducir'
    if (!window.confirm(`¿${action} precios en ${Math.abs(adjustmentNum)}% para todas tus propiedades?`)) return

    try {
      const adjustmentFactor = 1 + (adjustmentNum / 100)
      
      for (const property of myProperties) {
        const newPrice = (property.price * adjustmentFactor).toFixed(2)
        await api.put(`/api/properties/${property.id}`, {
          ...property,
          price: parseFloat(newPrice)
        })
      }

      toast.success(`Precios ${adjustmentNum > 0 ? 'incrementados' : 'reducidos'} en ${Math.abs(adjustmentNum)}%`)
      fetchMyProperties()
    } catch (error) {
      toast.error('Error al ajustar precios')
    }
  }

  const handleToggleAvailability = async (propertyId, currentStatus) => {
    const newStatus = !currentStatus
    const action = newStatus ? 'disponible' : 'ocupada'
    
    if (!window.confirm(`¿Marcar esta propiedad como ${action}?`)) return

    try {
      const property = myProperties.find(p => p.id === propertyId)
      await api.put(`/api/properties/${propertyId}`, {
        ...property,
        available: newStatus
      })

      toast.success(`Propiedad marcada como ${action}`)
      fetchMyProperties()
    } catch (error) {
      toast.error('Error al cambiar disponibilidad')
    }
  }

  const handleApproveRequest = async (rentalId) => {
    const responseMessage = prompt('Mensaje de aprobación (opcional):')
    
    try {
      await api.post(`/api/rentals/${rentalId}/approve?message=${encodeURIComponent(responseMessage || '')}`)
      toast.success('Solicitud aprobada exitosamente')
      fetchReceivedRequests()
      fetchMyProperties()
    } catch (error) {
      toast.error('Error al aprobar la solicitud')
    }
  }

  const handleRejectRequest = async (rentalId) => {
    const responseMessage = prompt('Motivo del rechazo (opcional):')
    
    try {
      await api.post(`/api/rentals/${rentalId}/reject?message=${encodeURIComponent(responseMessage || '')}`)
      toast.success('Solicitud rechazada')
      fetchReceivedRequests()
    } catch (error) {
      toast.error('Error al rechazar la solicitud')
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

      {/* Herramientas de Gestión */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Gestión de Precios
          </h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">Aplicar Descuento</h5>
              <p className="text-gray-600 text-sm mb-3">Reduce los precios de todas tus propiedades para atraer más inquilinos.</p>
              <button
                onClick={handleDiscountToMyProperties}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
                disabled={myProperties.length === 0}
              >
                <Percent className="w-4 h-4 mr-2" />
                Aplicar Descuento
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">Ajustar Precios</h5>
              <p className="text-gray-600 text-sm mb-3">Ajusta los precios según el mercado o tus necesidades.</p>
              <button
                onClick={handleAdjustMyPrices}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                disabled={myProperties.length === 0}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ajustar Precios
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2" />
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/create-property'}
              className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Nueva Propiedad
            </button>
            <button
              onClick={() => setActiveTab('my-properties')}
              className="w-full p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
            >
              <Building className="w-5 h-5 mr-2" />
              Gestionar Mis Propiedades
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className="w-full p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center"
            >
              <Key className="w-5 h-5 mr-2" />
              Ver Solicitudes Recibidas
            </button>
            <button
              onClick={() => window.location.href = '/properties'}
              className="w-full p-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar Propiedades para Alquilar
            </button>
          </div>
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
              className="card p-6"
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
                
                <div className="absolute top-3 right-3">
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

              <div className="flex space-x-2">
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
    </div>
  )

  const renderRequests = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800">Solicitudes Recibidas ({receivedRequests.length})</h3>
      
      {receivedRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Key className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No tienes solicitudes pendientes
          </h3>
          <p className="text-gray-600">
            Las solicitudes para tus propiedades aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {receivedRequests.map((request) => (
            <div key={request.id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{request.propertyTitle}</h4>
                      <div className="flex items-center mt-1 text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        <span>Solicitante: {request.tenantUsername}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Solicitud recibida el {formatDate(request.createdAt)}
                      </p>
                    </div>
                    
                    <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-2">
                        {request.status === 'APPROVED' ? 'Aprobada' :
                         request.status === 'REJECTED' ? 'Rechazada' : 'Pendiente'}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <span className="font-medium">Desde:</span> {formatDate(request.startDate)}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <span className="font-medium">Hasta:</span> {formatDate(request.endDate)}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Euro className="w-4 h-4 mr-2" />
                      <div>
                        <span className="font-medium">Propuesta:</span> €{request.monthlyRent}/mes
                      </div>
                    </div>
                  </div>

                  {request.requestMessage && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-600 font-medium mb-1">Mensaje del solicitante:</p>
                      <p className="text-blue-700">{request.requestMessage}</p>
                    </div>
                  )}

                  {request.responseMessage && (
                    <div className={`p-3 rounded-lg ${request.status === 'APPROVED' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className={`text-sm font-medium mb-1 ${request.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                        Tu respuesta:
                      </p>
                      <p className={request.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'}>
                        {request.responseMessage}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {request.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-300"
                      >
                        Aprobar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => window.location.href = `/properties/${request.propertyId}`}
                    className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-300"
                  >
                    Ver Propiedad
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

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

        {/* Tabs */}
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
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'requests'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Key className="w-5 h-5 mr-2 inline" />
              Solicitudes ({receivedRequests.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'my-properties' && renderMyProperties()}
          {activeTab === 'requests' && renderRequests()}
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