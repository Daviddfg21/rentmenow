package com.rentmenow.repository;

import com.rentmenow.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
	List<Property> findByAvailableTrue();

	List<Property> findByOwnerId(Long ownerId);

	List<Property> findByCity(String city);

	@Query("SELECT AVG(p.price) FROM Property p")
	Double getAveragePrice();
}