import { Link } from "react-router-dom";
import styles from "../styles/dashboardPageStyles";

export default function UnauthorizedPage() {
  return (
    <div style={styles.container}>
      <h2>Access restricted</h2>
      <p>You do not have permission to view this page with your current account.</p>
      <p>
        <Link to="/">Return to products</Link>
      </p>
    </div>
  );
}
