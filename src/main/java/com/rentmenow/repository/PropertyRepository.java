package com.rentmenow.repository;

import com.rentmenow.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repositorio para la entidad Property
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

	// Buscar por propietario
	List<Property> findByOwnerId(Long ownerId);

	// Buscar por estado
	List<Property> findByStatus(Property.PropertyStatus status);

	// Buscar propiedades disponibles
	List<Property> findByStatusOrderByCreatedAtDesc(Property.PropertyStatus status);

	// Buscar por ciudad
	List<Property> findByCityContainingIgnoreCase(String city);

	// Buscar por tipo
	List<Property> findByType(Property.PropertyType type);

	// Buscar en rango de precio
	List<Property> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

	// Búsqueda avanzada con filtros múltiples
	@Query("SELECT p FROM Property p WHERE "
			+ "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND "
			+ "(:type IS NULL OR p.type = :type) AND " + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
			+ "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " + "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) AND "
			+ "(:status IS NULL OR p.status = :status) AND " + "(:furnished IS NULL OR p.furnished = :furnished)")
	Page<Property> findWithFilters(@Param("city") String city, @Param("type") Property.PropertyType type,
			@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice,
			@Param("bedrooms") Integer bedrooms, @Param("status") Property.PropertyStatus status,
			@Param("furnished") Boolean furnished, Pageable pageable);

	// Contar propiedades por estado
	long countByStatus(Property.PropertyStatus status);

	// Contar propiedades por propietario
	long countByOwnerId(Long ownerId);

	// Buscar por título (contiene)
	List<Property> findByTitleContainingIgnoreCase(String title);
}