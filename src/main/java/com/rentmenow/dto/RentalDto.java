package com.rentmenow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentalDto {
	private Long id;
	private Long propertyId;
	private String propertyTitle;
	private Long tenantId;
	private String tenantUsername;
	private LocalDate startDate;
	private LocalDate endDate;
	private BigDecimal monthlyRent;
	private String status;
	private LocalDateTime createdAt;
	private LocalDateTime approvedAt;
	private LocalDateTime rejectedAt;
	private String requestMessage;
	private String responseMessage;
}