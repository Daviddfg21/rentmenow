import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Euro, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const PropertyCard = ({ property }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card p-6 group cursor-pointer"
    >
      <Link to={`/properties/${property.id}`}>
        <div className="relative overflow-hidden rounded-xl mb-4">
          <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {property.title.charAt(0)}
            </span>
          </div>
          {property.available && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Disponible
            </div>
          )}
          {!property.available && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Ocupado
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-300">
            {property.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.address}, {property.city}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            </div>
            
            <div className="flex items-center text-primary-600 font-semibold">
              <Euro className="w-4 h-4 mr-1" />
              <span>{property.price}/mes</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              <span>{property.ownerUsername}</span>
            </div>
            
            {property.categoryName && (
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                {property.categoryName}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyCard