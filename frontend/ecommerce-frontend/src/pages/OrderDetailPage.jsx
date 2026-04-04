import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/orderDetailPageStyles";

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

export default function OrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getOrderById(token, id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, token]);

  if (isLoading) {
    return <p style={styles.status}>Loading order details...</p>;
  }

  if (error) {
    return (
      <main style={styles.page}>
        <p style={styles.error}>{error}</p>
        <Link to="/products" style={styles.primaryLink}>
          Continue shopping
        </Link>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Order placed</p>
        <h1 style={styles.title}>Thanks for your purchase.</h1>
        <p style={styles.subtitle}>
          Order #{order.id} was created on {formatDate(order.createdAtUtc)}.
        </p>
      </section>

      <section style={styles.layout}>
        <div style={styles.detailsCard}>
          <h2 style={styles.sectionTitle}>Delivery details</h2>
          <p style={styles.detailLine}>
            <strong>Status:</strong> {order.status}
          </p>
          <p style={styles.detailLine}>
            <strong>Recipient:</strong> {order.recipientName}
          </p>
          <p style={styles.detailLine}>
            <strong>Phone:</strong> {order.phoneNumber}
          </p>
          <p style={styles.detailLine}>
            <strong>Address:</strong> {order.shippingAddress}
          </p>
          {order.sellerOrders?.length > 0 && (
            <>
              <h3 style={styles.subsectionTitle}>Seller shipments</h3>
              <div style={styles.shipmentList}>
                {order.sellerOrders.map((sellerOrder) => (
                  <div key={sellerOrder.id} style={styles.shipmentCard}>
                    <p style={styles.detailLine}>
                      <strong>Seller order:</strong> #{sellerOrder.id}
                    </p>
                    <p style={styles.detailLine}>
                      <strong>Status:</strong> {sellerOrder.status}
                    </p>
                    <p style={styles.detailLine}>
                      <strong>Items:</strong> {sellerOrder.totalItems}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={styles.itemsCard}>
          <h2 style={styles.sectionTitle}>Items</h2>
          <div style={styles.itemsList}>
            {order.items.map((item) => (
              <article key={item.id} style={styles.itemRow}>
                <div>
                  <p style={styles.itemName}>{item.productName}</p>
                  <p style={styles.itemMeta}>
                    Qty {item.quantity} x {formatPrice(item.unitPrice)}
                  </p>
                  {item.sellerEmail && <p style={styles.itemMeta}>Seller: {item.sellerEmail}</p>}
                </div>
                <strong>{formatPrice(item.subtotal)}</strong>
              </article>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>

          <div style={styles.linkRow}>
            <Link to="/orders" style={styles.secondaryLink}>
              Back to orders
            </Link>
            <Link to="/products" style={styles.primaryLink}>
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
