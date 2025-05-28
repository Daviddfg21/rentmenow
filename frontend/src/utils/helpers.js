// Formateador de moneda
export const formatCurrency = (amount) => {
	if (!amount && amount !== 0) return '';
	return amount.toLocaleString('es-ES', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2
	});
};

// Formateador de fechas
export const formatDate = (dateString) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('es-ES', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
	if (!text) return '';
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + '...';
};

// Traducir estados
export const translateStatus = (status, type = 'property') => {
	if (!status) return '';

	const propertyStatuses = {
		AVAILABLE: 'Disponible',
		RENTED: 'Alquilada',
		RESERVED: 'Reservada',
		MAINTENANCE: 'En mantenimiento',
		INACTIVE: 'Inactiva'
	};

	const rentalStatuses = {
		ACTIVE: 'Activo',
		EXPIRED: 'Expirado',
		TERMINATED: 'Terminado',
		PENDING: 'Pendiente'
	};

	const bookingStatuses = {
		PENDING: 'Pendiente',
		CONFIRMED: 'Confirmada',
		CANCELLED: 'Cancelada',
		COMPLETED: 'Completada'
	};

	if (type === 'property') return propertyStatuses[status] || status;
	if (type === 'rental') return rentalStatuses[status] || status;
	if (type === 'booking') return bookingStatuses[status] || status;

	return status;
};