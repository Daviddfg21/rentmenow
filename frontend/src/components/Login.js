import React, { useState } from 'react';
import { login, register } from '../services/auth';

const Login = ({ onLogin }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [form, setForm] = useState({
		username: '',
		password: '',
		email: '',
		fullName: ''
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			let response;
			if (isLogin) {
				response = await login(form.username, form.password);
			} else {
				response = await register(form);
			}

			if (response.success && response.user) {
				onLogin(response.user);
			} else {
				setError(response.error || 'Error en la autenticación');
			}
		} catch (err) {
			setError('Error de conexión. Intente nuevamente.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1 className="auth-title">🏠 RentMeNow</h1>
				<p className="auth-subtitle">Sistema de Gestión de Alquileres</p>

				<div className="auth-tabs">
					<button
						className={`tab ${isLogin ? 'active' : ''}`}
						onClick={() => setIsLogin(true)}
					>
						Iniciar Sesión
					</button>
					<button
						className={`tab ${!isLogin ? 'active' : ''}`}
						onClick={() => setIsLogin(false)}
					>
						Registrarse
					</button>
				</div>

				{error && <div className="error">{error}</div>}

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label>Usuario</label>
						<input
							type="text"
							name="username"
							value={form.username}
							onChange={handleChange}
							required
						/>
					</div>

					{!isLogin && (
						<>
							<div className="form-group">
								<label>Nombre Completo</label>
								<input
									type="text"
									name="fullName"
									value={form.fullName}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="form-group">
								<label>Email</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									required
								/>
							</div>
						</>
					)}

					<div className="form-group">
						<label>Contraseña</label>
						<input
							type="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</div>

					<button
						type="submit"
						className="submit-btn"
						disabled={loading}
					>
						{loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;