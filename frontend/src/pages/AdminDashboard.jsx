import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Users, Building, Key, Euro, BarChart3, 
  Plus, Edit, Trash2, User, Tag, FileText, TrendingUp 
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [discountData, setDiscountData] = useState({ city: '', discount: '' })

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  })

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: BarChart3 },
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'categories', name: 'Categorías', icon: Tag },
    { id: 'operations', name: 'Operaciones', icon: Settings }
  ]

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchUsers(),
        fetchCategories(),
        fetchFinancialReport()
      ])
    } catch (error) {
      toast.error('Error al cargar datos')
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFinancialReport = async () => {
    try {
      const response = await api.get('/api/admin/reports/financial')
      setReport(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

    try {
      await api.delete(`/api/admin/users/${userId}`)
      toast.success('Usuario eliminado exitosamente')
      fetchUsers()
    } catch (error) {
      toast.error('Error al eliminar usuario')
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/admin/categories', newCategory)
      toast.success('Categoría creada exitosamente')
      setNewCategory({ name: '', description: '' })
      setShowCategoryModal(false)
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data || 'Error al crear categoría')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

    try {
      await api.delete(`/api/admin/categories/${categoryId}`)
      toast.success('Categoría eliminada exitosamente')
      fetchCategories()
    } catch (error) {
      toast.error('Error al eliminar categoría')
    }
  }

  const handleApplyDiscount = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/properties/apply-discount', null, {
        params: {
          city: discountData.city,
          discount: discountData.discount
        }
      })
      toast.success('Descuento aplicado exitosamente')
      setDiscountData({ city: '', discount: '' })
    } catch (error) {
      toast.error('Error al aplicar descuento')
    }
  }

  const handleFinalizeExpiredRentals = async () => {
    try {
      await api.post('/api/rentals/finalize-expired')
      toast.success('Alquileres vencidos finalizados exitosamente')
    } catch (error) {
      toast.error('Error al finalizar alquileres vencidos')
    }
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{users.length}</div>
          <div className="text-gray-600">Total Usuarios</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{report?.totalProperties || 0}</div>
          <div className="text-gray-600">Propiedades</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">{report?.totalRentals || 0}</div>
          <div className="text-gray-600">Alquileres</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Euro className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            €{report?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-gray-600">Ingresos Totales</div>
        </motion.div>
      </div>

      {/* Financial Report */}
      {report && (
        <div className="card p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Informe Financiero
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Ingresos Totales</h4>
              <p className="text-3xl font-bold text-blue-600">€{report.totalRevenue?.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-2">Renta Promedio</h4>
              <p className="text-3xl font-bold text-green-600">€{report.averageRent?.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-2">Tasa de Ocupación</h4>
              <p className="text-3xl font-bold text-purple-600">
                {report.totalRentals > 0 ? ((report.totalRentals / report.totalProperties) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderUsers = () => (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Gestión de Usuarios
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-800">{user.username}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'OWNER'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-300"
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
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
            <Tag className="w-6 h-6 mr-2" />
            Gestión de Categorías
          </h3>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Categoría
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -2 }}
              className="card p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800">{category.name}</h4>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Nueva Categoría</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="input-field resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )

  const renderOperations = () => (
    <div className="space-y-6">
      {/* Discount Operations */}
      <div className="card p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Euro className="w-6 h-6 mr-2" />
          Aplicar Descuento por Ciudad
        </h3>
        <form onSubmit={handleApplyDiscount} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={discountData.city}
              onChange={(e) => setDiscountData({...discountData, city: e.target.value})}
              className="input-field"
              placeholder="Nombre de la ciudad"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              value={discountData.discount}
              onChange={(e) => setDiscountData({...discountData, discount: e.target.value})}
              className="input-field"
              placeholder="10"
              min="0"
              max="100"
              required
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">
              Aplicar Descuento
            </button>
          </div>
        </form>
      </div>

      {/* Rental Operations */}
      <div className="card p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Key className="w-6 h-6 mr-2" />
          Operaciones de Alquileres
        </h3>
        <button
          onClick={handleFinalizeExpiredRentals}
          className="btn-secondary flex items-center"
        >
          <FileText className="w-5 h-5 mr-2" />
          Finalizar Alquileres Vencidos
        </button>
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
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Panel de Administración
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona usuarios, categorías y operaciones del sistema
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center mb-8 border-b border-gray-200"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 mx-2 mb-2 rounded-t-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'operations' && renderOperations()}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard