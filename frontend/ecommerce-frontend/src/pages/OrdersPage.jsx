import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/ordersPageStyles";

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

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getMyOrders(token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [token]);

  if (isLoading) {
    return <p style={styles.status}>Loading your orders...</p>;
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Customer Orders</p>
        <h1 style={styles.title}>Track every checkout from one timeline.</h1>
        <p style={styles.subtitle}>
          Review your order history, open split seller shipments, and keep an eye on delivery
          progress.
        </p>
      </section>

      {error && <p style={styles.error}>{error}</p>}

      {!error && orders.length === 0 ? (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>No orders yet</h2>
          <p style={styles.emptyText}>Once you complete checkout, your orders will appear here.</p>
          <Link to="/products" style={styles.primaryLink}>
            Start shopping
          </Link>
        </section>
      ) : (
        <section style={styles.list}>
          {orders.map((order) => (
            <article key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderNumber}>Order #{order.id}</p>
                  <p style={styles.orderMeta}>Placed {formatDate(order.createdAtUtc)}</p>
                </div>
                <span style={styles.statusBadge}>{order.status}</span>
              </div>

              <div style={styles.statRow}>
                <span>{order.totalItems} item(s)</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>

              <div style={styles.sellerList}>
                {order.sellerOrders.map((sellerOrder) => (
                  <div key={sellerOrder.id} style={styles.sellerChip}>
                    <span>Seller order #{sellerOrder.id}</span>
                    <strong>{sellerOrder.status}</strong>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.mutedText}>
                  {order.sellerOrders.length} seller shipment
                  {order.sellerOrders.length === 1 ? "" : "s"}
                </span>
                <Link to={`/orders/${order.id}`} style={styles.primaryLink}>
                  View details
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
