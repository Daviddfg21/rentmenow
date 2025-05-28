package com.rentmenow.service;

import com.rentmenow.model.Property;
import com.rentmenow.model.User;
import com.rentmenow.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de propiedades
 */
@Service
public class PropertyService {

	@Autowired
	private PropertyRepository propertyRepository;

	@Autowired
	private UserService userService;

	// Obtener todas las propiedades
	public List<Property> getAllProperties() {
		return propertyRepository.findAll();
	}

	// Obtener propiedad por ID
	public Optional<Property> getPropertyById(Long id) {
		return propertyRepository.findById(id);
	}

	// Crear nueva propiedad
	public Property createProperty(Property property, Long ownerId) {
		User owner = userService.getUserById(ownerId)
				.orElseThrow(() -> new RuntimeException("Propietario no encontrado"));

		property.setOwner(owner);
		return propertyRepository.save(property);
	}

	// Actualizar propiedad
	public Property updateProperty(Long id, Property updatedProperty) {
		return propertyRepository.findById(id).map(property -> {
			property.setTitle(updatedProperty.getTitle());
			property.setDescription(updatedProperty.getDescription());
			property.setType(updatedProperty.getType());
			property.setAddress(updatedProperty.getAddress());
			property.setCity(updatedProperty.getCity());
			property.setPostalCode(updatedProperty.getPostalCode());
			property.setPrice(updatedProperty.getPrice());
			property.setBedrooms(updatedProperty.getBedrooms());
			property.setBathrooms(updatedProperty.getBathrooms());
			property.setArea(updatedProperty.getArea());
			property.setFurnished(updatedProperty.getFurnished());
			property.setPetsAllowed(updatedProperty.getPetsAllowed());
			property.setHasGarage(updatedProperty.getHasGarage());

			return propertyRepository.save(property);
		}).orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));
	}

	// Eliminar propiedad
	public void deleteProperty(Long id) {
		if (!propertyRepository.existsById(id)) {
			throw new RuntimeException("Propiedad no encontrada");
		}
		propertyRepository.deleteById(id);
	}

	// Buscar propiedades por propietario
	public List<Property> getPropertiesByOwner(Long ownerId) {
		return propertyRepository.findByOwnerId(ownerId);
	}

	// Buscar propiedades disponibles
	public List<Property> getAvailableProperties() {
		return propertyRepository.findByStatusOrderByCreatedAtDesc(Property.PropertyStatus.AVAILABLE);
	}

	// Buscar por filtros avanzados
	public Page<Property> searchProperties(String city, Property.PropertyType type, BigDecimal minPrice,
			BigDecimal maxPrice, Integer bedrooms, Boolean furnished, Pageable pageable) {

		return propertyRepository.findWithFilters(city, type, minPrice, maxPrice, bedrooms,
				Property.PropertyStatus.AVAILABLE, furnished, pageable);
	}

	// Buscar por ciudad
	public List<Property> getPropertiesByCity(String city) {
		return propertyRepository.findByCityContainingIgnoreCase(city);
	}

	// Cambiar estado de propiedad
	public Property updatePropertyStatus(Long id, Property.PropertyStatus status) {
		return propertyRepository.findById(id).map(property -> {
			property.setStatus(status);
			return propertyRepository.save(property);
		}).orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));
	}

	// Operación transaccional: cambiar estado de múltiples propiedades
	public void updateMultiplePropertyStatus(List<Long> propertyIds, Property.PropertyStatus status) {
		for (Long id : propertyIds) {
			updatePropertyStatus(id, status);
		}
	}

	// Estadísticas: contar propiedades por estado
	public long countPropertiesByStatus(Property.PropertyStatus status) {
		return propertyRepository.countByStatus(status);
	}

	// Estadísticas: contar propiedades por propietario
	public long countPropertiesByOwner(Long ownerId) {
		return propertyRepository.countByOwnerId(ownerId);
	}
}