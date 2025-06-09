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
import java.time.LocalDateTime;

@Service
@Transactional
public class RentalService {

	private final RentalRepository rentalRepository;
	private final PropertyRepository propertyRepository;
	private final UserRepository userRepository;
	private final PropertyService propertyService;

	public RentalService(RentalRepository rentalRepository, PropertyRepository propertyRepository,
			UserRepository userRepository, PropertyService propertyService) {
		this.rentalRepository = rentalRepository;
		this.propertyRepository = propertyRepository;
		this.userRepository = userRepository;
		this.propertyService = propertyService;
	}

	public RentalDto createRentalRequest(RentalDto rentalDto) {
		Property property = propertyRepository.findById(rentalDto.getPropertyId())
				.orElseThrow(() -> new RuntimeException("Property not found"));

		User tenant = userRepository.findById(rentalDto.getTenantId())
				.orElseThrow(() -> new RuntimeException("Tenant not found"));

		// Verificar que el tenant no sea el owner
		if (property.getOwner().getId().equals(tenant.getId())) {
			throw new RuntimeException("Cannot rent your own property");
		}

		Rental rental = new Rental();
		rental.setProperty(property);
		rental.setTenant(tenant);
		rental.setStartDate(rentalDto.getStartDate());
		rental.setEndDate(rentalDto.getEndDate());
		rental.setMonthlyRent(rentalDto.getMonthlyRent());
		rental.setRequestMessage(rentalDto.getRequestMessage());
		rental.setStatus("PENDING");

		Rental savedRental = rentalRepository.save(rental);
		return convertToDto(savedRental);
	}

	public RentalDto approveRental(Long rentalId, String responseMessage) {
		Rental rental = rentalRepository.findById(rentalId).orElseThrow(() -> new RuntimeException("Rental not found"));

		if (!"PENDING".equals(rental.getStatus())) {
			throw new RuntimeException("Rental request is not pending");
		}

		// Rechazar todas las demás solicitudes pendientes para esta propiedad
		List<Rental> pendingRentals = rentalRepository.findByPropertyIdAndStatus(rental.getProperty().getId(),
				"PENDING");

		for (Rental pendingRental : pendingRentals) {
			if (!pendingRental.getId().equals(rentalId)) {
				pendingRental.setStatus("REJECTED");
				pendingRental.setRejectedAt(LocalDateTime.now());
				pendingRental.setResponseMessage("Another tenant was selected");
				rentalRepository.save(pendingRental);
			}
		}

		rental.setStatus("APPROVED");
		rental.setApprovedAt(LocalDateTime.now());
		rental.setResponseMessage(responseMessage);

		// Marcar propiedad como ocupada
		propertyService.markPropertyAsOccupied(rental.getProperty().getId(), rental.getEndDate().atStartOfDay());

		Rental savedRental = rentalRepository.save(rental);
		return convertToDto(savedRental);
	}

	public RentalDto rejectRental(Long rentalId, String responseMessage) {
		Rental rental = rentalRepository.findById(rentalId).orElseThrow(() -> new RuntimeException("Rental not found"));

		if (!"PENDING".equals(rental.getStatus())) {
			throw new RuntimeException("Rental request is not pending");
		}

		rental.setStatus("REJECTED");
		rental.setRejectedAt(LocalDateTime.now());
		rental.setResponseMessage(responseMessage);

		Rental savedRental = rentalRepository.save(rental);
		return convertToDto(savedRental);
	}

	public List<RentalDto> getAllRentals() {
		return rentalRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public List<RentalDto> getRentalsByTenant(String tenantUsername) {
		User tenant = userRepository.findByUsername(tenantUsername)
				.orElseThrow(() -> new RuntimeException("Tenant not found"));
		return rentalRepository.findByTenantId(tenant.getId()).stream().map(this::convertToDto)
				.collect(Collectors.toList());
	}

	public List<RentalDto> getRentalRequestsForOwner(String ownerUsername) {
		User owner = userRepository.findByUsername(ownerUsername)
				.orElseThrow(() -> new RuntimeException("Owner not found"));
		return rentalRepository.findByPropertyOwnerId(owner.getId()).stream().map(this::convertToDto)
				.collect(Collectors.toList());
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
		rental.setResponseMessage(rentalDto.getResponseMessage());

		Rental savedRental = rentalRepository.save(rental);
		return convertToDto(savedRental);
	}

	public void deleteRental(Long id) {
		Rental rental = rentalRepository.findById(id).orElseThrow(() -> new RuntimeException("Rental not found"));

		// Si está aprobado, liberar la propiedad
		if ("APPROVED".equals(rental.getStatus()) || "ACTIVE".equals(rental.getStatus())) {
			propertyService.markPropertyAsAvailable(rental.getProperty().getId());
		}

		rentalRepository.deleteById(id);
	}

	@Transactional
	public void finalizeExpiredRentals() {
		List<Rental> approvedRentals = rentalRepository.findByStatus("APPROVED");
		java.time.LocalDate today = java.time.LocalDate.now();

		List<Rental> expiredRentals = approvedRentals.stream().filter(rental -> rental.getEndDate().isBefore(today))
				.collect(Collectors.toList());

		expiredRentals.forEach(rental -> {
			rental.setStatus("TERMINATED");
			propertyService.markPropertyAsAvailable(rental.getProperty().getId());
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
		dto.setCreatedAt(rental.getCreatedAt());
		dto.setApprovedAt(rental.getApprovedAt());
		dto.setRejectedAt(rental.getRejectedAt());
		dto.setRequestMessage(rental.getRequestMessage());
		dto.setResponseMessage(rental.getResponseMessage());
		return dto;
	}
}