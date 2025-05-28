package com.rentmenow.service;

import com.rentmenow.model.Property;
import com.rentmenow.model.Rental;
import com.rentmenow.model.User;
import com.rentmenow.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de contratos de alquiler
 */
@Service
public class RentalService {

	@Autowired
	private RentalRepository rentalRepository;

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private UserService userService;

	// Obtener todos los contratos
	public List<Rental> getAllRentals() {
		return rentalRepository.findAll();
	}

	// Obtener contrato por ID
	public Optional<Rental> getRentalById(Long id) {
		return rentalRepository.findById(id);
	}

	// Crear nuevo contrato
	public Rental createRental(Rental rental, Long propertyId, Long tenantId, Long landlordId) {
		Property property = propertyService.getPropertyById(propertyId)
				.orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

		User tenant = userService.getUserById(tenantId)
				.orElseThrow(() -> new RuntimeException("Inquilino no encontrado"));

		User landlord = userService.getUserById(landlordId)
				.orElseThrow(() -> new RuntimeException("Propietario no encontrado"));

		// Verificar que la propiedad no tenga contrato activo
		Optional<Rental> existingRental = rentalRepository.findByPropertyIdAndStatus(propertyId,
				Rental.RentalStatus.ACTIVE);

		if (existingRental.isPresent()) {
			throw new RuntimeException("La propiedad ya tiene un contrato activo");
		}

		rental.setProperty(property);
		rental.setTenant(tenant);
		rental.setLandlord(landlord);

		// Cambiar estado de la propiedad a alquilada
		propertyService.updatePropertyStatus(propertyId, Property.PropertyStatus.RENTED);

		return rentalRepository.save(rental);
	}

	// Actualizar contrato
	public Rental updateRental(Long id, Rental updatedRental) {
		return rentalRepository.findById(id).map(rental -> {
			rental.setStartDate(updatedRental.getStartDate());
			rental.setEndDate(updatedRental.getEndDate());
			rental.setMonthlyRent(updatedRental.getMonthlyRent());
			rental.setDeposit(updatedRental.getDeposit());
			rental.setTerms(updatedRental.getTerms());

			return rentalRepository.save(rental);
		}).orElseThrow(() -> new RuntimeException("Contrato no encontrado"));
	}

	// Terminar contrato
	public Rental terminateRental(Long id) {
		return rentalRepository.findById(id).map(rental -> {
			rental.setStatus(Rental.RentalStatus.TERMINATED);

			// Cambiar estado de la propiedad a disponible
			propertyService.updatePropertyStatus(rental.getProperty().getId(), Property.PropertyStatus.AVAILABLE);

			return rentalRepository.save(rental);
		}).orElseThrow(() -> new RuntimeException("Contrato no encontrado"));
	}

	// Obtener contratos por inquilino
	public List<Rental> getRentalsByTenant(Long tenantId) {
		return rentalRepository.findByTenantId(tenantId);
	}

	// Obtener contratos por propietario
	public List<Rental> getRentalsByLandlord(Long landlordId) {
		return rentalRepository.findByLandlordId(landlordId);
	}

	// Obtener contratos activos por inquilino
	public List<Rental> getActiveRentalsByTenant(Long tenantId) {
		return rentalRepository.findByTenantIdAndStatus(tenantId, Rental.RentalStatus.ACTIVE);
	}

	// Obtener contratos activos por propietario
	public List<Rental> getActiveRentalsByLandlord(Long landlordId) {
		return rentalRepository.findByLandlordIdAndStatus(landlordId, Rental.RentalStatus.ACTIVE);
	}

	// Obtener contratos que expiran pronto
	public List<Rental> getExpiringRentals(int daysFromNow) {
		LocalDate startDate = LocalDate.now();
		LocalDate endDate = startDate.plusDays(daysFromNow);

		return rentalRepository.findExpiringRentals(startDate, endDate);
	}

	// Estadísticas: ingresos mensuales totales de un propietario
	public Double getTotalMonthlyIncomeByLandlord(Long landlordId) {
		Double income = rentalRepository.getTotalMonthlyIncomeByLandlord(landlordId);
		return income != null ? income : 0.0;
	}

	// Estadísticas: gastos mensuales totales de un inquilino
	public Double getTotalMonthlyExpensesByTenant(Long tenantId) {
		Double expenses = rentalRepository.getTotalMonthlyExpensesByTenant(tenantId);
		return expenses != null ? expenses : 0.0;
	}

	// Estadísticas: contar contratos por estado
	public long countRentalsByStatus(Rental.RentalStatus status) {
		return rentalRepository.countByStatus(status);
	}
}