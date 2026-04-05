import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/adminPageStyles";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const statusOptions = ["", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getAdminOrders(token, { search, status });
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [token, search, status]);

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Orders</p>
        <h1 style={styles.title}>Track every seller order flowing through checkout.</h1>
        <p style={styles.subtitle}>
          Use this queue to spot stalled shipments, investigate handoffs, and jump into any seller
          order detail as needed.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Marketplace Order Queue</h2>
        </div>

        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder="Search by seller, buyer, recipient, or order id"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={styles.input}
          />
          <select value={status} onChange={(event) => setStatus(event.target.value)} style={styles.input}>
            {statusOptions.map((option) => (
              <option key={option || "all"} value={option}>
                {option || "All statuses"}
              </option>
            ))}
          </select>
        </div>
      </section>

      <ErrorBanner message={error} />

      {isLoading ? (
        <LoadingState message="Loading admin orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No seller orders matched"
          description="Try a different status filter or search keyword."
        />
      ) : (
        <section style={styles.panelGrid}>
          {orders.map((order) => (
            <article key={order.id} style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Seller order #{order.id}</h2>
                  <p style={styles.helperText}>Parent order #{order.orderId}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div style={styles.metaGrid}>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Buyer</span>
                  <span style={styles.metaValue}>{order.buyerEmail}</span>
                </div>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Seller</span>
                  <span style={styles.metaValue}>{order.sellerEmail}</span>
                </div>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Recipient</span>
                  <span style={styles.metaValue}>{order.recipientName}</span>
                </div>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Created</span>
                  <span style={styles.metaValue}>{formatDate(order.createdAtUtc)}</span>
                </div>
              </div>

              <div style={styles.productFooter}>
                <div>
                  <p style={styles.price}>{formatPrice(order.totalAmount)}</p>
                  <p style={styles.helperText}>{order.totalItems} item(s)</p>
                </div>
                <div style={styles.actionRow}>
                  <Link to={`/seller/orders/${order.id}`} style={styles.primaryButton}>
                    Open detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
