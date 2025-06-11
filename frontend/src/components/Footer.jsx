import React from 'react'
import { Building, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 mt-20">
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
              <li>
                <button 
                  onClick={() => navigateTo('/properties')} 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Propiedades
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('/create-property')} 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Publicar Propiedad
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('/rentals')} 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Mis Alquileres
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('/login')} 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Iniciar Sesión
                </button>
              </li>
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
            <span className="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
              Política de Privacidad
            </span>
            <span className="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
              Términos de Servicio
            </span>
            <span className="text-gray-400 hover:text-white text-sm transition-colors duration-300 cursor-pointer">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer