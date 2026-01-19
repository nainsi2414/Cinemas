const TheaterCard = ({ name, address }) => {
  return (
    <div style={styles.card}>
      <div>
        <h3 style={styles.name}>{name}</h3>
        <p style={styles.address}>{address}</p>
      </div>
      <span style={styles.arrow}>›</span>
    </div>
  );
};

const styles = {
  card: {
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
 
  name: {
    margin: 0,
    color: "#007bff",
  },
  address: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "#666",
  },
  arrow: {
    fontSize: "22px",
    color: "#007bff",
  },
};

export default TheaterCard;
