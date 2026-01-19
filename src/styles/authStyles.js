const authStyles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "Segoe UI, sans-serif",
    boxSizing: "border-box",
  },

  left: {
    width: "50%",
    fontSize: "56px",
    background: "linear-gradient(45deg, #ffffff, #92ceff)",
    color: "#0d47a1",
    marginBottom: "20px"
  },

  logo: {
    paddingTop:"40px",
    paddingLeft: "50px",
    width: "130px",
    height: "50px",
    marginBottom: "40px",
  },

  welcome: {
    fontSize: "42px",
    padding: "60px",
    marginBottom: "8px",
  },

  tagline: {
    fontSize: "40px",
    padding: "60px",
    lineHeight: "1.4",
    maxWidth: "420px",
    color: "#37474f",
  },

  right: {
    width: "50%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "6px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch", // inputs & button same width
  },

  /* ✅ NEW */
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },

  title: {
    marginBottom: "25px",
    fontSize:"30px",
    color: "#263238",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    padding: "5px",
    display: "block",
    fontSize: "14px",
    marginBottom: "6px",
    color: "#5A5A5D",
  },

  input: {
    width: "93%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #5A5A5D",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ffffff",
    color: "#1e88e5",
    border: "1px solid #1e88e5",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },

  footerText: {
    marginTop: "15px",
    fontSize: "13px",
    textAlign: "center",
    color: "#5A5A5D",
  },
 

  link: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default authStyles;