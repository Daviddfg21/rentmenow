package com.rentmenow.repository;

import com.rentmenow.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Rental
 */
@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

	// Buscar por inquilino
	List<Rental> findByTenantId(Long tenantId);

	// Buscar por propietario
	List<Rental> findByLandlordId(Long landlordId);

	// Buscar por propiedad
	List<Rental> findByPropertyId(Long propertyId);

	// Buscar contrato activo de una propiedad
	Optional<Rental> findByPropertyIdAndStatus(Long propertyId, Rental.RentalStatus status);

	// Buscar por estado
	List<Rental> findByStatus(Rental.RentalStatus status);

	// Buscar contratos que expiran pronto
	@Query("SELECT r FROM Rental r WHERE r.endDate BETWEEN :startDate AND :endDate AND r.status = 'ACTIVE'")
	List<Rental> findExpiringRentals(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	// Buscar contratos activos de un inquilino
	List<Rental> findByTenantIdAndStatus(Long tenantId, Rental.RentalStatus status);

	// Buscar contratos activos de un propietario
	List<Rental> findByLandlordIdAndStatus(Long landlordId, Rental.RentalStatus status);

	// Contar contratos por estado
	long countByStatus(Rental.RentalStatus status);

	// Estadística: ingresos totales de un propietario
	@Query("SELECT COALESCE(SUM(r.monthlyRent), 0) FROM Rental r WHERE r.landlord.id = :landlordId AND r.status = 'ACTIVE'")
	Double getTotalMonthlyIncomeByLandlord(@Param("landlordId") Long landlordId);

	// Estadística: gastos totales de un inquilino
	@Query("SELECT COALESCE(SUM(r.monthlyRent), 0) FROM Rental r WHERE r.tenant.id = :tenantId AND r.status = 'ACTIVE'")
	Double getTotalMonthlyExpensesByTenant(@Param("tenantId") Long tenantId);
}