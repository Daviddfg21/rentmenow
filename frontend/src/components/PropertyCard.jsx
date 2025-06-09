import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Euro, User, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const PropertyCard = ({ property, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const hasImages = property.images && property.images.length > 0
  const hasMultipleImages = hasImages && property.images.length > 1

  const nextImage = (e) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = (e) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="card p-6 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        {hasImages ? (
          <div className="relative h-48 group">
            <img 
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-white text-4xl font-bold">
                {property.title.charAt(0)}
              </span>
            </div>
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {property.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {property.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1">
          {property.available ? (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Disponible
            </div>
          ) : (
            <>
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Ocupado
              </div>
              {property.occupiedUntil && (
                <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(property.occupiedUntil)}
                </div>
              )}
            </>
          )}
        </div>
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
            <span className="hover:text-primary-600 transition-colors duration-300 cursor-pointer">
              {property.ownerUsername}
            </span>
          </div>
          
          {property.categoryName && (
            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
              {property.categoryName}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard