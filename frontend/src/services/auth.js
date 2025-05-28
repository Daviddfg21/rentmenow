import axios from 'axios';

// Detectar entorno automáticamente
const API_URL = process.env.NODE_ENV === 'production'
	? 'https://rentmenow.es/api/auth'  // Tu dominio en producción
	: 'http://localhost:8081/api/auth'; // Desarrollo local

// Login
export const login = async (username, password) => {
	try {
		const response = await axios.post(`${API_URL}/login`, {
			username,
			password
		});

		return {
			success: true,
			user: response.data.user
		};
	} catch (error) {
		console.error('Login error:', error);
		return {
			success: false,
			error: error.response?.data?.error || 'Error de inicio de sesión'
		};
	}
};

// Registro
export const register = async (userData) => {
	try {
		const response = await axios.post(`${API_URL}/register`, userData);

		return {
			success: true,
			user: response.data.user
		};
	} catch (error) {
		console.error('Register error:', error);
		return {
			success: false,
			error: error.response?.data?.error || 'Error de registro'
		};
	}
};