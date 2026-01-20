import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import jsPDF from "jspdf";

const styles = {
  page: {
    padding: "40px",
    background: "linear-gradient(to right, #eaf6fe, #a5d7ff)",
    minHeight: "100vh",
  },

  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
    
  },

  tab: {
    padding: "9px 23px",
    borderRadius: "8px",
    border: "1px solid #1e90ff",
    background: "transparent",
    cursor: "pointer",
    color: "#1e90ff",
    fontFamily: "Segoe UI, sans-serif",
    fontSize: "16px",
  },

  activeTab: {
    padding: "9px 23px",
    borderRadius: "8px",
    background: "#1e90ff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
   fontFamily: "Segoe UI, sans-serif",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "23px",
    fontFamily: "Segoe UI, sans-serif",

  },

  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid #b6dcff",
  },

  label: {
    color: "#1e90ff",
    fontSize: "12px",
    marginBottom: "4px",
  },

  title: {
    fontWeight: "600",
    marginBottom: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  downloadBtn: {
    width: "100%",
    marginTop: "16px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #1e90ff",
    background: "#f0f8ff",
    color: "#1e90ff",
  },
};

const BASE_URL = "/api";

function Ticket() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("HISTORY");

  // ================= FETCH ORDERS =================
  useEffect(() => {
    const TEMP_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImluZGlhdGlydGg0QGdtYWlsLmNvbSIsImlkIjoiMmM4ZTBlNWUtMmUyYi00Zjc5LWFjMTktY2UxODY0MmNjZWExIiwiaWF0IjoxNzY4ODA2MTk0LCJleHAiOjE3Njk0MTA5OTR9.wAO5kCnuKrxHW6khuBndCCxfvPDwMFvtow4_BzTmoJA";

    const token = localStorage.getItem("token") || TEMP_TOKEN;

    axios
      .get(`/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("❌ Error fetching orders", err));
  }, []);

  // ================= DATE HELPERS =================
  const isPastShow = (startTime) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const showDate = new Date(startTime);
    showDate.setHours(0, 0, 0, 0);

    return showDate < today;
  };

  // ================= FILTER ORDERS =================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

    console.log(orders)

  const filteredOrders = orders.filter((order) => {
    const showDate = new Date(order.showtime.startTime);
    showDate.setHours(0, 0, 0, 0);

    if (activeTab === "HISTORY") {
      return showDate < today;
    }

    return showDate >= today;
  });

  // ================= PDF DOWNLOAD =================
  const downloadTicketPDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Movie Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Movie: ${order.showtime.movie.name}`, 20, 40);
    doc.text(
      `Date: ${new Date(order.showtime.startTime).toDateString()}`,
      20,
      50
    );
    doc.text(
      `Time: ${new Date(order.showtime.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      20,
      60
    );

    doc.text(
      `Seats: ${order.seatData?.seats
        .map((s) => `${s.row}${s.column}`)
        .join(", ")}`,
      20,
      70
    );

    doc.text(`Booking ID: ${order.id}`, 20, 80);

    doc.save(`ticket-${order.id}.pdf`);
  };

  // ================= RENDER =================
  return (
    <MainLayout>
      <div style={styles.page}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === "UPCOMING" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("UPCOMING")}
          >
            Upcoming
          </button>
          <button
            style={activeTab === "HISTORY" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("HISTORY")}
          >
            History
          </button>
        </div>

        {/* Tickets */}
        <div style={styles.grid}>
          {filteredOrders.map((order) => (
            <div key={order.id} style={styles.card}>
              <p style={styles.label}>Date</p>
              <p>{new Date(order.showtime.startTime).toDateString()}</p>

              <p style={styles.label}>Movie Title</p>
              <p style={styles.title}>{order.showtime.movie.name}</p>

              <div style={styles.row}>
                <div>
                  <p style={styles.label}>
                    Ticket ({order.seatData?.seats.length})
                  </p>
                  <p>
                    {order.seatData?.seats
                      .map((s) => `${s.row}${s.column}`)
                      .join(", ")}
                  </p>
                </div>

                <div>
                  <p style={styles.label}>Hours</p>
                  <p>
                    {new Date(order.showtime.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <button
                style={{
                  ...styles.downloadBtn,
                  opacity: isPastShow(order.showtime.startTime) ? 1 : 0.5,
                  cursor: isPastShow(order.showtime.startTime)
                    ? "pointer"
                    : "not-allowed",
                }}
                disabled={!isPastShow(order.showtime.startTime)}
                onClick={() => downloadTicketPDF(order)}
              >
                Download Ticket
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Ticket;
