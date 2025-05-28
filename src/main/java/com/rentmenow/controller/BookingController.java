package com.rentmenow.controller;

import com.rentmenow.model.Booking;
import com.rentmenow.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de reservas/consultas
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class BookingController {

	@Autowired
	private BookingService bookingService;

	// GET /api/bookings - Obtener todas las reservas
	@GetMapping
	public ResponseEntity<List<Booking>> getAllBookings() {
		List<Booking> bookings = bookingService.getAllBookings();
		return ResponseEntity.ok(bookings);
	}

	// GET /api/bookings/{id} - Obtener reserva por ID
	@GetMapping("/{id}")
	public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
		return bookingService.getBookingById(id).map(booking -> ResponseEntity.ok(booking))
				.orElse(ResponseEntity.notFound().build());
	}

	// POST /api/bookings - Crear nueva reserva (usuario registrado)
	@PostMapping
	public ResponseEntity<Booking> createBooking(@Valid @RequestBody Booking booking, @RequestParam Long propertyId,
			@RequestParam(required = false) Long userId) {
		try {
			Booking createdBooking;
			if (userId != null) {
				createdBooking = bookingService.createBooking(booking, propertyId, userId);
			} else {
				createdBooking = bookingService.createBooking(booking, propertyId);
			}
			return ResponseEntity.ok(createdBooking);
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().build();
		}
	}

	// PUT /api/bookings/{id} - Actualizar reserva
	@PutMapping("/{id}")
	public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @Valid @RequestBody Booking booking) {
		try {
			Booking updatedBooking = bookingService.updateBooking(id, booking);
			return ResponseEntity.ok(updatedBooking);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// DELETE /api/bookings/{id} - Eliminar reserva
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
		try {
			bookingService.deleteBooking(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/bookings/property/{propertyId} - Reservas por propiedad
	@GetMapping("/property/{propertyId}")
	public ResponseEntity<List<Booking>> getBookingsByProperty(@PathVariable Long propertyId) {
		List<Booking> bookings = bookingService.getBookingsByProperty(propertyId);
		return ResponseEntity.ok(bookings);
	}

	// GET /api/bookings/user/{userId} - Reservas por usuario
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
		List<Booking> bookings = bookingService.getBookingsByUser(userId);
		return ResponseEntity.ok(bookings);
	}

	// GET /api/bookings/owner/{ownerId} - Reservas por propietario
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<Booking>> getBookingsByPropertyOwner(@PathVariable Long ownerId) {
		List<Booking> bookings = bookingService.getBookingsByPropertyOwner(ownerId);
		return ResponseEntity.ok(bookings);
	}

	// GET /api/bookings/status/{status} - Reservas por estado
	@GetMapping("/status/{status}")
	public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable Booking.BookingStatus status) {
		List<Booking> bookings = bookingService.getBookingsByStatus(status);
		return ResponseEntity.ok(bookings);
	}

	// GET /api/bookings/pending - Reservas pendientes
	@GetMapping("/pending")
	public ResponseEntity<List<Booking>> getPendingBookings() {
		List<Booking> bookings = bookingService.getPendingBookings();
		return ResponseEntity.ok(bookings);
	}

	// PUT /api/bookings/{id}/status - Cambiar estado de reserva
	@PutMapping("/{id}/status")
	public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id,
			@RequestParam Booking.BookingStatus status) {
		try {
			Booking updatedBooking = bookingService.updateBookingStatus(id, status);
			return ResponseEntity.ok(updatedBooking);
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	// GET /api/bookings/stats/count-by-status - Estadísticas por estado
	@GetMapping("/stats/count-by-status")
	public ResponseEntity<Map<String, Long>> getBookingCountByStatus() {
		Map<String, Long> stats = Map.of("PENDING", bookingService.countBookingsByStatus(Booking.BookingStatus.PENDING),
				"CONFIRMED", bookingService.countBookingsByStatus(Booking.BookingStatus.CONFIRMED), "CANCELLED",
				bookingService.countBookingsByStatus(Booking.BookingStatus.CANCELLED), "COMPLETED",
				bookingService.countBookingsByStatus(Booking.BookingStatus.COMPLETED));

		return ResponseEntity.ok(stats);
	}
}