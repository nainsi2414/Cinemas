import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TEMP_TOKEN = "YOUR_TEMP_TOKEN";

export default function Ticket() {
  const { state } = useLocation();
  const sessionId = state?.sessionId;

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || TEMP_TOKEN;

    fetch(
      sessionId
        ? `/api/tickets/by-session/${sessionId}`
        : `/api/tickets/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((json) => setTickets(json.data || []));
  }, [sessionId]);

  return (
    <div>
      {/* render your ticket cards UI here */}
    </div>
  );
}
