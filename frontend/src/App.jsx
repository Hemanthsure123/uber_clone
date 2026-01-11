import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/Login";

// User
import UserSignup from "./pages/user/UserSignup";
import UserOtp from "./pages/user/UserOtp";
import UserDashboard from "./pages/dashboards/UserDashboard";

// Driver
import DriverSignup from "./pages/driver/DriverSignup";
import DriverSelfie from "./pages/driver/DriverSelfie";
import DriverOtp from "./pages/driver/DriverOtp";
import DriverDashboard from "./pages/dashboards/DriverDashboard";

// Admin
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// Guard
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* USER */}
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/verify-otp" element={<UserOtp />} />
        <Route
          path="/user/home"
          element={
            <ProtectedRoute role="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* DRIVER */}
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/driver/selfie" element={<DriverSelfie />} />
        <Route path="/driver/verify-otp" element={<DriverOtp />} />
        <Route
          path="/driver/home"
          element={
            <ProtectedRoute role="DRIVER">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<h2>Page not found</h2>} />

      </Routes>
    </BrowserRouter>
  );
}
