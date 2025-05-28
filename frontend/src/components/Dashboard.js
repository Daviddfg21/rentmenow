import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/api';

const Dashboard = ({ user }) => {
	const [stats, setStats] = useState({
		properties: 0,
		rentals: 0,
		messages: 0
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await getStats(user.id);
				setStats(data);
			} catch (error) {
				console.error('Error fetching stats:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [user.id]);

	if (loading) {
		return <div className="loading">Cargando estadísticas...</div>;
	}

	return (
		<div className="dashboard">
			<h1>Bienvenido, {user.fullName}</h1>

			<div className="stats-grid">
				<div className="stat-card">
					<h3>Propiedades</h3>
					<p className="stat-value">{stats.properties}</p>
					<Link to="/properties" className="stat-link">Ver propiedades</Link>
				</div>

				<div className="stat-card">
					<h3>Contratos</h3>
					<p className="stat-value">{stats.rentals}</p>
					<Link to="/rentals" className="stat-link">Ver contratos</Link>
				</div>

				<div className="stat-card">
					<h3>Mensajes</h3>
					<p className="stat-value">{stats.messages}</p>
					<Link to="/messages" className="stat-link">Ver mensajes</Link>
				</div>
			</div>

			<div className="quick-actions">
				<h2>Acciones rápidas</h2>
				<div className="actions-grid">
					<Link to="/properties/new" className="action-btn">
						Agregar propiedad
					</Link>
					{/* Más acciones rápidas según el rol */}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;