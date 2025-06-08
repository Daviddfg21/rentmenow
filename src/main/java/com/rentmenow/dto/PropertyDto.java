package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

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
}