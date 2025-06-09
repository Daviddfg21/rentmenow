package com.rentmenow.repository;

import com.rentmenow.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
	List<Rental> findByTenantId(Long tenantId);

	List<Rental> findByPropertyId(Long propertyId);

	List<Rental> findByStatus(String status);

	List<Rental> findByPropertyIdAndStatus(Long propertyId, String status);

	List<Rental> findByPropertyOwnerId(Long ownerId);

	@Query("SELECT SUM(r.monthlyRent) FROM Rental r WHERE r.status = 'APPROVED'")
	BigDecimal getTotalActiveRentRevenue();
}