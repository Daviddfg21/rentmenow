package com.rentmenow.service;

import com.rentmenow.dto.RentalDto;
import com.rentmenow.entity.Rental;
import com.rentmenow.entity.Property;
import com.rentmenow.entity.User;
import com.rentmenow.repository.RentalRepository;
import com.rentmenow.repository.PropertyRepository;
import com.rentmenow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RentalService {

	private final RentalRepository rentalRepository;
	private final PropertyRepository propertyRepository;
	private final UserRepository userRepository;

	public RentalService(RentalRepository rentalRepository, PropertyRepository propertyRepository,
			UserRepository userRepository) {
		this.rentalRepository = rentalRepository;
		this.propertyRepository = propertyRepository;
		this.userRepository = userRepository;
	}

	public RentalDto createRental(RentalDto rentalDto) {
		Property property = propertyRepository.findById(rentalDto.getPropertyId())
				.orElseThrow(() -> new RuntimeException("Property not found"));

		if (!property.getAvailable()) {
			throw new RuntimeException("Property is not available");
		}

		User tenant = userRepository.findById(rentalDto.getTenantId())
				.orElseThrow(() -> new RuntimeException("Tenant not found"));

		Rental rental = new Rental();
		rental.setProperty(property);
		rental.setTenant(tenant);
		rental.setStartDate(rentalDto.getStartDate());
		rental.setEndDate(rentalDto.getEndDate());
		rental.setMonthlyRent(rentalDto.getMonthlyRent());

		// Marcar propiedad como no disponible
		property.setAvailable(false);
		propertyRepository.save(property);

		Rental savedRental = rentalRepository.save(rental);
		return convertToDto(savedRental);
	}

	public List<RentalDto> getAllRentals() {
		return rentalRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public RentalDto getRentalById(Long id) {
		Rental rental = rentalRepository.findById(id).orElseThrow(() -> new RuntimeException("Rental not found"));
		return convertToDto(rental);
	}

	public RentalDto updateRental(Long id, RentalDto rentalDto) {
		Rental rental = rentalRepository.findById(id).orElseThrow(() -> new RuntimeException("Rental not found"));

		rental.setStartDate(rentalDto.getStartDate());
		rental.setEndDate(rentalDto.getEndDate());
		rental.setMonthlyRent(rentalDto.getMonthlyRent());
		rental.setStatus(rentalDto.getStatus());

		Rental savedRental = rentalRepository.save(rental);
		return convertToDto(savedRental);
	}

	public void deleteRental(Long id) {
		Rental rental = rentalRepository.findById(id).orElseThrow(() -> new RuntimeException("Rental not found"));

		// Liberar la propiedad
		Property property = rental.getProperty();
		property.setAvailable(true);
		propertyRepository.save(property);

		rentalRepository.deleteById(id);
	}

	// OPERACIÓN TRANSACCIONAL: Finalizar todos los alquileres vencidos
	@Transactional
	public void finalizeExpiredRentals() {
		List<Rental> activeRentals = rentalRepository.findByStatus("ACTIVE");
		java.time.LocalDate today = java.time.LocalDate.now();

		List<Rental> expiredRentals = activeRentals.stream().filter(rental -> rental.getEndDate().isBefore(today))
				.collect(Collectors.toList());

		expiredRentals.forEach(rental -> {
			rental.setStatus("TERMINATED");
			rental.getProperty().setAvailable(true);
			propertyRepository.save(rental.getProperty());
		});

		rentalRepository.saveAll(expiredRentals);
	}

	private RentalDto convertToDto(Rental rental) {
		RentalDto dto = new RentalDto();
		dto.setId(rental.getId());
		dto.setPropertyId(rental.getProperty().getId());
		dto.setPropertyTitle(rental.getProperty().getTitle());
		dto.setTenantId(rental.getTenant().getId());
		dto.setTenantUsername(rental.getTenant().getUsername());
		dto.setStartDate(rental.getStartDate());
		dto.setEndDate(rental.getEndDate());
		dto.setMonthlyRent(rental.getMonthlyRent());
		dto.setStatus(rental.getStatus());
		return dto;
	}
}