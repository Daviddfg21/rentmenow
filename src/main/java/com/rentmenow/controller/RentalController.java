package com.rentmenow.controller;

import com.rentmenow.model.Rental;
import com.rentmenow.service.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de contratos de alquiler
 */
@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class RentalController {

	@Autowired
	private RentalService rentalService;

	// GET /api/rentals - Obtener todos los contratos
	@GetMapping
	public ResponseEntity<List<Rental>> getAllRentals() {
		List<Rental> rentals = rentalService.getAllRentals();
		return ResponseEntity.ok(rentals);
	}

	// GET /api/rentals/{id} - Obtener contrato por ID
	@GetMapping("/{id}")
	public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
		return rentalService.getRentalById(id).map(rental -> ResponseEntity.ok(rental))
				.orElse(ResponseEntity.notFound().build());
	}

	// POST /api/rentals - Crear nuevo contrato
	@PostMapping
	public ResponseEntity<Rental> createRental(@Valid @RequestBody Rental rental, @RequestParam Long propertyId,
			@RequestParam Long tenantId, @RequestParam Long landlordId) {
		try {
			Rental createdRental = rentalService.createRental(rental, propertyId, tenantId, landlordId);
			return ResponseEntity.ok(createdRental);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// PUT /api/rentals/{id} - Actualizar contrato
	@PutMapping("/{id}")
	public ResponseEntity<Rental> updateRental(@PathVariable Long id, @Valid @RequestBody Rental rental) {
		try {
			Rental updatedRental = rentalService.updateRental(id, rental);
			return ResponseEntity.ok(updatedRental);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// PUT /api/rentals/{id}/terminate - Terminar contrato
	@PutMapping("/{id}/terminate")
	public ResponseEntity<Rental> terminateRental(@PathVariable Long id) {
		try {
			Rental terminatedRental = rentalService.terminateRental(id);
			return ResponseEntity.ok(terminatedRental);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/rentals/tenant/{tenantId} - Contratos por inquilino
	@GetMapping("/tenant/{tenantId}")
	public ResponseEntity<List<Rental>> getRentalsByTenant(@PathVariable Long tenantId) {
		List<Rental> rentals = rentalService.getRentalsByTenant(tenantId);
		return ResponseEntity.ok(rentals);
	}

	// GET /api/rentals/landlord/{landlordId} - Contratos por propietario
	@GetMapping("/landlord/{landlordId}")
	public ResponseEntity<List<Rental>> getRentalsByLandlord(@PathVariable Long landlordId) {
		List<Rental> rentals = rentalService.getRentalsByLandlord(landlordId);
		return ResponseEntity.ok(rentals);
	}

	// GET /api/rentals/tenant/{tenantId}/active - Contratos activos por inquilino
	@GetMapping("/tenant/{tenantId}/active")
	public ResponseEntity<List<Rental>> getActiveRentalsByTenant(@PathVariable Long tenantId) {
		List<Rental> rentals = rentalService.getActiveRentalsByTenant(tenantId);
		return ResponseEntity.ok(rentals);
	}

	// GET /api/rentals/landlord/{landlordId}/active - Contratos activos por
	// propietario
	@GetMapping("/landlord/{landlordId}/active")
	public ResponseEntity<List<Rental>> getActiveRentalsByLandlord(@PathVariable Long landlordId) {
		List<Rental> rentals = rentalService.getActiveRentalsByLandlord(landlordId);
		return ResponseEntity.ok(rentals);
	}

	// GET /api/rentals/expiring/{days} - Contratos que expiran pronto
	@GetMapping("/expiring/{days}")
	public ResponseEntity<List<Rental>> getExpiringRentals(@PathVariable int days) {
		List<Rental> rentals = rentalService.getExpiringRentals(days);
		return ResponseEntity.ok(rentals);
	}

	// GET /api/rentals/stats/income/{landlordId} - Estadísticas de ingresos por
	// propietario
	@GetMapping("/stats/income/{landlordId}")
	public ResponseEntity<Map<String, Double>> getLandlordIncome(@PathVariable Long landlordId) {
		Double income = rentalService.getTotalMonthlyIncomeByLandlord(landlordId);
		Map<String, Double> stats = Map.of("monthlyIncome", income);
		return ResponseEntity.ok(stats);
	}

	// GET /api/rentals/stats/expenses/{tenantId} - Estadísticas de gastos por
	// inquilino
	@GetMapping("/stats/expenses/{tenantId}")
	public ResponseEntity<Map<String, Double>> getTenantExpenses(@PathVariable Long tenantId) {
		Double expenses = rentalService.getTotalMonthlyExpensesByTenant(tenantId);
		Map<String, Double> stats = Map.of("monthlyExpenses", expenses);
		return ResponseEntity.ok(stats);
	}

	// GET /api/rentals/stats/count-by-status - Estadísticas por estado
	@GetMapping("/stats/count-by-status")
	public ResponseEntity<Map<String, Long>> getRentalCountByStatus() {
		Map<String, Long> stats = Map.of("ACTIVE", rentalService.countRentalsByStatus(Rental.RentalStatus.ACTIVE),
				"EXPIRED", rentalService.countRentalsByStatus(Rental.RentalStatus.EXPIRED), "TERMINATED",
				rentalService.countRentalsByStatus(Rental.RentalStatus.TERMINATED), "PENDING",
				rentalService.countRentalsByStatus(Rental.RentalStatus.PENDING));

		return ResponseEntity.ok(stats);
	}
}