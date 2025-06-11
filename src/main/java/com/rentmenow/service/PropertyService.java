package com.rentmenow.service;

import com.rentmenow.dto.PropertyDto;
import com.rentmenow.entity.Property;
import com.rentmenow.entity.User;
import com.rentmenow.entity.Category;
import com.rentmenow.repository.PropertyRepository;
import com.rentmenow.repository.UserRepository;
import com.rentmenow.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Service
@Transactional
public class PropertyService {

	private final PropertyRepository propertyRepository;
	private final UserRepository userRepository;
	private final CategoryRepository categoryRepository;

	public PropertyService(PropertyRepository propertyRepository, UserRepository userRepository,
			CategoryRepository categoryRepository) {
		this.propertyRepository = propertyRepository;
		this.userRepository = userRepository;
		this.categoryRepository = categoryRepository;
	}

	public PropertyDto createProperty(PropertyDto propertyDto, String ownerUsername) {
		User owner = userRepository.findByUsername(ownerUsername)
				.orElseThrow(() -> new RuntimeException("Owner not found"));

		Property property = new Property();
		property.setTitle(propertyDto.getTitle());
		property.setDescription(propertyDto.getDescription());
		property.setAddress(propertyDto.getAddress());
		property.setCity(propertyDto.getCity());
		property.setPrice(propertyDto.getPrice());
		property.setBedrooms(propertyDto.getBedrooms());
		property.setBathrooms(propertyDto.getBathrooms());
		property.setImages(propertyDto.getImages());
		property.setOwner(owner);

		if (propertyDto.getCategoryName() != null) {
			Category category = categoryRepository.findByName(propertyDto.getCategoryName())
					.orElseThrow(() -> new RuntimeException("Category not found"));
			property.setCategory(category);
		}

		Property savedProperty = propertyRepository.save(property);
		return convertToDto(savedProperty);
	}

