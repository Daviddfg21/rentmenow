package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDto {
	private Long id;
	private String title;
	private String description;
	private String address;
	private String city;
	private BigDecimal price;
	private Integer bedrooms;
	private Integer bathrooms;
	private Boolean available;
	private String ownerUsername;
	private String categoryName;
	private List<String> images = new ArrayList<>();
	private LocalDateTime occupiedUntil;
}