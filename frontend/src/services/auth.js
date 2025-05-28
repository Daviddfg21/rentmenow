import axios from 'axios'; 
 
// Detectar entorno autom ticamente 
const API_URL = process.env.NODE_ENV === 'production'  
  ? 'https://rentmenow.es/api/auth'  // Tu dominio en producci¢n 
  : 'http://localhost:8081/api/auth'; // Desarrollo local 
 
// Login 
export const login = async (username, password) => { 
api.jstry { 
auth.jsconst response = await axios.post(`${API_URL}/login`, { 
api.jsusername, 
api.jspassword 
auth.js}); 
 
auth.jsreturn { 
api.jssuccess: true, 
api.jsuser: response.data.user 
auth.js}; 
api.js} catch (error) { 
auth.jsconsole.error('Login error:', error); 
auth.jsreturn { 
api.jssuccess: false, 
api.jserror: error.response?.data?.error || 'Error de inicio de sesi¢n' 
auth.js}; 
api.js} 
}; 
