package com.rentmenow.service;

import com.rentmenow.dto.ReportDto;
import com.rentmenow.repository.PropertyRepository;
import com.rentmenow.repository.RentalRepository;
import com.rentmenow.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class ReportService {

	private final PropertyRepository propertyRepository;
	private final RentalRepository rentalRepository;
	private final PaymentRepository paymentRepository;

	public ReportService(PropertyRepository propertyRepository, RentalRepository rentalRepository,
			PaymentRepository paymentRepository) {
		this.propertyRepository = propertyRepository;
		this.rentalRepository = rentalRepository;
		this.paymentRepository = paymentRepository;
	}

	// INFORME DE RESULTADOS: Resumen financiero extraído de colección de datos
	public ReportDto generateFinancialReport() {
		BigDecimal totalRevenue = paymentRepository.getTotalPaidAmount();
		if (totalRevenue == null)
			totalRevenue = BigDecimal.ZERO;

		Long totalProperties = propertyRepository.count();
		Long totalRentals = rentalRepository.count();

		Double avgPrice = propertyRepository.getAveragePrice();
		BigDecimal averageRent = avgPrice != null ? BigDecimal.valueOf(avgPrice) : BigDecimal.ZERO;

		return new ReportDto("Financial Report", totalRevenue, totalProperties, totalRentals, averageRent);
	}
}