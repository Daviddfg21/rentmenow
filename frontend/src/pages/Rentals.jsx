import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Calendar, Euro, Building, User, Clock, CheckCircle, XCircle, AlertCircle, Check, X, MessageSquare } from 'lucide-react'

const Rentals = () => {
  const [user, setUser] = useState(null)
  const [myRequests, setMyRequests] = useState([])
  const [propertyRequests, setPropertyRequests] = useState([])
  const [activeTab, setActiveTab] = useState('my-requests')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Obtener mis solicitudes enviadas
      const myRequestsResponse = await fetch('/api/rentals/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (myRequestsResponse.ok) {
        const myRequestsData = await myRequestsResponse.json()
        setMyRequests(myRequestsData)
      }

      // Obtener solicitudes para mis propiedades
      const propertyRequestsResponse = await fetch('/api/rentals/property-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (propertyRequestsResponse.ok) {
        const propertyRequestsData = await propertyRequestsResponse.json()
        setPropertyRequests(propertyRequestsData)
      }

    } catch (error) {
      showToast('Error al cargar los alquileres', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setMessage(message)
    setTimeout(() => setMessage(''), 4000)
  }

  const handleApproveRequest = async (rentalId) => {
    const responseMessage = prompt('Mensaje de respuesta (opcional):')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/rentals/${rentalId}/approve?message=${encodeURIComponent(responseMessage || '')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showToast('Solicitud aprobada exitosamente')
        fetchRentals() // Recargar datos
      } else {
        showToast('Error al aprobar la solicitud', 'error')
      }
    } catch (error) {
      showToast('Error al aprobar la solicitud', 'error')
    }
  }

  const handleRejectRequest = async (rentalId) => {
    const responseMessage = prompt('Motivo del rechazo (opcional):')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/rentals/${rentalId}/reject?message=${encodeURIComponent(responseMessage || '')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showToast('Solicitud rechazada')
        fetchRentals() // Recargar datos
      } else {
        showToast('Error al rechazar la solicitud', 'error')
      }
    } catch (error) {
      showToast('Error al rechazar la solicitud', 'error')
    }
  }

  const handleDeleteRequest = async (rentalId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/rentals/${rentalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showToast('Solicitud eliminada exitosamente')
        fetchRentals() // Recargar datos
      } else {
        showToast('Error al eliminar la solicitud', 'error')
      }
    } catch (error) {
      showToast('Error al eliminar la solicitud', 'error')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'PENDING':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprobada'
      case 'REJECTED':
        return 'Rechazada'
      case 'PENDING':
        return 'Pendiente'
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

      <div className="max-w-7xl mx-auto">
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
            Gestión de Alquileres
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Administra tus solicitudes de alquiler y las peticiones para tus propiedades
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'my-requests'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mis Solicitudes ({myRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('property-requests')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'property-requests'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Solicitudes Recibidas ({propertyRequests.length})
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {activeTab === 'my-requests' ? (
            // Mis solicitudes enviadas
            <div className="space-y-6">
              {myRequests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Key className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No hay solicitudes enviadas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aún no has enviado ninguna solicitud de alquiler
                  </p>
                  <button 
                    onClick={() => window.location.href = '/properties'} 
                    className="btn-primary"
                  >
                    Explorar Propiedades
                  </button>
                </div>
              ) : (
                myRequests.map((rental, index) => (
                  <motion.div
                    key={rental.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                              <Building className="w-5 h-5 mr-2" />
                              {rental.propertyTitle}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Solicitud enviada el {formatDate(rental.createdAt)}
                            </p>
                          </div>
                          
                          <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                            {getStatusIcon(rental.status)}
                            <span className="ml-2">{getStatusText(rental.status)}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">Desde:</span> {formatDate(rental.startDate)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">Hasta:</span> {formatDate(rental.endDate)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Euro className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">Propuesta:</span> €{rental.monthlyRent}/mes
                            </div>
                          </div>
                        </div>

                        {rental.requestMessage && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 font-medium mb-1">Tu mensaje:</p>
                            <p className="text-gray-700">{rental.requestMessage}</p>
                          </div>
                        )}

                        {rental.responseMessage && (
                          <div className={`p-3 rounded-lg ${rental.status === 'APPROVED' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <p className={`text-sm font-medium mb-1 ${rental.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                              Respuesta del propietario:
                            </p>
                            <p className={rental.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'}>
                              {rental.responseMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {rental.status === 'PENDING' && (
                          <button
                            onClick={() => handleDeleteRequest(rental.id)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => window.location.href = `/properties/${rental.propertyId}`}
                          className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-300"
                        >
                          Ver Propiedad
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            // Solicitudes recibidas para mis propiedades
            <div className="space-y-6">
              {propertyRequests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No hay solicitudes recibidas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aún no has recibido solicitudes para tus propiedades
                  </p>
                  <button 
                    onClick={() => window.location.href = '/create-property'} 
                    className="btn-primary"
                  >
                    Publicar Propiedad
                  </button>
                </div>
              ) : (
                propertyRequests.map((rental, index) => (
                  <motion.div
                    key={rental.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                              <Building className="w-5 h-5 mr-2" />
                              {rental.propertyTitle}
                            </h3>
                            <div className="flex items-center mt-1 text-gray-600">
                              <User className="w-4 h-4 mr-1" />
                              <span>Solicitante: {rental.tenantUsername}</span>
                            </div>
                            <p className="text-gray-600 text-sm">
                              Solicitud recibida el {formatDate(rental.createdAt)}
                            </p>
                          </div>
                          
                          <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                            {getStatusIcon(rental.status)}
                            <span className="ml-2">{getStatusText(rental.status)}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">Desde:</span> {formatDate(rental.startDate)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">Hasta:</span> {formatDate(rental.endDate)}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Euro className="w-4 h-4 mr-2" />
                            <div>
                              <span className="font-medium">Propuesta:</span> €{rental.monthlyRent}/mes
                            </div>
                          </div>
                        </div>

                        {rental.requestMessage && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium mb-1">Mensaje del solicitante:</p>
                            <p className="text-blue-700">{rental.requestMessage}</p>
                          </div>
                        )}

                        {rental.responseMessage && (
                          <div className={`p-3 rounded-lg ${rental.status === 'APPROVED' ? 'bg-green-50' : 'bg-red-50'}`}>
                            <p className={`text-sm font-medium mb-1 ${rental.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                              Tu respuesta:
                            </p>
                            <p className={rental.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'}>
                              {rental.responseMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {rental.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleRejectRequest(rental.id)}
                              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300 flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Rechazar
                            </button>
                            <button
                              onClick={() => handleApproveRequest(rental.id)}
                              className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-300 flex items-center"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Aprobar
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => window.location.href = `/properties/${rental.propertyId}`}
                          className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-300"
                        >
                          Ver Propiedad
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Rentals