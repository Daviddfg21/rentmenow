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
  
  // Estados para debug
  const [debugData, setDebugData] = useState(null)

  useEffect(() => {
    fetchInitialData()
    fetchDebugData() // Agregar debug
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
      console.log('👥 Users data:', response.data)
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/admin/categories')
      console.log('🏷️ Categories data:', response.data)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFinancialReport = async () => {
    try {
      const response = await api.get('/api/admin/reports/financial')
      console.log('📊 FINANCIAL REPORT RAW:', response.data)
      setReport(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  // Función de debug
  const fetchDebugData = async () => {
    try {
      const response = await api.get('/api/debug/simple-counts')
      console.log('🔍 DEBUG COUNTS:', response.data)
      setDebugData(response.data)
    } catch (error) {
      console.error('Debug data not available:', error)
    }
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* DEBUG INFO */}
      {debugData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800 mb-2">🔍 DEBUG INFO:</h4>
          <pre className="text-xs text-yellow-700">
            {JSON.stringify(debugData, null, 2)}
          </pre>
          <h4 className="font-bold text-yellow-800 mb-2 mt-4">📊 REPORT DATA:</h4>
          <pre className="text-xs text-yellow-700">
            {JSON.stringify(report, null, 2)}
          </pre>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {users.length}
            <span className="text-sm text-red-500 ml-2">
              (Frontend: {users.length})
            </span>
          </div>
          <div className="text-gray-600">Total Usuarios</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {report?.totalProperties || 0}
            <span className="text-sm text-red-500 ml-2">
              (Backend: {report?.totalProperties})
            </span>
          </div>
          <div className="text-gray-600">Propiedades</div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="card p-6 text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {report?.totalRentals || 0}
            <span className="text-sm text-red-500 ml-2">
              (Backend: {report?.totalRentals})
            </span>
          </div>
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
              <p className="text-3xl font-bold text-blue-600">€{report.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-green-800 mb-2">Renta Promedio</h4>
              <p className="text-3xl font-bold text-green-600">€{report.averageRent?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-2">Tasa de Ocupación</h4>
              <p className="text-3xl font-bold text-purple-600">
                {report.totalProperties > 0 ? ((report.totalRentals / report.totalProperties) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Resto del componente... (renderUsers, renderCategories, etc.)
  const renderUsers = () => (
    <div className="card p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Usuarios: {users.length}</h3>
      {/* Resto del código de usuarios */}
    </div>
  )

  const renderCategories = () => (
    <div className="card p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Categorías: {categories.length}</h3>
      {/* Resto del código de categorías */}
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Panel de Administración
          </h1>
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
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Usuarios
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'categories' && renderCategories()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard