package com.rentmenow.controller;

import com.rentmenow.dto.RentalDto;
import com.rentmenow.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "*")
public class RentalController {

	private final RentalService rentalService;

	public RentalController(RentalService rentalService) {
		this.rentalService = rentalService;
	}

	@GetMapping
	public ResponseEntity<List<RentalDto>> getAllRentals() {
		return ResponseEntity.ok(rentalService.getAllRentals());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getRentalById(@PathVariable Long id) {
		try {
			RentalDto rental = rentalService.getRentalById(id);
			return ResponseEntity.ok(rental);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping
	public ResponseEntity<?> createRental(@RequestBody RentalDto rentalDto) {
		try {
			RentalDto rental = rentalService.createRental(rentalDto);
			return ResponseEntity.ok(rental);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> updateRental(@PathVariable Long id, @RequestBody RentalDto rentalDto) {
		try {
			RentalDto rental = rentalService.updateRental(id, rentalDto);
			return ResponseEntity.ok(rental);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteRental(@PathVariable Long id) {
		try {
			rentalService.deleteRental(id);
			return ResponseEntity.ok("Rental deleted successfully");
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	// OPERACIÓN TRANSACCIONAL: Finalizar alquileres vencidos
	@PostMapping("/finalize-expired")
	public ResponseEntity<?> finalizeExpiredRentals() {
		try {
			rentalService.finalizeExpiredRentals();
			return ResponseEntity.ok("Expired rentals finalized successfully");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}