	public List<PropertyDto> getAllProperties() {
		return propertyRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public List<PropertyDto> getAvailableProperties() {
		return propertyRepository.findByAvailableTrue().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public PropertyDto getPropertyById(Long id) {
		Property property = propertyRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Property not found"));
		return convertToDto(property);
	}

	public PropertyDto updateProperty(Long id, PropertyDto propertyDto) {
		Property property = propertyRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Property not found"));

		property.setTitle(propertyDto.getTitle());
		property.setDescription(propertyDto.getDescription());
		property.setAddress(propertyDto.getAddress());
		property.setCity(propertyDto.getCity());
		property.setPrice(propertyDto.getPrice());
		property.setBedrooms(propertyDto.getBedrooms());
		property.setBathrooms(propertyDto.getBathrooms());
		property.setAvailable(propertyDto.getAvailable());
		property.setImages(propertyDto.getImages());

		if (propertyDto.getOccupiedUntil() != null) {
			property.setOccupiedUntil(propertyDto.getOccupiedUntil());
		}

		Property savedProperty = propertyRepository.save(property);
		return convertToDto(savedProperty);
	}

	public void deleteProperty(Long id) {
		if (!propertyRepository.existsById(id)) {
			throw new RuntimeException("Property not found");
		}
		propertyRepository.deleteById(id);
	}

	/**
	 * OPERACIÓN TRANSACCIONAL: Aplicar descuento por ciudad Esta operación
	 * actualiza múltiples propiedades de forma atómica
	 */
	@Transactional
	public String applyDiscountToCity(String city, Double discountPercentage) {
		List<Property> properties = propertyRepository.findByCity(city);

		if (properties.isEmpty()) {
			throw new RuntimeException("No se encontraron propiedades en la ciudad: " + city);
		}

		if (discountPercentage < 0 || discountPercentage > 50) {
			throw new RuntimeException("El descuento debe estar entre 0% y 50%");
		}

		int updatedCount = 0;
		Double discountFactor = 1 - (discountPercentage / 100);

		for (Property property : properties) {
			BigDecimal oldPrice = property.getPrice();
			BigDecimal newPrice = oldPrice.multiply(BigDecimal.valueOf(discountFactor));
			property.setPrice(newPrice);
			updatedCount++;
		}

		propertyRepository.saveAll(properties);

		return String.format("Descuento del %.1f%% aplicado a %d propiedades en %s", discountPercentage, updatedCount,
				city);
	}

	/**
	 * OPERACIÓN TRANSACCIONAL: Actualización masiva de disponibilidad Útil para
	 * operaciones administrativas de fin de mes
	 */
	@Transactional
	public String updateAvailabilityByOwner(String ownerUsername, boolean available) {
		User owner = userRepository.findByUsername(ownerUsername)
				.orElseThrow(() -> new RuntimeException("Propietario no encontrado"));

		List<Property> properties = propertyRepository.findByOwnerId(owner.getId());

		if (properties.isEmpty()) {
			throw new RuntimeException("El usuario no tiene propiedades registradas");
		}

		int updatedCount = 0;
		for (Property property : properties) {
			if (property.getAvailable() != available) {
				property.setAvailable(available);
				if (!available) {
					property.setOccupiedUntil(LocalDateTime.now().plusMonths(1));
				} else {
					property.setOccupiedUntil(null);
				}
				updatedCount++;
			}
		}

		propertyRepository.saveAll(properties);

		String status = available ? "disponibles" : "ocupadas";
		return String.format("%d propiedades de %s marcadas como %s", updatedCount, ownerUsername, status);
	}

	/**
	 * OPERACIÓN TRANSACCIONAL: Incremento de precios por inflación Operación
	 * administrativa útil para ajustes anuales
	 */
	@Transactional
	public String applyInflationAdjustment(Double inflationPercentage) {
		if (inflationPercentage < 0 || inflationPercentage > 20) {
			throw new RuntimeException("El ajuste por inflación debe estar entre 0% y 20%");
		}

		List<Property> allProperties = propertyRepository.findAll();

		if (allProperties.isEmpty()) {
			throw new RuntimeException("No hay propiedades en el sistema");
		}

		Double adjustmentFactor = 1 + (inflationPercentage / 100);

		for (Property property : allProperties) {
			BigDecimal oldPrice = property.getPrice();
			BigDecimal newPrice = oldPrice.multiply(BigDecimal.valueOf(adjustmentFactor));
			// Redondear a 2 decimales
			newPrice = newPrice.setScale(2, BigDecimal.ROUND_HALF_UP);
			property.setPrice(newPrice);
		}

		propertyRepository.saveAll(allProperties);

		return String.format("Ajuste por inflación del %.1f%% aplicado a %d propiedades", inflationPercentage,
				allProperties.size());
	}

	public void markPropertyAsOccupied(Long propertyId, LocalDateTime occupiedUntil) {
		Property property = propertyRepository.findById(propertyId)
				.orElseThrow(() -> new RuntimeException("Property not found"));
		property.setAvailable(false);
		property.setOccupiedUntil(occupiedUntil);
		propertyRepository.save(property);
	}

	public void markPropertyAsAvailable(Long propertyId) {
		Property property = propertyRepository.findById(propertyId)
				.orElseThrow(() -> new RuntimeException("Property not found"));
		property.setAvailable(true);
		property.setOccupiedUntil(null);
		propertyRepository.save(property);
	}

	private PropertyDto convertToDto(Property property) {
		PropertyDto dto = new PropertyDto();
		dto.setId(property.getId());
		dto.setTitle(property.getTitle());
		dto.setDescription(property.getDescription());
		dto.setAddress(property.getAddress());
		dto.setCity(property.getCity());
		dto.setPrice(property.getPrice());
		dto.setBedrooms(property.getBedrooms());
		dto.setBathrooms(property.getBathrooms());
		dto.setAvailable(property.getAvailable());
		dto.setOwnerUsername(property.getOwner().getUsername());
		dto.setImages(property.getImages());
		dto.setOccupiedUntil(property.getOccupiedUntil());
		if (property.getCategory() != null) {
			dto.setCategoryName(property.getCategory().getName());
		}
		return dto;
	}
}