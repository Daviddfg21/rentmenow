import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Key, Calendar, Euro, Building, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Rentals = () => {
  const { user } = useAuth()
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      const response = await api.get('/api/rentals')
      setRentals(response.data)
    } catch (error) {
      toast.error('Error al cargar los alquileres')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'TERMINATED':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'PENDING':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'TERMINATED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo'
      case 'TERMINATED':
        return 'Terminado'
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

  const handleDeleteRental = async (rentalId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este alquiler?')) {
      return
    }

    try {
      await api.delete(`/api/rentals/${rentalId}`)
      toast.success('Alquiler eliminado exitosamente')
      fetchRentals()
    } catch (error) {
      toast.error('Error al eliminar el alquiler')
    }
  }

  const handleFinalizeExpired = async () => {
    try {
      await api.post('/api/rentals/finalize-expired')
      toast.success('Alquileres vencidos finalizados exitosamente')
      fetchRentals()
    } catch (error) {
      toast.error('Error al finalizar alquileres vencidos')
    }
  }

  // Filtrar alquileres según el rol del usuario
  const userRentals = rentals.filter(rental => {
    if (user.role === 'ADMIN') return true
    if (user.role === 'TENANT') return rental.tenantUsername === user.username
    if (user.role === 'OWNER') {
      // Para propietarios, mostrar alquileres de sus propiedades
      // Esto requeriría una consulta adicional o datos extendidos
      return true
    }
    return false
  })

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
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Gestión de Alquileres
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Administra todos tus alquileres desde un solo lugar
          </p>
        </motion.div>

        {/* Admin Controls */}
        {user.role === 'ADMIN' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Operaciones Administrativas
                </h3>
                <p className="text-gray-600">
                  Gestiona operaciones masivas de alquileres
                </p>
              </div>
              <button
                onClick={handleFinalizeExpired}
                className="btn-secondary"
              >
                <Clock className="w-5 h-5 mr-2" />
                Finalizar Alquileres Vencidos
              </button>
            </div>
          </motion.div>
        )}

        {/* Rentals Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{userRentals.length}</div>
            <div className="text-sm text-gray-600">Total Alquileres</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {userRentals.filter(r => r.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {userRentals.filter(r => r.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {userRentals.filter(r => r.status === 'TERMINATED').length}
            </div>
            <div className="text-sm text-gray-600">Terminados</div>
          </div>
        </motion.div>

        {/* Rentals List */}
        {userRentals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No hay alquileres
            </h3>
            <p className="text-gray-600 mb-6">
              {user.role === 'TENANT' 
                ? 'Aún no has alquilado ninguna propiedad'
                : 'No hay alquileres registrados'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {userRentals.map((rental, index) => (
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
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Inquilino: {rental.tenantUsername}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rental.status)}`}>
                          {getStatusIcon(rental.status)}
                          <span className="ml-2">{getStatusText(rental.status)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <span className="font-medium">Inicio:</span>
                          <br />
                          {formatDate(rental.startDate)}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <span className="font-medium">Fin:</span>
                          <br />
                          {formatDate(rental.endDate)}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Euro className="w-4 h-4 mr-2" />
                        <div>
                          <span className="font-medium">Renta mensual:</span>
                          <br />
                          €{rental.monthlyRent}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {(user.role === 'ADMIN' || user.username === rental.tenantUsername) && (
                      <button
                        onClick={() => handleDeleteRental(rental.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rentals