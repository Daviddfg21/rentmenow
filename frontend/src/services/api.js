import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configuración base de axios
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Interceptor para agregar token
api.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem('rentmenow_user') || '{}');
		if (user.token) {
			config.headers.Authorization = `Bearer ${user.token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// API para propiedades
export const getProperties = async (filter, userId) => {
	try {
		let url = '/properties';
		if (filter === 'mine') {
			url = `/properties/owner/${userId}`;
		} else if (filter === 'available') {
			url = '/properties/available';
		}
		const response = await api.get(url);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		return [];
	}
};

export const getPropertyById = async (id) => {
	try {
		const response = await api.get(`/properties/${id}`);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		throw error;
	}
};

export const createProperty = async (propertyData, ownerId) => {
	try {
		const response = await api.post(`/properties?ownerId=${ownerId}`, propertyData);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		throw error;
	}
};

export const updateProperty = async (id, propertyData) => {
	try {
		const response = await api.put(`/properties/${id}`, propertyData);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		throw error;
	}
};

export const deleteProperty = async (id) => {
	try {
		const response = await api.delete(`/properties/${id}`);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		throw error;
	}
};

// API para contratos
export const getRentals = async (userId, type = 'all') => {
	try {
		let url = '/rentals';
		if (type === 'tenant') {
			url = `/rentals/tenant/${userId}`;
		} else if (type === 'landlord') {
			url = `/rentals/landlord/${userId}`;
		}
		const response = await api.get(url);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		return [];
	}
};

export const getRentalById = async (id) => {
	try {
		const response = await api.get(`/rentals/${id}`);
		return response.data;
	} catch (error) {
		console.error('API error:', error);
		throw error;
	}
};

// API para estadísticas
export const getStats = async (userId) => {
	try {
		// Simplificado para implementación rápida
		return {
			properties: 5,
			rentals: 3,
			messages: 10
		};
	} catch (error) {
		console.error('API error:', error);
		return { properties: 0, rentals: 0, messages: 0 };
	}
};

// Exportar otras funciones según sea necesario
export default api;