import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerOrderById, updateSellerOrderStatus } from "../api/orders";
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

const nextStatusMap = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

export default function SellerOrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getSellerOrderById(token, id);
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, token]);

  async function handleUpdateStatus(nextStatus) {
    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      const updatedOrder = await updateSellerOrderStatus(token, id, { status: nextStatus });
      setOrder(updatedOrder);
      setSuccess(`Seller order updated to ${updatedOrder.status}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <p style={sellerStyles.status}>Loading seller order...</p>;
  }

  if (!order) {
    return null;
  }

  const nextStatuses = nextStatusMap[order.status] ?? [];

  return (
    <main style={sellerStyles.page}>
      <section style={sellerStyles.hero}>
        <p style={sellerStyles.eyebrow}>Seller Order Detail</p>
        <h1 style={sellerStyles.title}>Seller order #{order.id}</h1>
        <p style={sellerStyles.subtitle}>
          Parent order #{order.orderId} created on {formatDate(order.createdAtUtc)}.
        </p>
      </section>

      <section style={sellerStyles.section}>
        <div style={sellerStyles.sectionHeader}>
          <div>
            <h2 style={sellerStyles.sectionTitle}>Delivery Snapshot</h2>
            <p style={sellerStyles.helperText}>
              {order.recipientName} • {order.phoneNumber}
            </p>
            <p style={sellerStyles.helperText}>{order.shippingAddress}</p>
          </div>
          <div style={sellerStyles.actionRow}>
            <span style={{ ...sellerStyles.statusBadge, ...sellerStyles.statusActive }}>
              {order.status}
            </span>
            <Link to="/seller/orders" style={sellerStyles.secondaryButton}>
              Back to orders
            </Link>
          </div>
        </div>

        {error && <p style={sellerStyles.error}>{error}</p>}
        {success && <p style={sellerStyles.success}>{success}</p>}

        {nextStatuses.length > 0 && (
          <div style={sellerStyles.actionRow}>
            {nextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                style={sellerStyles.primaryButton}
                onClick={() => handleUpdateStatus(status)}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : `Mark as ${status}`}
              </button>
            ))}
          </div>
        )}
      </section>

      <section style={sellerStyles.section}>
        <h2 style={sellerStyles.sectionTitle}>Items</h2>
        <div style={sellerStyles.list}>
          {order.items.map((item) => (
            <article key={item.id} style={sellerStyles.productCard}>
              <div style={sellerStyles.imageWrap}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.productName} style={sellerStyles.image} />
                ) : (
                  <div style={sellerStyles.imagePlaceholder}>{item.category}</div>
                )}
              </div>
              <div style={sellerStyles.productBody}>
                <div style={sellerStyles.productMeta}>
                  <span style={sellerStyles.categoryBadge}>{item.category}</span>
                  {item.sellerEmail && <span style={sellerStyles.stockBadge}>{item.sellerEmail}</span>}
                </div>
                <h3 style={sellerStyles.productTitle}>{item.productName}</h3>
                <div style={sellerStyles.productFooter}>
                  <div>
                    <p style={sellerStyles.price}>{formatPrice(item.subtotal)}</p>
                    <p style={sellerStyles.helperText}>
                      Qty {item.quantity} x {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
