import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../services/api';

const Properties = ({ user }) => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // all, mine, available

	useEffect(() => {
		const fetchProperties = async () => {
			try {
				const data = await getProperties(filter, user.id);
				setProperties(data);
			} catch (error) {
				console.error('Error fetching properties:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProperties();
	}, [filter, user.id]);

	if (loading) {
		return <div className="loading">Cargando propiedades...</div>;
	}

	return (
		<div className="properties-page">
			<div className="page-header">
				<h1>Propiedades</h1>
				<Link to="/properties/new" className="btn-primary">Crear propiedad</Link>
			</div>

			<div className="filters">
				<button
					className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
					onClick={() => setFilter('all')}
				>
					Todas
				</button>
				<button
					className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
					onClick={() => setFilter('mine')}
				>
					Mis propiedades
				</button>
				<button
					className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
					onClick={() => setFilter('available')}
				>
					Disponibles
				</button>
			</div>

			<div className="properties-grid">
				{properties.length === 0 ? (
					<div className="empty-state">
						<p>No hay propiedades para mostrar</p>
					</div>
				) : (
					properties.map(property => (
						<div key={property.id} className="property-card">
							<div className="property-image">
								{property.images && property.images.length > 0 ? (
									<img src={property.images[0].imageUrl} alt={property.title} />
								) : (
									<div className="placeholder-image">🏠</div>
								)}
								<span className={`status-badge ${property.status.toLowerCase()}`}>
									{property.status === 'AVAILABLE' ? 'Disponible' :
										property.status === 'RENTED' ? 'Alquilada' : property.status}
								</span>
							</div>

							<div className="property-info">
								<h3>{property.title}</h3>
								<p className="property-location">{property.city}</p>
								<p className="property-price">${property.price}/mes</p>
								<div className="property-features">
									<span>{property.bedrooms} hab</span>
									<span>{property.bathrooms} baños</span>
									<span>{property.area} m²</span>
								</div>
								<div className="property-actions">
									<Link to={`/properties/${property.id}`} className="btn-view">Ver</Link>
									{property.owner.id === user.id && (
										<Link to={`/properties/edit/${property.id}`} className="btn-edit">Editar</Link>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Properties;