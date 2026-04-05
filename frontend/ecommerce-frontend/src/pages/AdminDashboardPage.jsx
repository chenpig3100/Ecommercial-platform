import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/adminPageStyles";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AdminDashboardPage() {
  const { token, userEmail } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getAdminDashboard(token);
        setDashboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Control Room</p>
        <h1 style={styles.title}>Oversee the whole marketplace from one dashboard.</h1>
        <p style={styles.subtitle}>
          Monitor platform health, open operational queues, and jump straight into the areas that
          need attention.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Platform Snapshot</h2>
            <p style={styles.helperText}>Signed in as {userEmail} with full admin access.</p>
          </div>
          <div style={styles.actionRow}>
            <Link to="/admin/users" style={styles.secondaryButton}>
              Manage Users
            </Link>
            <Link to="/admin/products" style={styles.secondaryButton}>
              Review Products
            </Link>
            <Link to="/admin/orders" style={styles.primaryButton}>
              Review Orders
            </Link>
          </div>
        </div>

        <ErrorBanner message={error} />

        {isLoading ? (
          <LoadingState message="Loading admin dashboard..." />
        ) : (
          <>
            <div style={styles.statGrid}>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Total users</span>
                <strong style={styles.statValue}>{dashboard.totalUsers}</strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Buyers</span>
                <strong style={styles.statValue}>{dashboard.buyerCount}</strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Sellers</span>
                <strong style={styles.statValue}>{dashboard.sellerCount}</strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Admins</span>
                <strong style={styles.statValue}>{dashboard.adminCount}</strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Products live</span>
                <strong style={styles.statValue}>
                  {dashboard.activeProducts} / {dashboard.totalProducts}
                </strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Orders placed</span>
                <strong style={styles.statValue}>{dashboard.totalOrders}</strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Pending seller orders</span>
                <strong style={styles.statValue}>{dashboard.pendingSellerOrders}</strong>
              </article>
              <article style={styles.statCard}>
                <span style={styles.statLabel}>Gross revenue</span>
                <strong style={styles.statValue}>{formatPrice(dashboard.grossRevenue)}</strong>
              </article>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
