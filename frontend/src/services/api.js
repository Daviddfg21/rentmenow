import axios from 'axios'

const api = axios.create({
  baseURL: '', // ✅ CAMBIO PRINCIPAL - usar rutas relativas
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login si es 401 Y no estamos ya en login/register
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/register')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api