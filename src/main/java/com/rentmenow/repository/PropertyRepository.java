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

	// COALESCE devuelve 0.0 si no hay propiedades (en lugar de NULL)
	@Query("SELECT COALESCE(AVG(CAST(p.price AS double)), 0.0) FROM Property p")
	Double getAveragePrice();
}