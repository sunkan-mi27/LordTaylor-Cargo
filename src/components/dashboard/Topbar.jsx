import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaMagnifyingGlass, FaChevronDown } from "react-icons/fa6";

const API_URL = "http://localhost:5000/api";

const Topbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          localStorage.getItem("lordtaylor-token") ||
          sessionStorage.getItem("lordtaylor-token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/profile/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch profile");
        }

        setUser(data.user);
      } catch (error) {
        console.error("Topbar profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const firstName = user?.profile?.firstName || "Customer";
  const lastName = user?.profile?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>Dashboard</h1>

        <p>Welcome back, {loading ? "..." : firstName} 👋</p>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <FaMagnifyingGlass />

          <input type="text" placeholder="Search shipments..." />
        </div>

        <button className="notification-btn">
          <FaBell />

          <span className="notification-dot"></span>
        </button>

        <Link to="/profile" className="user-profile">
          <div className="user-avatar">{loading ? "..." : initials}</div>

          <div className="user-info">
            <strong>{loading ? "Loading..." : fullName}</strong>

            <small>{user?.role === "ADMIN" ? "Admin" : "Customer"}</small>
          </div>

          <FaChevronDown />
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
