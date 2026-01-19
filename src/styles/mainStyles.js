const mainStyles = {
  navbar: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    fontFamily: "Segoe UI, sans-serif",
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
  },

  logo: {
    height: "40px",
    cursor: "pointer",
  },

  navCenter: {
    display: "flex",
    gap: "30px",
    fontSize: "15px",
    fontWeight: "500",
  },

  navItem: {
    cursor: "pointer",
    color: "#1976d2",
    borderBottom: "2px solid transparent",
    paddingBottom: "4px",
  },

  navItemActive: {
    borderBottom: "2px solid #1976d2",
  },

  navRight: {},

  logoutBtn: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "500",
  },

  /* HOME PAGE */
  pageContainer: {
    minHeight: "calc(100vh - 64px)",
    
    background: "linear-gradient(to right, #ffffff, #a8dbf9)",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
  },



  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#1e88e5",
    marginBottom: "20px",
  },

  tabs: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  tabActive: {
    backgroundColor: "#1e88e5",
    color: "#fff",
    padding: "7px 18px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },

  tabInactive: {
    color: "#1e88e5",
    padding: "7px 18px",
    cursor: "pointer",
    fontSize: "16px",
  },

    movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "50px",
  },

  movieCard: {
    cursor: "pointer",
    height:"430px",
  },

  card: {
    marginLeft:"70px",
    marginRight: "70px",
  },

  movieImage: {
    width: "95%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "14px",
    
  },

  movieTitle: {
    textAlign: "center",
    fontSize: "16px",
    color: "#1e88e5",
    fontWeight: "600",
  },

  theaterList: {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "24px",
},

theaterCard: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  background: "rgb(255, 255, 255, 0.5)",
  
  marginBottom:"10px",
  cursor: "pointer",
},

theaterName: {
  fontSize: "16px",
  fontWeight: "600",
  color: "#007bff",
},

theaterAddress: {
  fontSize: "13px",
  color: "#808080",
  marginTop: "6px",
},

theaterArrow: {
  fontSize: "20px",
  color: "#007bff",
},


};

export default mainStyles;
