package com.rentmenow.controller;

import com.rentmenow.model.Property;
import com.rentmenow.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de propiedades
 */
@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class PropertyController {

	@Autowired
	private PropertyService propertyService;

	// GET /api/properties - Obtener todas las propiedades
	@GetMapping
	public ResponseEntity<List<Property>> getAllProperties() {
		List<Property> properties = propertyService.getAllProperties();
		return ResponseEntity.ok(properties);
	}

	// GET /api/properties/{id} - Obtener propiedad por ID
	@GetMapping("/{id}")
	public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
		return propertyService.getPropertyById(id).map(property -> ResponseEntity.ok(property))
				.orElse(ResponseEntity.notFound().build());
	}

	// POST /api/properties - Crear nueva propiedad
	@PostMapping
	public ResponseEntity<Property> createProperty(@Valid @RequestBody Property property, @RequestParam Long ownerId) {
		try {
			Property createdProperty = propertyService.createProperty(property, ownerId);
			return ResponseEntity.ok(createdProperty);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// PUT /api/properties/{id} - Actualizar propiedad
	@PutMapping("/{id}")
	public ResponseEntity<Property> updateProperty(@PathVariable Long id, @Valid @RequestBody Property property) {
		try {
			Property updatedProperty = propertyService.updateProperty(id, property);
			return ResponseEntity.ok(updatedProperty);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// DELETE /api/properties/{id} - Eliminar propiedad
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
		try {
			propertyService.deleteProperty(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/properties/search - Búsqueda avanzada con filtros
	@GetMapping("/search")
	public ResponseEntity<Page<Property>> searchProperties(@RequestParam(required = false) String city,
			@RequestParam(required = false) Property.PropertyType type,
			@RequestParam(required = false) BigDecimal minPrice, @RequestParam(required = false) BigDecimal maxPrice,
			@RequestParam(required = false) Integer bedrooms, @RequestParam(required = false) Boolean furnished,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Property> properties = propertyService.searchProperties(city, type, minPrice, maxPrice, bedrooms,
				furnished, pageable);

		return ResponseEntity.ok(properties);
	}

	// GET /api/properties/available - Obtener propiedades disponibles
	@GetMapping("/available")
	public ResponseEntity<List<Property>> getAvailableProperties() {
		List<Property> properties = propertyService.getAvailableProperties();
		return ResponseEntity.ok(properties);
	}

	// GET /api/properties/owner/{ownerId} - Propiedades por propietario
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<Property>> getPropertiesByOwner(@PathVariable Long ownerId) {
		List<Property> properties = propertyService.getPropertiesByOwner(ownerId);
		return ResponseEntity.ok(properties);
	}

	// GET /api/properties/city/{city} - Propiedades por ciudad
	@GetMapping("/city/{city}")
	public ResponseEntity<List<Property>> getPropertiesByCity(@PathVariable String city) {
		List<Property> properties = propertyService.getPropertiesByCity(city);
		return ResponseEntity.ok(properties);
	}

	// PUT /api/properties/{id}/status - Cambiar estado de propiedad
	@PutMapping("/{id}/status")
	public ResponseEntity<Property> updatePropertyStatus(@PathVariable Long id,
			@RequestParam Property.PropertyStatus status) {
		try {
			Property updatedProperty = propertyService.updatePropertyStatus(id, status);
			return ResponseEntity.ok(updatedProperty);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// PUT /api/properties/batch/status - Operación transaccional: cambiar estado
	// múltiple
	@PutMapping("/batch/status")
	public ResponseEntity<String> updateMultiplePropertyStatus(@RequestBody Map<String, Object> request) {
		try {
			@SuppressWarnings("unchecked")
			List<Long> propertyIds = (List<Long>) request.get("propertyIds");
			Property.PropertyStatus status = Property.PropertyStatus.valueOf((String) request.get("status"));

			propertyService.updateMultiplePropertyStatus(propertyIds, status);
			return ResponseEntity.ok("Estados actualizados correctamente");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error al actualizar estados");
		}
	}

	// GET /api/properties/stats/count-by-status - Estadísticas por estado
	@GetMapping("/stats/count-by-status")
	public ResponseEntity<Map<String, Long>> getPropertyCountByStatus() {
		Map<String, Long> stats = Map.of("AVAILABLE",
				propertyService.countPropertiesByStatus(Property.PropertyStatus.AVAILABLE), "RENTED",
				propertyService.countPropertiesByStatus(Property.PropertyStatus.RENTED), "RESERVED",
				propertyService.countPropertiesByStatus(Property.PropertyStatus.RESERVED), "MAINTENANCE",
				propertyService.countPropertiesByStatus(Property.PropertyStatus.MAINTENANCE), "INACTIVE",
				propertyService.countPropertiesByStatus(Property.PropertyStatus.INACTIVE));

		return ResponseEntity.ok(stats);
	}
}