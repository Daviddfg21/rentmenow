package com.rentmenow.repository;

import com.rentmenow.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
	List<Maintenance> findByPropertyId(Long propertyId);

	List<Maintenance> findByStatus(String status);
}