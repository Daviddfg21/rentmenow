package com.rentmenow.controller;

import com.rentmenow.repository.PropertyRepository;
import com.rentmenow.repository.RentalRepository;
import com.rentmenow.repository.PaymentRepository;
import com.rentmenow.repository.UserRepository;
import com.rentmenow.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

	private final PropertyRepository propertyRepository;
	private final RentalRepository rentalRepository;
	private final PaymentRepository paymentRepository;
	private final UserRepository userRepository;
	private final ReportService reportService;

	public DebugController(PropertyRepository propertyRepository, RentalRepository rentalRepository,
			PaymentRepository paymentRepository, UserRepository userRepository, ReportService reportService) {
		this.propertyRepository = propertyRepository;
		this.rentalRepository = rentalRepository;
		this.paymentRepository = paymentRepository;
		this.userRepository = userRepository;
		this.reportService = reportService;
	}

	@GetMapping("/full-debug")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Map<String, Object>> getFullDebug() {
		Map<String, Object> debug = new HashMap<>();

		// 1. Conteos directos de tablas
		debug.put("directCounts", Map.of("users", userRepository.count(), "properties", propertyRepository.count(),
				"rentals", rentalRepository.count(), "payments", paymentRepository.count()));

		// 2. Consultas específicas
		debug.put("queries", Map.of("averagePrice", propertyRepository.getAveragePrice(), "totalPaidAmount",
				paymentRepository.getTotalPaidAmount()));

		// 3. Report service result
		debug.put("reportService", reportService.generateFinancialReport());

		// 4. Raw data (primeros registros)
		debug.put("sampleData",
				Map.of("properties", propertyRepository.findAll(), "rentals", rentalRepository.findAll(), "payments",
						paymentRepository.findAll(), "users",
						userRepository.findAll().stream()
								.map(u -> Map.of("id", u.getId(), "username", u.getUsername(), "role", u.getRole()))
								.toList()));

		return ResponseEntity.ok(debug);
	}

	@GetMapping("/simple-counts")
	public ResponseEntity<Map<String, Object>> getSimpleCounts() {
		Map<String, Object> counts = new HashMap<>();
		counts.put("properties", propertyRepository.count());
		counts.put("rentals", rentalRepository.count());
		counts.put("payments", paymentRepository.count());
		counts.put("users", userRepository.count());
		return ResponseEntity.ok(counts);
	}
}