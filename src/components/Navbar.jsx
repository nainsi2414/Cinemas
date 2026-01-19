import mainStyles from "../styles/mainStyles";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <div style={mainStyles.navbar}>
      {/* Left */}
      <div style={mainStyles.navLeft}>
        <img src={logo} alt="Cinemas" style={mainStyles.logo} />
      </div>

      {/* Center */}
      <div style={mainStyles.navCenter}>
        <span style={{ ...mainStyles.navItem, ...mainStyles.navItemActive }}>
          Home
        </span>
        <span style={mainStyles.navItem}>My Ticket</span>
      </div>

      {/* Right */}
      <div style={mainStyles.navRight}>
        <button style={mainStyles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
