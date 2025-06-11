package com.rentmenow.controller;

import com.rentmenow.dto.ReportDto;
import com.rentmenow.dto.UserDto;
import com.rentmenow.dto.PropertyDto;
import com.rentmenow.service.ReportService;
import com.rentmenow.service.UserService;
import com.rentmenow.service.PropertyService;
import com.rentmenow.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

	private final UserService userService;
	private final PropertyService propertyService;
	private final ReportService reportService;
	private final RentalService rentalService;

	public AdminController(UserService userService, PropertyService propertyService, ReportService reportService,
			RentalService rentalService) {
		this.userService = userService;
		this.propertyService = propertyService;
		this.reportService = reportService;
		this.rentalService = rentalService;
	}

	// Crear headers para evitar cache
	private HttpHeaders createNoCacheHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
		headers.add("Pragma", "no-cache");
		headers.add("Expires", "0");
		return headers;
	}

	// CRUD USUARIOS
	@GetMapping("/users")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		return ResponseEntity.ok().headers(createNoCacheHeaders()).body(userService.getAllUsers());
	}

	@GetMapping("/users/{id}")
	public ResponseEntity<?> getUserById(@PathVariable Long id) {
		try {
			UserDto user = userService.getUserById(id);
			return ResponseEntity.ok().headers(createNoCacheHeaders()).body(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/users/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
		try {
			UserDto user = userService.updateUser(id, userDto);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable Long id) {
		try {
			userService.deleteUser(id);
			return ResponseEntity.ok("User deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// GESTIÓN DE PROPIEDADES
	@GetMapping("/properties")
	public ResponseEntity<List<PropertyDto>> getAllProperties() {
		return ResponseEntity.ok().headers(createNoCacheHeaders()).body(propertyService.getAllProperties());
	}

	@DeleteMapping("/properties/{id}")
	public ResponseEntity<?> deleteProperty(@PathVariable Long id) {
		try {
			propertyService.deleteProperty(id);
			return ResponseEntity.ok("Property deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// OPERACIONES TRANSACCIONALES ÚTILES

	/**
	 * Aplicar descuento por ciudad - Operación transaccional
	 */
	@PostMapping("/operations/discount-by-city")
	public ResponseEntity<?> applyDiscountToCity(@RequestParam String city, @RequestParam Double discount) {
		try {
			String result = propertyService.applyDiscountToCity(city, discount);
			return ResponseEntity.ok(Map.of("message", result, "success", true));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
		}
	}

	/**
	 * Actualizar disponibilidad por propietario - Operación transaccional
	 */
	@PostMapping("/operations/update-availability")
	public ResponseEntity<?> updateAvailabilityByOwner(@RequestParam String ownerUsername,
			@RequestParam Boolean available) {
		try {
			String result = propertyService.updateAvailabilityByOwner(ownerUsername, available);
			return ResponseEntity.ok(Map.of("message", result, "success", true));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
		}
	}

	/**
	 * Ajuste por inflación - Operación transaccional
	 */
	@PostMapping("/operations/inflation-adjustment")
	public ResponseEntity<?> applyInflationAdjustment(@RequestParam Double inflationPercentage) {
		try {
			String result = propertyService.applyInflationAdjustment(inflationPercentage);
			return ResponseEntity.ok(Map.of("message", result, "success", true));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
		}
	}

	/**
	 * Finalizar alquileres vencidos - Operación transaccional
	 */
	@PostMapping("/operations/finalize-expired-rentals")
	public ResponseEntity<?> finalizeExpiredRentals() {
		try {
			rentalService.finalizeExpiredRentals();
			return ResponseEntity
					.ok(Map.of("message", "Alquileres vencidos finalizados exitosamente", "success", true));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
		}
	}

	// ESTADÍSTICAS Y REPORTES

	/**
	 * Informe financiero - CON NO-CACHE
	 */
	@GetMapping("/reports/financial")
	public ResponseEntity<ReportDto> getFinancialReport() {
		System.out.println("🔄 Financial report requested - generating fresh data...");
		ReportDto report = reportService.generateFinancialReport();
		System.out.println("📊 Returning report: " + report);

		return ResponseEntity.ok().headers(createNoCacheHeaders()).body(report);
	}

	/**
	 * Estadísticas del sistema
	 */
	@GetMapping("/statistics")
	public ResponseEntity<?> getSystemStatistics() {
		try {
			List<UserDto> users = userService.getAllUsers();
			List<PropertyDto> properties = propertyService.getAllProperties();

			Map<String, Object> stats = new HashMap<>();
			stats.put("totalUsers", users.size());
			stats.put("adminUsers", users.stream().mapToInt(u -> u.getRole().equals("ADMIN") ? 1 : 0).sum());
			stats.put("regularUsers", users.stream().mapToInt(u -> u.getRole().equals("USER") ? 1 : 0).sum());
			stats.put("totalProperties", properties.size());
			stats.put("availableProperties", properties.stream().mapToInt(p -> p.getAvailable() ? 1 : 0).sum());
			stats.put("occupiedProperties", properties.stream().mapToInt(p -> !p.getAvailable() ? 1 : 0).sum());

			// Estadísticas por ciudad
			Map<String, Long> propertiesByCity = properties.stream().collect(java.util.stream.Collectors
					.groupingBy(PropertyDto::getCity, java.util.stream.Collectors.counting()));
			stats.put("propertiesByCity", propertiesByCity);

			// Rango de precios
			double minPrice = properties.stream().mapToDouble(p -> p.getPrice().doubleValue()).min().orElse(0);
			double maxPrice = properties.stream().mapToDouble(p -> p.getPrice().doubleValue()).max().orElse(0);
			double avgPrice = properties.stream().mapToDouble(p -> p.getPrice().doubleValue()).average().orElse(0);

			stats.put("priceRange", Map.of("min", minPrice, "max", maxPrice, "average", avgPrice));

			return ResponseEntity.ok().headers(createNoCacheHeaders()).body(stats);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
		}
	}
}