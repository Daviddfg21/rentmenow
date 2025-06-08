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

		Property savedProperty = propertyRepository.save(property);
		return convertToDto(savedProperty);
	}

	public void deleteProperty(Long id) {
		if (!propertyRepository.existsById(id)) {
			throw new RuntimeException("Property not found");
		}
		propertyRepository.deleteById(id);
	}

	// OPERACIÓN TRANSACCIONAL: Aplicar descuento a todas las propiedades de una
	// ciudad
	@Transactional
	public void applyDiscountToCity(String city, Double discountPercentage) {
		List<Property> properties = propertyRepository.findByCity(city);
		properties.forEach(property -> {
			Double discountFactor = 1 - (discountPercentage / 100);
			property.setPrice(property.getPrice().multiply(java.math.BigDecimal.valueOf(discountFactor)));
		});
		propertyRepository.saveAll(properties);
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
		if (property.getCategory() != null) {
			dto.setCategoryName(property.getCategory().getName());
		}
		return dto;
	}
}