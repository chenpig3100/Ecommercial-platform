import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkout } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../styles/checkoutPageStyles";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { items, totalAmount, isLoading, error: cartError, refreshCart } = useCart();
  const [form, setForm] = useState({
    recipientName: "",
    phoneNumber: "",
    shippingAddress: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshCart().catch(() => {
      // Cart context already exposes the latest error state.
    });
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const order = await checkout(token, form);
      await refreshCart().catch(() => {
        // Ignore refresh errors here so we can still navigate to the created order.
      });
      setSuccessMessage("Order placed successfully.");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      if (err.status === 409) {
        await refreshCart().catch(() => {
          // Ignore secondary refresh errors after the checkout warning.
        });
      }

      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p style={styles.status}>Preparing your checkout...</p>;
  }

  if (items.length === 0) {
    return (
      <main style={styles.page}>
        <section style={styles.emptyState}>
          <h1 style={styles.emptyTitle}>Your cart is empty</h1>
          <p style={styles.emptyText}>Add items before moving on to checkout.</p>
          <Link to="/cart" style={styles.primaryLink}>
            Back to cart
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Sprint 5 Checkout</p>
        <h1 style={styles.title}>Confirm delivery details and place your order.</h1>
        <p style={styles.subtitle}>
          Prices are rechecked during checkout so you always order with the latest product data.
        </p>
      </section>

      {(cartError || error) && <p style={styles.error}>{error || cartError}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <section style={styles.layout}>
        <form onSubmit={handleSubmit} style={styles.formCard}>
          <h2 style={styles.sectionTitle}>Shipping details</h2>

          <label style={styles.field}>
            <span style={styles.label}>Recipient name</span>
            <input
              type="text"
              name="recipientName"
              value={form.recipientName}
              onChange={handleChange}
              style={styles.input}
              maxLength={120}
              required
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Phone number</span>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              style={styles.input}
              maxLength={40}
              required
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Shipping address</span>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              style={styles.textarea}
              rows="5"
              maxLength={300}
              required
            />
          </label>

          <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Place order"}
          </button>
        </form>

        <aside style={styles.summaryCard}>
          <h2 style={styles.sectionTitle}>Order summary</h2>

          <div style={styles.summaryItems}>
            {items.map((item) => (
              <div key={item.id} style={styles.summaryItem}>
                <div>
                  <p style={styles.itemName}>{item.productName}</p>
                  <p style={styles.itemMeta}>
                    Qty {item.quantity} x {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <strong>{formatPrice(item.subtotal)}</strong>
              </div>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>{formatPrice(totalAmount)}</strong>
          </div>

          <Link to="/cart" style={styles.secondaryLink}>
            Back to cart
          </Link>
        </aside>
      </section>
    </main>
  );
}
