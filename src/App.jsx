import { Routes, Route, Navigate } from "react-router-dom";

import Splash from "./pages/Splash";
import PortalSplash from "./pages/PortalSplash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import TrackShipmentPage from "./pages/TrackShipmentPage";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import BookShipment from "./pages/Booking";
import ShipmentHistory from "./pages/ShipmentHistory";
import NotificationsPage from "./pages/NotificationsPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PaymentCallback from "./pages/PaymentCallback";

import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminShipments from "./pages/admin/AdminShipments";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRegister from "./pages/admin/AdminRegister";

function App() {
  return (
    <Routes>
      {/* ================================
          AUTHENTICATION
      ================================= */}

      <Route path="/" element={<Splash />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/admin-portal" element={<AdminRegister />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================================
          CUSTOMER PORTAL
      ================================= */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portal-loading"
        element={
          <ProtectedRoute>
            <PortalSplash />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book"
        element={
          <ProtectedRoute>
            <BookShipment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track"
        element={
          <ProtectedRoute>
            <TrackShipmentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/callback"
        element={
          <ProtectedRoute>
            <PaymentCallback />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <ShipmentHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ================================
          ADMIN OPERATIONS
      ================================= */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="shipments" element={<AdminShipments />} />

        <Route path="customers" element={<AdminCustomers />} />

        <Route path="bookings" element={<AdminBookings />} />

        <Route path="payments" element={<AdminPayments />} />

        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
