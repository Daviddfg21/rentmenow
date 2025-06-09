import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Building, Key, Users, Star, ArrowRight, Mail, Phone, MapPin } from 'lucide-react'

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const features = [
    {
      icon: Building,
      title: 'Propiedades Verificadas',
      description: 'Todas las propiedades están verificadas y son seguras para alquilar'
    },
    {
      icon: Key,
      title: 'Gestión Fácil',
      description: 'Administra tus alquileres de forma simple y eficiente'
    },
    {
      icon: Users,
      title: 'Comunidad Confiable',
      description: 'Conecta con propietarios e inquilinos verificados'
    },
    {
      icon: Star,
      title: 'Mejor Experiencia',
      description: 'Sistema intuitivo y soporte 24/7 para todos los usuarios'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                Encuentra tu
              </span>
              <br />
              <span className="text-gray-800">hogar perfecto</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              La plataforma más completa para alquilar y gestionar propiedades.
              Conectamos propietarios e inquilinos de forma segura y eficiente.
            </motion.p>

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              >
                <a href="/properties" className="btn-primary text-lg px-8 py-4">
                  <Search className="w-5 h-5 mr-2" />
                  Explorar Propiedades
                </a>
                <a href="/register" className="btn-secondary text-lg px-8 py-4">
                  <Building className="w-5 h-5 mr-2" />
                  Unirse Gratis
                </a>
              </motion.div>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-40 right-20 w-32 h-32 bg-secondary-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-20"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir RentMeNow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos las mejores herramientas para que encuentres o rentes tu propiedad ideal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="card p-6 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Solo si no está autenticado */}
      {!isAuthenticated && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="card p-12 text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
            >
              <h2 className="text-4xl font-bold mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Únete a miles de usuarios que ya confían en RentMeNow para sus necesidades de alquiler
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="/register" 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Crear Cuenta Gratis
                </a>
                <a 
                  href="/properties" 
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
                >
                  Explorar Propiedades
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">RentMeNow</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La plataforma líder en alquiler de propiedades. Conectamos propietarios e inquilinos 
                de forma segura y eficiente en toda España.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="/properties" className="text-gray-400 hover:text-white transition-colors duration-300">Propiedades</a></li>
                <li><a href="/create-property" className="text-gray-400 hover:text-white transition-colors duration-300">Publicar Propiedad</a></li>
                <li><a href="/rentals" className="text-gray-400 hover:text-white transition-colors duration-300">Mis Alquileres</a></li>
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors duration-300">Iniciar Sesión</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">info@rentmenow.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">+34 900 123 456</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-400">Madrid, España</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 RentMeNow. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home