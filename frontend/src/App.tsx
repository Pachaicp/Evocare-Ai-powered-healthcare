import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PatientManagement from './pages/admin/PatientManagement';
import AuditLogs from './pages/admin/AuditLogs';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import PatientDetail from './pages/doctor/PatientDetail';

// Caregiver Pages
import CaregiverDashboard from './pages/caregiver/CaregiverDashboard';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 52 }}>🚫</div>
              <h2>Access Denied</h2>
              <p style={{ color: 'var(--gray-500)' }}>You don't have permission to view this page.</p>
              <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
            </div>
          } />

          {/* ===== ADMIN ROUTES ===== */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route element={<DashboardLayout title="Admin Dashboard" subtitle="EvoCare System Management" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/patients" element={<PatientManagement />} />
              <Route path="/admin/patients/:id" element={<PatientDetail />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ===== DOCTOR ROUTES ===== */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_DOCTOR']} />}>
            <Route element={<DashboardLayout title="Doctor Dashboard" subtitle="Patient Care Management" />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/patients/:id" element={<PatientDetail />} />
              <Route path="/doctor/notes" element={<DoctorPatients />} />
              <Route path="/doctor/ai-insights" element={<DoctorPatients />} />
              <Route path="/doctor/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ===== CAREGIVER ROUTES ===== */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_CAREGIVER']} />}>
            <Route element={<DashboardLayout title="Caregiver Dashboard" subtitle="Patient Monitoring" />}>
              <Route path="/caregiver" element={<CaregiverDashboard />} />
              <Route path="/caregiver/add-observation" element={<CaregiverDashboard />} />
              <Route path="/caregiver/observations" element={<CaregiverDashboard />} />
              <Route path="/caregiver/patients" element={<CaregiverDashboard />} />
              <Route path="/caregiver/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ===== PATIENT ROUTES ===== */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_PATIENT']} />}>
            <Route element={<DashboardLayout title="Patient Portal" subtitle="Your Health Dashboard" />}>
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/medications" element={<PatientDashboard />} />
              <Route path="/patient/reports" element={<PatientDashboard />} />
              <Route path="/patient/timeline" element={<PatientDashboard />} />
              <Route path="/patient/ai-summary" element={<PatientDashboard />} />
              <Route path="/patient/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
