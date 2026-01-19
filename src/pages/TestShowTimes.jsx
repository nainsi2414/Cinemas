import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getShowTimesByDate } from "../api/showTimeApi";

function TestShowTimes() {
  const { id } = useParams();

  useEffect(() => {
    console.log("Movie ID from URL:", id);

    getShowTimesByDate(id, "2025-02-21")
      .then((res) => {
        console.log("API RESPONSE 👉", res);
      })
      .catch((err) => {
        console.error("API ERROR ❌", err);
      });
  }, [id]);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Check Console for API Output</h2>
      <p>Movie ID: {id}</p>
    </div>
  );
}

export default TestShowTimes;
