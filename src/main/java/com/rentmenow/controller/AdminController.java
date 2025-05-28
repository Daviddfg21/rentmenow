package com.rentmenow.controller;

import com.rentmenow.model.User;
import com.rentmenow.model.Property;
import com.rentmenow.model.Rental;
import com.rentmenow.model.Booking;
import com.rentmenow.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador EXCLUSIVO para administradores Funcionalidades que solo pueden
 * hacer los ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AdminController {

	@Autowired
	private UserService userService;

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private RentalService rentalService;

	@Autowired
	private BookingService bookingService;

	// ==================== GESTIÓN DE USUARIOS ====================

	// GET /api/admin/users - Ver TODOS los usuarios (incluye passwords hash, datos
	// sensibles)
	@GetMapping("/users")
	public ResponseEntity<List<User>> getAllUsersAdmin() {
		List<User> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}

	// PUT /api/admin/users/{id}/ban - Banear/Desbanear usuario
	@PutMapping("/users/{id}/ban")
	public ResponseEntity<User> banUser(@PathVariable Long id) {
		User user = userService.toggleUserStatus(id);
		return ResponseEntity.ok(user);
	}

	// PUT /api/admin/users/{id}/promote - Promover usuario a ADMIN
	@PutMapping("/users/{id}/promote")
	public ResponseEntity<User> promoteToAdmin(@PathVariable Long id) {
		User user = userService.getUserById(id).orElseThrow();
		user.setRole(User.UserRole.ADMIN);
		// Aquí llamarías a un método updateUserRole en tu servicio
		return ResponseEntity.ok(user);
	}

	// DELETE /api/admin/users/{id}/force - Eliminar usuario FORZOSAMENTE
	@DeleteMapping("/users/{id}/force")
	public ResponseEntity<String> forceDeleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		return ResponseEntity.ok("Usuario eliminado permanentemente");
	}

	// ==================== MODERACIÓN DE PROPIEDADES ====================

	// PUT /api/admin/properties/{id}/moderate - Moderar propiedad
	// (aprobar/rechazar)
	@PutMapping("/properties/{id}/moderate")
	public ResponseEntity<String> moderateProperty(@PathVariable Long id, @RequestParam String action) { // "approve",
																											// "reject",
																											// "flag"

		if ("approve".equals(action)) {
			propertyService.updatePropertyStatus(id, Property.PropertyStatus.AVAILABLE);
			return ResponseEntity.ok("Propiedad aprobada");
		} else if ("reject".equals(action)) {
			propertyService.updatePropertyStatus(id, Property.PropertyStatus.INACTIVE);
			return ResponseEntity.ok("Propiedad rechazada");
		}
		return ResponseEntity.badRequest().body("Acción no válida");
	}

	// GET /api/admin/properties/flagged - Ver propiedades reportadas
	@GetMapping("/properties/flagged")
	public ResponseEntity<List<Property>> getFlaggedProperties() {
		// Aquí implementarías la lógica para propiedades reportadas
		return ResponseEntity.ok(propertyService.getAllProperties());
	}

	// ==================== RESOLUCIÓN DE DISPUTAS ====================

	// GET /api/admin/rentals/disputes - Ver contratos con problemas
	@GetMapping("/rentals/disputes")
	public ResponseEntity<List<Rental>> getDisputedRentals() {
		// Aquí implementarías la lógica para contratos en disputa
		return ResponseEntity.ok(rentalService.getAllRentals());
	}

	// PUT /api/admin/rentals/{id}/resolve - Resolver disputa
	@PutMapping("/rentals/{id}/resolve")
	public ResponseEntity<String> resolveDispute(@PathVariable Long id, @RequestParam String resolution) {

		// Lógica para resolver disputas
		return ResponseEntity.ok("Disputa resuelta: " + resolution);
	}

	// ==================== ESTADÍSTICAS AVANZADAS ====================

	// GET /api/admin/dashboard - Dashboard completo de administración
	@GetMapping("/dashboard")
	public ResponseEntity<Map<String, Object>> getAdminDashboard() {
		Map<String, Object> dashboard = new HashMap<>();

		// Estadísticas de usuarios
		dashboard.put("totalUsers", userService.getAllUsers().size());
		dashboard.put("activeUsers", userService.getActiveUsers().size());
		dashboard.put("adminCount", userService.countUsersByRole(User.UserRole.ADMIN));

		// Estadísticas de propiedades
		dashboard.put("totalProperties", propertyService.getAllProperties().size());
		dashboard.put("availableProperties",
				propertyService.countPropertiesByStatus(Property.PropertyStatus.AVAILABLE));
		dashboard.put("rentedProperties", propertyService.countPropertiesByStatus(Property.PropertyStatus.RENTED));

		// Estadísticas de contratos
		dashboard.put("activeRentals", rentalService.countRentalsByStatus(Rental.RentalStatus.ACTIVE));
		dashboard.put("pendingBookings", bookingService.countBookingsByStatus(Booking.BookingStatus.PENDING));

		// Métricas financieras (solo para admin)
		dashboard.put("totalMonthlyRevenue", calculateTotalRevenue());
		dashboard.put("averageRentPrice", calculateAverageRent());

		return ResponseEntity.ok(dashboard);
	}

	// GET /api/admin/reports/revenue - Reporte de ingresos
	@GetMapping("/reports/revenue")
	public ResponseEntity<Map<String, Object>> getRevenueReport() {
		Map<String, Object> report = new HashMap<>();

		// Aquí implementarías cálculos de comisiones, etc.
		report.put("totalPlatformRevenue", calculatePlatformRevenue());
		report.put("topEarningProperties", getTopEarningProperties());
		report.put("monthlyGrowth", calculateMonthlyGrowth());

		return ResponseEntity.ok(report);
	}

	// ==================== MÉTODOS AUXILIARES ====================

	private Double calculateTotalRevenue() {
		// Implementar cálculo de ingresos totales
		return 0.0;
	}

	private Double calculateAverageRent() {
		// Implementar cálculo de alquiler promedio
		return 0.0;
	}

	private Double calculatePlatformRevenue() {
		// Implementar cálculo de comisiones de la plataforma
		return 0.0;
	}

	private List<Property> getTopEarningProperties() {
		// Implementar ranking de propiedades más rentables
		return propertyService.getAllProperties();
	}

	private Double calculateMonthlyGrowth() {
		// Implementar cálculo de crecimiento mensual
		return 0.0;
	}
}