import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPropertyById, deleteProperty } from '../services/api';

const PropertyDetail = ({ user }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [property, setProperty] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProperty = async () => {
			try {
				const data = await getPropertyById(id);
				setProperty(data);
			} catch (error) {
				console.error('Error fetching property:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProperty();
	}, [id]);

	const handleDelete = async () => {
		if (window.confirm('¿Está seguro de eliminar esta propiedad?')) {
			try {
				await deleteProperty(id);
				navigate('/properties');
			} catch (error) {
				console.error('Error deleting property:', error);
			}
		}
	};

	if (loading) {
		return <div className="loading">Cargando propiedad...</div>;
	}

	if (!property) {
		return <div className="error">Propiedad no encontrada</div>;
	}

	const isOwner = property.owner.id === user.id;

	return (
		<div className="property-detail">
			<div className="detail-header">
				<h1>{property.title}</h1>
				<div className="header-actions">
					{isOwner && (
						<>
							<Link to={`/properties/edit/${property.id}`} className="btn-edit">Editar</Link>
							<button onClick={handleDelete} className="btn-delete">Eliminar</button>
						</>
					)}
					<Link to="/properties" className="btn-back">Volver</Link>
				</div>
			</div>

			<div className="property-gallery">
				{property.images && property.images.length > 0 ? (
					<img
						src={property.images[0].imageUrl}
						alt={property.title}
						className="main-image"
					/>
				) : (
					<div className="placeholder-image">No hay imágenes disponibles</div>
				)}
			</div>

			<div className="property-content">
				<div className="property-main-info">
					<div className="price-status">
						<h2 className="property-price">${property.price}/mes</h2>
						<span className={`status-badge ${property.status.toLowerCase()}`}>
							{property.status === 'AVAILABLE' ? 'Disponible' :
								property.status === 'RENTED' ? 'Alquilada' : property.status}
						</span>
					</div>

					<p className="property-address">
						{property.address}, {property.city} {property.postalCode}
					</p>

					<div className="property-features">
						<div className="feature">
							<span className="feature-value">{property.bedrooms}</span>
							<span className="feature-label">Habitaciones</span>
						</div>
						<div className="feature">
							<span className="feature-value">{property.bathrooms}</span>
							<span className="feature-label">Baños</span>
						</div>
						<div className="feature">
							<span className="feature-value">{property.area} m²</span>
							<span className="feature-label">Área</span>
						</div>
					</div>
				</div>

				<div className="property-description">
					<h3>Descripción</h3>
					<p>{property.description}</p>
				</div>

				<div className="property-details">
					<h3>Detalles</h3>
					<div className="details-grid">
						<div className="detail-item">
							<span className="detail-label">Tipo:</span>
							<span className="detail-value">
								{property.type === 'APARTMENT' ? 'Apartamento' :
									property.type === 'HOUSE' ? 'Casa' :
										property.type === 'STUDIO' ? 'Estudio' :
											property.type === 'ROOM' ? 'Habitación' :
												property.type === 'OFFICE' ? 'Oficina' :
													property.type === 'COMMERCIAL' ? 'Local comercial' : property.type}
							</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Amueblado:</span>
							<span className="detail-value">{property.furnished ? 'Sí' : 'No'}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Mascotas:</span>
							<span className="detail-value">{property.petsAllowed ? 'Permitidas' : 'No permitidas'}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Garaje:</span>
							<span className="detail-value">{property.hasGarage ? 'Sí' : 'No'}</span>
						</div>
					</div>
				</div>

				<div className="property-owner">
					<h3>Propietario</h3>
					<div className="owner-info">
						<div className="owner-avatar">
							{property.owner.fullName.charAt(0)}
						</div>
						<div className="owner-details">
							<p className="owner-name">{property.owner.fullName}</p>
							<p className="owner-contact">{property.owner.email}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="property-actions">
				{property.status === 'AVAILABLE' && !isOwner && (
					<button className="btn-primary">Solicitar información</button>
				)}
				{isOwner && property.status === 'AVAILABLE' && (
					<button className="btn-primary">Crear contrato</button>
				)}
			</div>
		</div>
	);
};

export default PropertyDetail;