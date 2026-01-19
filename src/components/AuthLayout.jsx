import logo from "../assets/logo.png";
import authStyles from "../styles/authStyles";

function AuthLayout({ children }) {
  return (
    <div style={authStyles.container}>
      
      {/* 🔵 LEFT SIDE (Gradient Background) */}
      <div style={authStyles.left}>
        <div>
          <img src={logo} alt="Cinemas Logo" style={authStyles.logo} />

        <i><h1 style={authStyles.welcome}>Welcome.</h1>
        <p style={authStyles.tagline}>
          Begin your cinematic adventure now with our ticketing platform!
        </p></i>
        </div>
      </div>

      {/* ⚪ RIGHT SIDE (Dynamic Content) */}
      <div style={authStyles.right}>
        {children}
      </div>

    </div>
  );
}
export default AuthLayout;