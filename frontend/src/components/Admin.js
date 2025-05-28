import React, { useState, useEffect } from 'react';

const Admin = ({ user }) => {
	const [activeTab, setActiveTab] = useState('dashboard');

	// Datos simulados para demostración rápida
	const [stats] = useState({
		users: 45,
		properties: 120,
		rentals: 78,
		activeRentals: 65,
		pendingBookings: 12
	});

	const [users] = useState([
		{ id: 1, username: 'admin', fullName: 'Administrador', email: 'admin@example.com', role: 'ADMIN', active: true },
		{ id: 2, username: 'juan', fullName: 'Juan Pérez', email: 'juan@example.com', role: 'USER', active: true },
		{ id: 3, username: 'maria', fullName: 'María López', email: 'maria@example.com', role: 'USER', active: true },
		{ id: 4, username: 'carlos', fullName: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'USER', active: false }
	]);

	return (
		<div className="admin-page">
			<h1>Panel de Administración</h1>

			<div className="admin-tabs">
				<button
					className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
					onClick={() => setActiveTab('dashboard')}
				>
					Dashboard
				</button>
				<button
					className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
					onClick={() => setActiveTab('users')}
				>
					Usuarios
				</button>
				<button
					className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
					onClick={() => setActiveTab('properties')}
				>
					Propiedades
				</button>
				<button
					className={`tab-btn ${activeTab === 'rentals' ? 'active' : ''}`}
					onClick={() => setActiveTab('rentals')}
				>
					Contratos
				</button>
			</div>

			<div className="admin-content">
				{activeTab === 'dashboard' && (
					<div className="admin-dashboard">
						<div className="stats-grid">
							<div className="stat-card">
								<h3>Usuarios</h3>
								<p className="stat-value">{stats.users}</p>
							</div>
							<div className="stat-card">
								<h3>Propiedades</h3>
								<p className="stat-value">{stats.properties}</p>
							</div>
							<div className="stat-card">
								<h3>Contratos</h3>
								<p className="stat-value">{stats.rentals}</p>
							</div>
							<div className="stat-card">
								<h3>Contratos Activos</h3>
								<p className="stat-value">{stats.activeRentals}</p>
							</div>
							<div className="stat-card">
								<h3>Reservas Pendientes</h3>
								<p className="stat-value">{stats.pendingBookings}</p>
							</div>
						</div>

						<div className="admin-actions">
							<h2>Acciones rápidas</h2>
							<div className="actions-grid">
								<button className="action-btn">Aprobar Propiedades</button>
								<button className="action-btn">Gestionar Usuarios</button>
								<button className="action-btn">Ver Reportes</button>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'users' && (
					<div className="admin-users">
						<h2>Gestión de Usuarios</h2>

						<table className="users-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Usuario</th>
									<th>Nombre</th>
									<th>Email</th>
									<th>Rol</th>
									<th>Estado</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{users.map(user => (
									<tr key={user.id}>
										<td>{user.id}</td>
										<td>{user.username}</td>
										<td>{user.fullName}</td>
										<td>{user.email}</td>
										<td>
											<span className={`role-badge ${user.role.toLowerCase()}`}>
												{user.role}
											</span>
										</td>
										<td>
											<span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
												{user.active ? 'Activo' : 'Inactivo'}
											</span>
										</td>
										<td className="actions-cell">
											<button className="btn-sm btn-edit">Editar</button>
											<button className="btn-sm btn-toggle">
												{user.active ? 'Desactivar' : 'Activar'}
											</button>
											{user.role !== 'ADMIN' && (
												<button className="btn-sm btn-promote">
													Promover a Admin
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{activeTab === 'properties' && (
					<div className="admin-properties">
						<h2>Gestión de Propiedades</h2>
						<p>Implementación simplificada: Panel para revisar y moderar propiedades</p>
					</div>
				)}

				{activeTab === 'rentals' && (
					<div className="admin-rentals">
						<h2>Gestión de Contratos</h2>
						<p>Implementación simplificada: Panel para revisar contratos y resolver disputas</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Admin;