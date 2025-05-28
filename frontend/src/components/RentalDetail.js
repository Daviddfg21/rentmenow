import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRentalById } from '../services/api';

const RentalDetail = ({ user }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [rental, setRental] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRental = async () => {
			try {
				const data = await getRentalById(id);
				setRental(data);
			} catch (error) {
				console.error('Error fetching rental:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchRental();
	}, [id]);

	if (loading) {
		return <div className="loading">Cargando contrato...</div>;
	}

	if (!rental) {
		return <div className="error">Contrato no encontrado</div>;
	}

	const isLandlord = rental.landlord.id === user.id;
	const isTenant = rental.tenant.id === user.id;

	return (
		<div className="rental-detail">
			<div className="detail-header">
				<h1>Contrato de Alquiler</h1>
				<Link to="/rentals" className="btn-back">Volver</Link>
			</div>

			<div className="rental-status-banner">
				<span className={`status-badge ${rental.status.toLowerCase()}`}>
					{rental.status === 'ACTIVE' ? 'Activo' :
						rental.status === 'EXPIRED' ? 'Expirado' :
							rental.status === 'TERMINATED' ? 'Terminado' :
								rental.status === 'PENDING' ? 'Pendiente' : rental.status}
				</span>
			</div>

			<div className="rental-content">
				<div className="rental-property-info">
					<h2>Propiedad</h2>
					<div className="property-card">
						<h3>{rental.property.title}</h3>
						<p className="property-address">{rental.property.address}, {rental.property.city}</p>
						<p className="property-features">
							{rental.property.bedrooms} hab | {rental.property.bathrooms} baños | {rental.property.area} m²
						</p>
						<Link to={`/properties/${rental.property.id}`} className="btn-view">Ver Propiedad</Link>
					</div>
				</div>

				<div className="rental-parties">
					<div className="party landlord">
						<h3>Propietario</h3>
						<div className="party-info">
							<div className="party-avatar">{rental.landlord.fullName.charAt(0)}</div>
							<div className="party-details">
								<p className="party-name">{rental.landlord.fullName}</p>
								<p className="party-email">{rental.landlord.email}</p>
								<p className="party-phone">{rental.landlord.phone || 'Sin teléfono'}</p>
							</div>
						</div>
					</div>

					<div className="party tenant">
						<h3>Inquilino</h3>
						<div className="party-info">
							<div className="party-avatar">{rental.tenant.fullName.charAt(0)}</div>
							<div className="party-details">
								<p className="party-name">{rental.tenant.fullName}</p>
								<p className="party-email">{rental.tenant.email}</p>
								<p className="party-phone">{rental.tenant.phone || 'Sin teléfono'}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="rental-details">
					<h2>Detalles del Contrato</h2>
					<div className="details-grid">
						<div className="detail-item">
							<span className="detail-label">Inicio:</span>
							<span className="detail-value">{new Date(rental.startDate).toLocaleDateString()}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Fin:</span>
							<span className="detail-value">{new Date(rental.endDate).toLocaleDateString()}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Renta Mensual:</span>
							<span className="detail-value">${rental.monthlyRent}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Depósito:</span>
							<span className="detail-value">${rental.deposit || 0}</span>
						</div>
					</div>
				</div>

				{rental.terms && (
					<div className="rental-terms">
						<h2>Términos y Condiciones</h2>
						<div className="terms-content">
							{rental.terms}
						</div>
					</div>
				)}

				<div className="rental-payments">
					<h2>Pagos</h2>
					{rental.payments && rental.payments.length > 0 ? (
						<div className="payments-list">
							{rental.payments.map(payment => (
								<div key={payment.id} className="payment-item">
									<div className="payment-date">
										<p className="payment-label">Fecha:</p>
										<p className="payment-value">{new Date(payment.paymentDate).toLocaleDateString()}</p>
									</div>
									<div className="payment-amount">
										<p className="payment-label">Monto:</p>
										<p className="payment-value">${payment.amount}</p>
									</div>
									<div className="payment-status">
										<span className={`status-badge ${payment.status.toLowerCase()}`}>
											{payment.status}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="no-payments">No hay pagos registrados</p>
					)}
				</div>
			</div>

			<div className="rental-actions">
				{rental.status === 'ACTIVE' && (
					<>
						{isLandlord && (
							<button className="btn-primary">Registrar Pago</button>
						)}
						{isTenant && (
							<button className="btn-primary">Ver Pagos Pendientes</button>
						)}
					</>
				)}
				{isLandlord && rental.status === 'ACTIVE' && (
					<button className="btn-danger">Terminar Contrato</button>
				)}
			</div>
		</div>
	);
};

export default RentalDetail;