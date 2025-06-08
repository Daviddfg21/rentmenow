import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import CreateProperty from './pages/CreateProperty'
import Rentals from './pages/Rentals'
import CreateRental from './pages/CreateRental'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route 
              path="/create-property" 
              element={
                <ProtectedRoute>
                  <CreateProperty />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rentals" 
              element={
                <ProtectedRoute>
                  <Rentals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-rental/:propertyId" 
              element={
                <ProtectedRoute>
                  <CreateRental />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#374151',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                borderRadius: '16px',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App