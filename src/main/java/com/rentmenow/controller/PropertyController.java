package com.rentmenow.controller;

import com.rentmenow.dto.PropertyDto;
import com.rentmenow.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

	private final PropertyService propertyService;

	public PropertyController(PropertyService propertyService) {
		this.propertyService = propertyService;
	}

	// ✅ PÚBLICOS - No requieren autenticación
	@GetMapping
	public ResponseEntity<List<PropertyDto>> getAllProperties() {
		return ResponseEntity.ok(propertyService.getAllProperties());
	}

	@GetMapping("/available")
	public ResponseEntity<List<PropertyDto>> getAvailableProperties() {
		return ResponseEntity.ok(propertyService.getAvailableProperties());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
		try {
			PropertyDto property = propertyService.getPropertyById(id);
			return ResponseEntity.ok(property);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// ✅ REQUIEREN AUTENTICACIÓN
	@PostMapping
	public ResponseEntity<?> createProperty(@RequestBody PropertyDto propertyDto, Authentication authentication) {
		try {
			PropertyDto property = propertyService.createProperty(propertyDto, authentication.getName());
			return ResponseEntity.ok(property);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateProperty(@PathVariable Long id, @RequestBody PropertyDto propertyDto) {
		try {
			PropertyDto property = propertyService.updateProperty(id, propertyDto);
			return ResponseEntity.ok(property);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
		try {
			propertyService.deleteProperty(id);
			return ResponseEntity.ok("Property deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// OPERACIÓN TRANSACCIONAL: Aplicar descuento a propiedades por ciudad
	@PostMapping("/apply-discount")
	public ResponseEntity<?> applyDiscountToCity(@RequestParam String city, @RequestParam Double discount) {
		try {
			propertyService.applyDiscountToCity(city, discount);
			return ResponseEntity.ok("Discount applied successfully to properties in " + city);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}