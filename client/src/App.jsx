import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoginPage from './pages/LoginPage'
import { GeneralDashboard, TechnicianDashboard, ManagerDashboard, AdminDashboard } from './pages/Dashboards'
import { getMe } from './store/authSlice'

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useSelector((state) => state.auth);

  if (loading && !user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

const DashboardRouter = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'TECHNICIAN':
      return <TechnicianDashboard />;
    default:
      return <GeneralDashboard />;
  }
};

const App = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, token, user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
