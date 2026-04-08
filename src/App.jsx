import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

// Protected route — redirects to /auth if no token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authorization-token')
  return token ? children : <Navigate to="/auth" replace />
}

// Public route — redirects to /allnotes if already logged in
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authorization-token')
  return !token ? children : <Navigate to="/allnotes" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          success: {
            style: { border: '1px solid #ddd6fe', color: '#5b21b6' },
            iconTheme: { primary: '#7c3aed', secondary: '#fff' },
          },
          error: {
            style: { border: '1px solid #fecaca', color: '#991b1b' },
          },
        }}
      />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />

        {/* Auth page (public only) */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected home routes */}
        <Route
          path="/addnote"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allnotes"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
