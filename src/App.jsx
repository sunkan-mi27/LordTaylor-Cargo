import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import PortalSplash from "./pages/PortalSplash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import TrackShipmentPage from "./pages/TrackShipmentPage";
import QuoteGeneratorPage from "./pages/QuoteGeneratorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import BookShipment from "./pages/Booking";
import ShipmentHistory from "./pages/ShipmentHistory";

function App() {
  return (
    <Routes>
      {/* Authentication */}

      <Route path="/" element={<Splash />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Pages */}

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
        path="/history"
        element={
          <ProtectedRoute>
            <ShipmentHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quote"
        element={
          <ProtectedRoute>
            <QuoteGeneratorPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
