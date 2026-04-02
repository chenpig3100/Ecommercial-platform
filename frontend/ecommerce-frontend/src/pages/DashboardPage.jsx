import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPrivateData } from "../api/auth";
import styles from "../styles/dashboardPageStyles";

export default function DashboardPage() {
  const { token, userEmail, roles } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPrivateData() {
      try {
        const data = await getPrivateData(token);
        setMessage(data.message);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchPrivateData();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <p>Welcome, {userEmail}</p>
      <p>Roles: {roles.length ? roles.join(", ") : "No roles assigned"}</p>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}
