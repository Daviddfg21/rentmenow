import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRentals } from '../services/api';

const Rentals = ({ user }) => {
	const [rentals, setRentals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, tenant, landlord

	useEffect(() => {
		const fetchRentals = async () => {
			try {
				const data = await getRentals(user.id, filter);
				setRentals(data);
			} catch (error) {
				console.error('Error fetching rentals:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchRentals();
	}, [filter, user.id]);

	if (loading) {
		return <div className="loading">Cargando contratos...</div>;
	}

	return (
		<div className="rentals-page">
			<div className="page-header">
				<h1>Contratos de Alquiler</h1>
			</div>

			<div className="filters">
				<button
					className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
					onClick={() => setFilter('all')}
				>
					Todos
				</button>
				<button
					className={`filter-btn ${filter === 'tenant' ? 'active' : ''}`}
					onClick={() => setFilter('tenant')}
				>
					Como Inquilino
				</button>
				<button
					className={`filter-btn ${filter === 'landlord' ? 'active' : ''}`}
					onClick={() => setFilter('landlord')}
				>
					Como Propietario
				</button>
			</div>

			<div className="rentals-list">
				{rentals.length === 0 ? (
					<div className="empty-state">
						<p>No hay contratos para mostrar</p>
					</div>
				) : (
					rentals.map(rental => (
						<div key={rental.id} className="rental-card">
							<div className="rental-property">
								<h3>{rental.property.title}</h3>
								<p>{rental.property.address}, {rental.property.city}</p>
							</div>

							<div className="rental-details">
								<div className="rental-info">
									<p><strong>Inicio:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
									<p><strong>Fin:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
									<p><strong>Renta:</strong> ${rental.monthlyRent}/mes</p>
								</div>

								<div className="rental-parties">
									<p><strong>Propietario:</strong> {rental.landlord.fullName}</p>
									<p><strong>Inquilino:</strong> {rental.tenant.fullName}</p>
								</div>

								<div className="rental-status">
									<span className={`status-badge ${rental.status.toLowerCase()}`}>
										{rental.status === 'ACTIVE' ? 'Activo' :
											rental.status === 'EXPIRED' ? 'Expirado' :
												rental.status === 'TERMINATED' ? 'Terminado' :
													rental.status === 'PENDING' ? 'Pendiente' : rental.status}
									</span>
								</div>
							</div>

							<div className="rental-actions">
								<Link to={`/rentals/${rental.id}`} className="btn-view">Ver Detalles</Link>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Rentals;