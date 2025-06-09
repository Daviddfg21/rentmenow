package com.rentmenow.repository;

import com.rentmenow.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	List<Payment> findByRentalId(Long rentalId);

	List<Payment> findByStatus(String status);

	// COALESCE devuelve 0 si no hay pagos (en lugar de NULL)
	@Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'PAID'")
	BigDecimal getTotalPaidAmount();
}