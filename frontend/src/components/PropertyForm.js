import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, createProperty, updateProperty } from '../services/api';

const PropertyForm = ({ user }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditing = !!id;

	const [form, setForm] = useState({
		title: '',
		description: '',
		type: 'APARTMENT',
		address: '',
		city: '',
		postalCode: '',
		price: '',
		bedrooms: 1,
		bathrooms: 1,
		area: '',
		furnished: false,
		petsAllowed: false,
		hasGarage: false
	});

	const [loading, setLoading] = useState(isEditing);
	const [error, setError] = useState('');

	useEffect(() => {
		if (isEditing) {
			const fetchProperty = async () => {
				try {
					const data = await getPropertyById(id);
					setForm({
						title: data.title,
						description: data.description,
						type: data.type,
						address: data.address,
						city: data.city,
						postalCode: data.postalCode || '',
						price: data.price,
						bedrooms: data.bedrooms,
						bathrooms: data.bathrooms,
						area: data.area || '',
						furnished: data.furnished,
						petsAllowed: data.petsAllowed,
						hasGarage: data.hasGarage
					});
				} catch (error) {
					console.error('Error fetching property:', error);
					setError('Error al cargar la propiedad');
				} finally {
					setLoading(false);
				}
			};

			fetchProperty();
		}
	}, [id, isEditing]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm({
			...form,
			[name]: type === 'checkbox' ? checked : value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		try {
			const propertyData = {
				...form,
				price: parseFloat(form.price),
				area: form.area ? parseFloat(form.area) : null
			};

			if (isEditing) {
				await updateProperty(id, propertyData);
			} else {
				await createProperty(propertyData, user.id);
			}

			navigate('/properties');
		} catch (error) {
			console.error('Error saving property:', error);
			setError('Error al guardar la propiedad');
		}
	};

	if (loading) {
		return <div className="loading">Cargando...</div>;
	}

	return (
		<div className="property-form-page">
			<h1>{isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}</h1>

			{error && <div className="error">{error}</div>}

			<form onSubmit={handleSubmit} className="property-form">
				<div className="form-group">
					<label htmlFor="title">Título*</label>
					<input
						type="text"
						id="title"
						name="title"
						value={form.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="description">Descripción</label>
					<textarea
						id="description"
						name="description"
						value={form.description}
						onChange={handleChange}
						rows="4"
					/>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label htmlFor="type">Tipo*</label>
						<select
							id="type"
							name="type"
							value={form.type}
							onChange={handleChange}
							required
						>
							<option value="APARTMENT">Apartamento</option>
							<option value="HOUSE">Casa</option>
							<option value="STUDIO">Estudio</option>
							<option value="ROOM">Habitación</option>
							<option value="OFFICE">Oficina</option>
							<option value="COMMERCIAL">Local comercial</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="price">Precio mensual*</label>
						<input
							type="number"
							id="price"
							name="price"
							value={form.price}
							onChange={handleChange}
							min="0"
							step="0.01"
							required
						/>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="address">Dirección*</label>
					<input
						type="text"
						id="address"
						name="address"
						value={form.address}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label htmlFor="city">Ciudad*</label>
						<input
							type="text"
							id="city"
							name="city"
							value={form.city}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="postalCode">Código Postal</label>
						<input
							type="text"
							id="postalCode"
							name="postalCode"
							value={form.postalCode}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label htmlFor="bedrooms">Habitaciones*</label>
						<input
							type="number"
							id="bedrooms"
							name="bedrooms"
							value={form.bedrooms}
							onChange={handleChange}
							min="0"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="bathrooms">Baños*</label>
						<input
							type="number"
							id="bathrooms"
							name="bathrooms"
							value={form.bathrooms}
							onChange={handleChange}
							min="0"
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="area">Área (m²)</label>
						<input
							type="number"
							id="area"
							name="area"
							value={form.area}
							onChange={handleChange}
							min="0"
							step="0.01"
						/>
					</div>
				</div>

				<div className="form-row checkboxes">
					<div className="form-group checkbox">
						<input
							type="checkbox"
							id="furnished"
							name="furnished"
							checked={form.furnished}
							onChange={handleChange}
						/>
						<label htmlFor="furnished">Amueblado</label>
					</div>

					<div className="form-group checkbox">
						<input
							type="checkbox"
							id="petsAllowed"
							name="petsAllowed"
							checked={form.petsAllowed}
							onChange={handleChange}
						/>
						<label htmlFor="petsAllowed">Mascotas permitidas</label>
					</div>

					<div className="form-group checkbox">
						<input
							type="checkbox"
							id="hasGarage"
							name="hasGarage"
							checked={form.hasGarage}
							onChange={handleChange}
						/>
						<label htmlFor="hasGarage">Garaje</label>
					</div>
				</div>

				<div className="form-actions">
					<button type="button" className="btn-secondary" onClick={() => navigate('/properties')}>
						Cancelar
					</button>
					<button type="submit" className="btn-primary">
						{isEditing ? 'Actualizar' : 'Crear'} Propiedad
					</button>
				</div>
			</form>
		</div>
	);
};

export default PropertyForm;