import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Edit, Save, X, MapPin, Calendar, Building, Key } from 'lucide-react'
import toast from 'react-hot-toast'

const UserProfile = ({ username, isOwnProfile = false }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    fetchUser()
  }, [username])

  const fetchUser = async () => {
    try {
      const endpoint = isOwnProfile ? '/api/users/profile' : `/api/users/${username}`
      const headers = {
        'Content-Type': 'application/json'
      }
      
      if (isOwnProfile) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
      }

      const response = await fetch(endpoint, { headers })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setEditData(userData)
      } else {
        toast.error('Error al cargar el perfil del usuario')
      }
    } catch (error) {
      toast.error('Error al cargar el perfil del usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setEditData({ ...user })
  }

  const handleCancel = () => {
    setEditing(false)
    setEditData({ ...user })
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setEditData(updatedUser)
        setEditing(false)
        toast.success('Perfil actualizado exitosamente')
      } else {
        toast.error('Error al actualizar el perfil')
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil')
    }
  }

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuario no encontrado</h2>
          <button onClick={() => window.history.back()} className="btn-primary">
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {editing ? 'Editar Perfil' : 'Perfil de Usuario'}
          </h1>
          <p className="text-xl text-gray-600">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.username
            }
          </p>
          {user.role === 'ADMIN' && (
            <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              Administrador
            </span>
          )}
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Información Personal
            </h3>
            {isOwnProfile && (
              <div className="flex space-x-2">
                {editing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-300"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-300"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={user.username}
                  className="input-field pl-12 bg-gray-50"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={editing ? editData.email : user.email}
                  onChange={handleChange}
                  className={`input-field pl-12 ${!editing ? 'bg-gray-50' : ''}`}
                  disabled={!editing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={editing ? editData.firstName || '' : user.firstName || ''}
                onChange={handleChange}
                className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                placeholder="Tu nombre"
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellidos
              </label>
              <input
                type="text"
                name="lastName"
                value={editing ? editData.lastName || '' : user.lastName || ''}
                onChange={handleChange}
                className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
                placeholder="Tus apellidos"
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={editing ? editData.phone || '' : user.phone || ''}
                  onChange={handleChange}
                  className={`input-field pl-12 ${!editing ? 'bg-gray-50' : ''}`}
                  placeholder="Tu número de teléfono"
                  disabled={!editing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Registro
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={new Date(user.createdAt || Date.now()).toLocaleDateString('es-ES')}
                  className="input-field pl-12 bg-gray-50"
                  disabled
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía
              </label>
              <textarea
                name="bio"
                value={editing ? editData.bio || '' : user.bio || ''}
                onChange={handleChange}
                rows={3}
                className={`input-field resize-none ${!editing ? 'bg-gray-50' : ''}`}
                placeholder="Cuéntanos algo sobre ti..."
                disabled={!editing}
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Información de Contacto
            </h3>
            <div className="space-y-3">
              {user.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <span className="text-gray-700">{user.phone}</span>
                </div>
              )}
              {(!user.email && !user.phone) && (
                <p className="text-gray-500 text-sm">
                  Este usuario no ha compartido información de contacto pública.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats Section - Solo para perfil propio */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">0</div>
              <div className="text-sm text-gray-600">Propiedades Publicadas</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">0</div>
              <div className="text-sm text-gray-600">Alquileres Activos</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">0</div>
              <div className="text-sm text-gray-600">Solicitudes Pendientes</div>
            </div>
          </motion.div>
        )}

        {/* Biography Section */}
        {user.bio && !editing && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="card p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Acerca de {user.firstName || user.username}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {user.bio}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default UserProfile