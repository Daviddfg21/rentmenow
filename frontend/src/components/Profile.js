import React, { useState } from 'react';

const Profile = ({ user }) => {
	const [form, setForm] = useState({
		fullName: user.fullName,
		email: user.email,
		phone: user.phone || '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
	const [editing, setEditing] = useState(false);
	const [message, setMessage] = useState('');

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setMessage('Perfil actualizado (simulado)');
		setEditing(false);
		// Aquí iría la llamada real a la API
	};

	return (
		<div className="profile-page">
			<h1>Mi Perfil</h1>

			{message && <div className="success-message">{message}</div>}

			<div className="profile-card">
				<div className="profile-header">
					<div className="profile-avatar">
						{user.fullName.charAt(0)}
					</div>
					<div className="profile-info">
						<h2>{user.fullName}</h2>
						<p className="profile-username">@{user.username}</p>
						<p className="profile-role">
							{user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
						</p>
					</div>
				</div>

				{!editing ? (
					<div className="profile-details">
						<div className="detail-item">
							<span className="detail-label">Nombre completo:</span>
							<span className="detail-value">{user.fullName}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Email:</span>
							<span className="detail-value">{user.email}</span>
						</div>
						<div className="detail-item">
							<span className="detail-label">Teléfono:</span>
							<span className="detail-value">{user.phone || 'No especificado'}</span>
						</div>

						<button
							className="btn-edit"
							onClick={() => setEditing(true)}
						>
							Editar Perfil
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="profile-form">
						<div className="form-group">
							<label htmlFor="fullName">Nombre completo</label>
							<input
								type="text"
								id="fullName"
								name="fullName"
								value={form.fullName}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="phone">Teléfono</label>
							<input
								type="tel"
								id="phone"
								name="phone"
								value={form.phone}
								onChange={handleChange}
							/>
						</div>

						<h3>Cambiar Contraseña</h3>

						<div className="form-group">
							<label htmlFor="currentPassword">Contraseña actual</label>
							<input
								type="password"
								id="currentPassword"
								name="currentPassword"
								value={form.currentPassword}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="newPassword">Nueva contraseña</label>
							<input
								type="password"
								id="newPassword"
								name="newPassword"
								value={form.newPassword}
								onChange={handleChange}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="confirmPassword">Confirmar contraseña</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={form.confirmPassword}
								onChange={handleChange}
							/>
						</div>

						<div className="form-actions">
							<button
								type="button"
								className="btn-cancel"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</button>
							<button type="submit" className="btn-save">
								Guardar Cambios
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
};

export default Profile;