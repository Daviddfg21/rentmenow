package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {
	private String title;
	private BigDecimal totalRevenue;
	private Long totalProperties;
	private Long totalRentals;
	private BigDecimal averageRent;
}