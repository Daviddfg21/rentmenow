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

	public ReportDto generateFinancialReport() {
		// Obtener conteos reales
		Long totalProperties = propertyRepository.count();
		Long totalRentals = rentalRepository.count();

		// Obtener ingresos totales - manejo seguro de null
		BigDecimal totalRevenue = paymentRepository.getTotalPaidAmount();
		if (totalRevenue == null) {
			totalRevenue = BigDecimal.ZERO;
		}

		// Calcular renta promedio - solo si hay propiedades
		BigDecimal averageRent = BigDecimal.ZERO;
		if (totalProperties > 0) {
			Double avgPrice = propertyRepository.getAveragePrice();
			if (avgPrice != null && avgPrice > 0) {
				averageRent = BigDecimal.valueOf(avgPrice);
			}
		}

		// Log para debug
		System.out.println("📊 REPORT DEBUG:");
		System.out.println("   - Properties count: " + totalProperties);
		System.out.println("   - Rentals count: " + totalRentals);
		System.out.println("   - Total revenue: €" + totalRevenue);
		System.out.println("   - Average rent: €" + averageRent);

		return new ReportDto("Financial Report", totalRevenue, totalProperties, totalRentals, averageRent);
	}
}