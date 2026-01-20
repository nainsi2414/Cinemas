import { useNavigate, useLocation } from "react-router-dom";
import mainStyles from "../styles/mainStyles";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = location.pathname === "/home";
  const isTicketActive =
    location.pathname.startsWith("/tickets") ||
    location.pathname.startsWith("/ticket");

  const handleLogout = () => {
    // 1️⃣ Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("expireAt"); // safe even if not used

    // 2️⃣ Redirect to login
    navigate("/", { replace: true });
  };

  return (
    <div style={mainStyles.navbar}>
      {/* Left */}
      <div style={mainStyles.navLeft}>
        <img
          src={logo}
          alt="Cinemas"
          style={mainStyles.logo}
          onClick={() => navigate("/home")}
        />
      </div>

      {/* Center */}
      <div style={mainStyles.navCenter}>
        <span
          style={{
            ...mainStyles.navItem,
            ...(isHomeActive ? mainStyles.navItemActive : {}),
          }}
          onClick={() => navigate("/home")}
        >
          Home
        </span>

        <span
          style={{
            ...mainStyles.navItem,
            ...(isTicketActive ? mainStyles.navItemActive : {}),
          }}
          onClick={() => navigate("/tickets")}
        >
          My Ticket
        </span>
      </div>

      {/* Right */}
      <div style={mainStyles.navRight}>
        <button
          style={mainStyles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
