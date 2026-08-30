import { Navigate, useLocation } from "react-router-dom";

const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem("lordtaylor-user") ||
      sessionStorage.getItem("lordtaylor-user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to read stored user:", error);
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const location = useLocation();

  const token =
    localStorage.getItem("lordtaylor-token") ||
    sessionStorage.getItem("lordtaylor-token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const user = getStoredUser();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;