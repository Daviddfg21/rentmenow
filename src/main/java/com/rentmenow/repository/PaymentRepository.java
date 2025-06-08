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

	@Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
	BigDecimal getTotalPaidAmount();
}