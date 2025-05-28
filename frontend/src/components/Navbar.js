import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	const toggleMenu = () => setMenuOpen(!menuOpen);

	const handleLogout = () => {
		onLogout();
		navigate('/login');
	};

	return (
		<nav className="navbar">
			<div className="navbar-brand">
				<Link to="/" className="logo">🏠 RentMeNow</Link>
				<button className="menu-toggle" onClick={toggleMenu}>☰</button>
			</div>

			<div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
				<Link to="/" className="nav-item">Dashboard</Link>
				<Link to="/properties" className="nav-item">Propiedades</Link>
				<Link to="/rentals" className="nav-item">Contratos</Link>
				<Link to="/messages" className="nav-item">Mensajes</Link>
				{user.role === 'ADMIN' && <Link to="/admin" className="nav-item">Admin</Link>}
			</div>

			<div className="navbar-user">
				<span className="user-name">{user.fullName}</span>
				<div className="user-menu">
					<Link to="/profile" className="menu-item">Perfil</Link>
					<button className="menu-item logout" onClick={handleLogout}>Cerrar sesión</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;