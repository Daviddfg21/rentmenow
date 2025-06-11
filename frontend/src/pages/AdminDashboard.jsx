import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Users, Building, BarChart3, Trash2, User, 
  Search, Eye, AlertTriangle, Shield, Database, Activity,
  TrendingUp, Calendar, MapPin, Home, CheckCircle, XCircle
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProperties, setSelectedProperties] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  
  // Estados para filtros
  const [userFilter, setUserFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchUsers(),
        fetchProperties(),
        fetchRentals()
      ])
    } catch (error) {
      toast.error('Error al cargar datos del sistema')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchProperties = async () => {
    try {
      const response = await api.get('/api/properties')
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const fetchRentals = async () => {
    try {
      const response = await api.get('/api/rentals')
      setRentals(response.data)
    } catch (error) {
      console.error('Error fetching rentals:', error)
    }
  }

  // Funciones de administración del sistema
  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId)
    if (user?.role === 'ADMIN') {
      toast.error('No se puede eliminar un usuario administrador')
      return
    }
    
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción eliminará también todas sus propiedades y solicitudes.')) return
    
    try {
      await api.delete(`/api/admin/users/${userId}`)
      toast.success('Usuario eliminado del sistema')
      fetchUsers()
      fetchProperties() // Actualizar propiedades por si tenía alguna
    } catch (error) {
      toast.error('Error al eliminar usuario')
    }
  }

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('¿Eliminar esta propiedad del sistema? Se cancelarán todas las solicitudes asociadas.')) return
    
    try {
      await api.delete(`/api/properties/${propertyId}`)
      toast.success('Propiedad eliminada del sistema')
      fetchProperties()
      fetchRentals() // Actualizar solicitudes
    } catch (error) {
      toast.error('Error al eliminar propiedad')
    }
  }

  const handleBulkDeleteProperties = async () => {
    if (selectedProperties.length === 0) {
      toast.error('Selecciona al menos una propiedad')
      return
    }
    
    if (!window.confirm(`¿Eliminar ${selectedProperties.length} propiedades del sistema?`)) return
    
    try {
      await Promise.all(
        selectedProperties.map(id => api.delete(`/api/properties/${id}`))
      )
      toast.success(`${selectedProperties.length} propiedades eliminadas del sistema`)
      setSelectedProperties([])
      fetchProperties()
      fetchRentals()
    } catch (error) {
      toast.error('Error al eliminar propiedades')
    }
  }

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un usuario')
      return
    }

    // Verificar que no se intenten eliminar admins
    const hasAdmins = selectedUsers.some(id => {
      const user = users.find(u => u.id === id)
      return user?.role === 'ADMIN'
    })

    if (hasAdmins) {
      toast.error('No se pueden eliminar usuarios administradores')
      return
    }
    
    if (!window.confirm(`¿Eliminar ${selectedUsers.length} usuarios del sistema?`)) return
    
    try {
      await Promise.all(
        selectedUsers.map(id => api.delete(`/api/admin/users/${id}`))
      )
      toast.success(`${selectedUsers.length} usuarios eliminados del sistema`)
      setSelectedUsers([])
      fetchUsers()
      fetchProperties()
    } catch (error) {
      toast.error('Error al eliminar usuarios')
    }
  }

  const handleCleanExpiredRentals = async () => {
    if (!window.confirm('¿Limpiar automáticamente todas las solicitudes vencidas del sistema?')) return
    
    try {
      await api.post('/api/rentals/finalize-expired')
      toast.success('Solicitudes vencidas limpiadas del sistema')
      fetchRentals()
      fetchProperties()
    } catch (error) {
      toast.error('Error al limpiar solicitudes vencidas')
    }
  }

  const togglePropertySelection = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAllProperties = () => {
    setSelectedProperties(prev => 
      prev.length === properties.length ? [] : properties.map(p => p.id)
    )
  }

  const toggleSelectAllUsers = () => {
    const regularUsers = users.filter(u => u.role !== 'ADMIN')
    setSelectedUsers(prev => 
      prev.length === regularUsers.length ? [] : regularUsers.map(u => u.id)
    )
  }

  // Estadísticas del sistema
  const totalRevenue = properties.reduce((sum, prop) => sum + parseFloat(prop.price || 0), 0)
  const averageRent = properties.length > 0 ? totalRevenue / properties.length : 0
  const availableProperties = properties.filter(p => p.available).length
  const occupancyRate = properties.length > 0 ? ((properties.length - availableProperties) / properties.length * 100) : 0
  const pendingRentals = rentals.filter(r => r.status === 'PENDING').length
  const approvedRentals = rentals.filter(r => r.status === 'APPROVED').length
  const adminUsers = users.filter(u => u.role === 'ADMIN').length
  const regularUsers = users.filter(u => u.role === 'USER').length

  // Estadísticas por ciudad
  const citiesStats = properties.reduce((acc, prop) => {
    acc[prop.city] = (acc[prop.city] || 0) + 1
    return acc
  }, {})

  // Filtros
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(userFilter.toLowerCase())
  )

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(propertyFilter.toLowerCase()) ||
    property.city.toLowerCase().includes(propertyFilter.toLowerCase())
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Estadísticas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{users.length}</div>
          <div className="text-gray-600">Usuarios Registrados</div>
          <div className="text-sm text-gray-500 mt-2">
            {adminUsers} Admin • {regularUsers} Usuarios
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{properties.length}</div>
          <div className="text-gray-600">Propiedades en Sistema</div>
          <div className="text-sm text-gray-500 mt-2">
            {availableProperties} Disponibles • {properties.length - availableProperties} Ocupadas
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{rentals.length}</div>
          <div className="text-gray-600">Solicitudes Totales</div>
          <div className="text-sm text-gray-500 mt-2">
            {pendingRentals} Pendientes • {approvedRentals} Aprobadas
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="card p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{occupancyRate.toFixed(1)}%</div>
          <div className="text-gray-600">Tasa de Ocupación</div>
          <div className="text-sm text-gray-500 mt-2">
            €{averageRent.toFixed(0)} renta promedio
          </div>
        </motion.div>
      </div>

      {/* Análisis del Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Database className="w-6 h-6 mr-2" />
            Estado del Sistema
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Sistema Operativo</span>
              <span className="text-green-800 font-bold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Activo
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Valor Total Propiedades</span>
              <span className="text-blue-800 font-bold">€{totalRevenue.toFixed(0)}/mes</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">Actividad Pendiente</span>
              <span className="text-purple-800 font-bold">{pendingRentals} solicitudes</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            Distribución por Ciudades
          </h3>
          <div className="space-y-3">
            {Object.entries(citiesStats).slice(0, 5).map(([city, count]) => (
              <div key={city} className="flex justify-between items-center">
                <span className="text-gray-700">{city}</span>
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                  {count} propiedades
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones de Mantenimiento */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Mantenimiento del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCleanExpiredRentals}
            className="p-4 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Limpiar Solicitudes Vencidas
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className="p-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Eliminar Propiedades
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
          >
            <Shield className="w-5 h-5 mr-2" />
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Control de Usuarios ({users.length})
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDeleteUsers}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Seleccionados ({selectedUsers.length})
            </button>
          )}
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={selectedUsers.length === users.filter(u => u.role !== 'ADMIN').length && users.filter(u => u.role !== 'ADMIN').length > 0}
            onChange={toggleSelectAllUsers}
            className="mr-2"
          />
          <label className="text-sm text-gray-600">Seleccionar todos los usuarios (excepto admins)</label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Seleccionar</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      disabled={user.role === 'ADMIN'}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.firstName} {user.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      disabled={user.role === 'ADMIN'}
                      title={user.role === 'ADMIN' ? 'No se puede eliminar un administrador' : 'Eliminar usuario'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Database className="w-6 h-6 mr-2" />
          Control de Propiedades ({properties.length})
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {selectedProperties.length > 0 && (
            <button
              onClick={handleBulkDeleteProperties}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Seleccionadas ({selectedProperties.length})
            </button>
          )}
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={selectedProperties.length === properties.length && properties.length > 0}
            onChange={toggleSelectAllProperties}
            className="mr-2"
          />
          <label className="text-sm text-gray-600">Seleccionar todas las propiedades</label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Seleccionar</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Propiedad</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Propietario</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ubicación</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => togglePropertySelection(property.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center mr-3">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{property.title}</div>
                        <div className="text-sm text-gray-500">€{property.price}/mes • {property.bedrooms} hab • {property.bathrooms} baños</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{property.ownerUsername}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.city}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {property.available ? 'Disponible' : 'Ocupada'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver propiedad"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar del sistema"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Panel de Control del Sistema
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Supervisión y mantenimiento de la plataforma RentMeNow
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
              Sistema
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield className="w-5 h-5 mr-2 inline" />
              Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'properties'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database className="w-5 h-5 mr-2 inline" />
              Propiedades ({properties.length})
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
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'properties' && renderProperties()}
        </motion.div>

        {/* Alerts de selección */}
        {(selectedProperties.length > 0 || selectedUsers.length > 0) && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4">
              {selectedProperties.length > 0 && (
                <>
                  <span>{selectedProperties.length} propiedades seleccionadas</span>
                  <button
                    onClick={handleBulkDeleteProperties}
                    className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              {selectedUsers.length > 0 && (
                <>
                  <span>{selectedUsers.length} usuarios seleccionados</span>
                  <button
                    onClick={handleBulkDeleteUsers}
                    className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setSelectedProperties([])
                  setSelectedUsers([])
                }}
                className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Advertencia de Admin */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">⚠️ Panel de Administrador del Sistema</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• Este panel es solo para control y mantenimiento del sistema</li>
                <li>• Las eliminaciones son permanentes e irreversibles</li>
                <li>• Eliminar usuarios también elimina sus propiedades y solicitudes</li>
                <li>• Solo elimina contenido que viole términos de servicio o sea spam</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard