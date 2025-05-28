package com.rentmenow.repository;

import com.rentmenow.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Booking
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	// Buscar por propiedad
	List<Booking> findByPropertyId(Long propertyId);

	// Buscar por usuario
	List<Booking> findByUserId(Long userId);

	// Buscar por estado
	List<Booking> findByStatus(Booking.BookingStatus status);

	// Buscar por email de contacto
	List<Booking> findByContactEmailContainingIgnoreCase(String email);

	// Buscar por propietario de la propiedad
	@Query("SELECT b FROM Booking b WHERE b.property.owner.id = :ownerId")
	List<Booking> findByPropertyOwnerId(@Param("ownerId") Long ownerId);

	// Contar reservas por estado
	long countByStatus(Booking.BookingStatus status);

	// Buscar reservas pendientes ordenadas por fecha
	List<Booking> findByStatusOrderByCreatedAtDesc(Booking.BookingStatus status);

	// Buscar reservas por propiedad y estado
	List<Booking> findByPropertyIdAndStatus(Long propertyId, Booking.BookingStatus status);
}