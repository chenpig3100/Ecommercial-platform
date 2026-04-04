import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import sellerStyles from "../styles/sellerPageStyles";

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

export default function SellerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getSellerOrders(token, { status });
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [status, token]);

  return (
    <main style={sellerStyles.page}>
      <section style={sellerStyles.hero}>
        <p style={sellerStyles.eyebrow}>Seller Orders</p>
        <h1 style={sellerStyles.title}>Handle your shipments without touching other sellers.</h1>
        <p style={sellerStyles.subtitle}>
          Each card is one seller order created from checkout and ready for status updates.
        </p>
      </section>

      <section style={sellerStyles.section}>
        <div style={sellerStyles.sectionHeader}>
          <div>
            <h2 style={sellerStyles.sectionTitle}>Order Queue</h2>
            <p style={sellerStyles.helperText}>
              Filter by status and open a seller order to inspect its items in full.
            </p>
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} style={sellerStyles.input}>
            {statusOptions.map((option) => (
              <option key={option || "all"} value={option}>
                {option || "All statuses"}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={sellerStyles.error}>{error}</p>}

        {isLoading ? (
          <p style={sellerStyles.status}>Loading seller orders...</p>
        ) : orders.length === 0 ? (
          <p style={sellerStyles.status}>No seller orders match this filter yet.</p>
        ) : (
          <div style={sellerStyles.list}>
            {orders.map((order) => (
              <article key={order.id} style={sellerStyles.productCard}>
                <div style={sellerStyles.imageWrap}>
                  <div style={sellerStyles.imagePlaceholder}>{order.items.length} items</div>
                </div>
                <div style={sellerStyles.productBody}>
                  <div style={sellerStyles.productMeta}>
                    <span style={sellerStyles.categoryBadge}>Parent order #{order.orderId}</span>
                    <span style={{ ...sellerStyles.statusBadge, ...sellerStyles.statusActive }}>
                      {order.status}
                    </span>
                  </div>

                  <h3 style={sellerStyles.productTitle}>Seller order #{order.id}</h3>
                  <p style={sellerStyles.productDescription}>
                    {order.recipientName} • {order.phoneNumber}
                  </p>
                  <p style={sellerStyles.helperText}>{order.shippingAddress}</p>

                  <div style={sellerStyles.productFooter}>
                    <div>
                      <p style={sellerStyles.price}>{formatPrice(order.totalAmount)}</p>
                      <p style={sellerStyles.helperText}>
                        {order.totalItems} item(s) • {formatDate(order.createdAtUtc)}
                      </p>
                    </div>
                    <div style={sellerStyles.actionRow}>
                      <Link to={`/seller/orders/${order.id}`} style={sellerStyles.primaryButton}>
                        View order
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
