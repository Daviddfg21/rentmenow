import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
import PropertyDetail from './components/PropertyDetail';
import PropertyForm from './components/PropertyForm';
import Rentals from './components/Rentals';
import RentalDetail from './components/RentalDetail';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Admin from './components/Admin';
import './styles/App.css';

function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Verificar si hay usuario en localStorage
		const savedUser = localStorage.getItem('rentmenow_user');
		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
		setLoading(false);
	}, []);

	const handleLogin = (userData) => {
		setUser(userData);
		localStorage.setItem('rentmenow_user', JSON.stringify(userData));
	};

	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem('rentmenow_user');
	};

	if (loading) {
		return <div className="loading">Cargando...</div>;
	}

	return (
		<BrowserRouter>
			<div className="App">
				{user && <Navbar user={user} onLogout={handleLogout} />}
				<main className="main-content">
					<Routes>
						{!user ? (
							<>
								<Route path="/login" element={<Login onLogin={handleLogin} />} />
								<Route path="*" element={<Navigate to="/login" />} />
							</>
						) : (
							<>
								<Route path="/" element={<Dashboard user={user} />} />
								<Route path="/properties" element={<Properties user={user} />} />
								<Route path="/properties/:id" element={<PropertyDetail user={user} />} />
								<Route path="/properties/new" element={<PropertyForm user={user} />} />
								<Route path="/properties/edit/:id" element={<PropertyForm user={user} />} />
								<Route path="/rentals" element={<Rentals user={user} />} />
								<Route path="/rentals/:id" element={<RentalDetail user={user} />} />
								<Route path="/profile" element={<Profile user={user} />} />
								<Route path="/messages" element={<Messages user={user} />} />
								{user.role === 'ADMIN' && <Route path="/admin" element={<Admin user={user} />} />}
								<Route path="*" element={<Navigate to="/" />} />
							</>
						)}
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;