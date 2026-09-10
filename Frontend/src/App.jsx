import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import ProfilePage from './pages/ProfilePage'

// Protected route component
function ProtectedRoute({ children, requireStaff = false }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requireStaff && !user?.is_staff) {
    return <Navigate to="/" />
  }

  return children
}

// Public auth route - redirects authenticated users away from login/register
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" />
  }

  return children
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireStaff={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* Add more routes here */}
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
