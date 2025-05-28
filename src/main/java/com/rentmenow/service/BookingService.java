package com.rentmenow.service;

import com.rentmenow.model.Booking;
import com.rentmenow.model.Property;
import com.rentmenow.model.User;
import com.rentmenow.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de reservas/consultas
 */
@Service
public class BookingService {

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private UserService userService;

	// Obtener todas las reservas
	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
	}

	// Obtener reserva por ID
	public Optional<Booking> getBookingById(Long id) {
		return bookingRepository.findById(id);
	}

	// Crear nueva reserva (usuario registrado)
	public Booking createBooking(Booking booking, Long propertyId, Long userId) {
		Property property = propertyService.getPropertyById(propertyId)
				.orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

		User user = userService.getUserById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

		booking.setProperty(property);
		booking.setUser(user);
		booking.setContactName(user.getFullName());
		booking.setContactEmail(user.getEmail());
		booking.setContactPhone(user.getPhone());

		return bookingRepository.save(booking);
	}

	// Crear nueva reserva (usuario no registrado)
	public Booking createBooking(Booking booking, Long propertyId) {
		Property property = propertyService.getPropertyById(propertyId)
				.orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

		booking.setProperty(property);
		booking.setUser(null); // Usuario no registrado

		return bookingRepository.save(booking);
	}

	// Actualizar reserva
	public Booking updateBooking(Long id, Booking updatedBooking) {
		return bookingRepository.findById(id).map(booking -> {
			booking.setContactName(updatedBooking.getContactName());
			booking.setContactEmail(updatedBooking.getContactEmail());
			booking.setContactPhone(updatedBooking.getContactPhone());
			booking.setMessage(updatedBooking.getMessage());
			booking.setStatus(updatedBooking.getStatus());
			booking.setPreferredVisitDate(updatedBooking.getPreferredVisitDate());

			return bookingRepository.save(booking);
		}).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
	}

	// Eliminar reserva
	public void deleteBooking(Long id) {
		if (!bookingRepository.existsById(id)) {
			throw new RuntimeException("Reserva no encontrada");
		}
		bookingRepository.deleteById(id);
	}

	// Obtener reservas por propiedad
	public List<Booking> getBookingsByProperty(Long propertyId) {
		return bookingRepository.findByPropertyId(propertyId);
	}

	// Obtener reservas por usuario
	public List<Booking> getBookingsByUser(Long userId) {
		return bookingRepository.findByUserId(userId);
	}

	// Obtener reservas por estado
	public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
		return bookingRepository.findByStatus(status);
	}

	// Obtener reservas pendientes
	public List<Booking> getPendingBookings() {
		return bookingRepository.findByStatus(Booking.BookingStatus.PENDING);
	}

	// Cambiar estado de reserva
	public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
		return bookingRepository.findById(id).map(booking -> {
			booking.setStatus(status);
			return bookingRepository.save(booking);
		}).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
	}

	// Estadísticas: contar reservas por estado
	public long countBookingsByStatus(Booking.BookingStatus status) {
		return bookingRepository.countByStatus(status);
	}

	// Obtener reservas por propietario (a través de propiedades)
	public List<Booking> getBookingsByPropertyOwner(Long ownerId) {
		return bookingRepository.findByPropertyOwnerId(ownerId);
	}
}