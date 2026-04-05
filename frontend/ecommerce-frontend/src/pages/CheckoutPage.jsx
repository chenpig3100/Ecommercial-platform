import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkout } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../styles/checkoutPageStyles";
import { normalizeFieldErrors } from "../utils/formErrors";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function validateCheckoutForm(form) {
  const errors = {};

  if (!form.recipientName.trim()) {
    errors.recipientName = "Recipient name is required.";
  } else if (form.recipientName.trim().length < 2) {
    errors.recipientName = "Recipient name must be at least 2 characters.";
  }

  const normalizedPhone = form.phoneNumber.trim();
  if (!normalizedPhone) {
    errors.phoneNumber = "Phone number is required.";
  } else if (normalizedPhone.length < 8) {
    errors.phoneNumber = "Phone number must be at least 8 characters.";
  } else if (!/^[+\d\s()-]+$/.test(normalizedPhone)) {
    errors.phoneNumber = "Phone number can only contain digits and phone symbols.";
  }

  if (!form.shippingAddress.trim()) {
    errors.shippingAddress = "Shipping address is required.";
  } else if (form.shippingAddress.trim().length < 10) {
    errors.shippingAddress = "Shipping address must be at least 10 characters.";
  }

  return errors;
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
  const [fieldErrors, setFieldErrors] = useState({});
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
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        recipientName: form.recipientName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        shippingAddress: form.shippingAddress.trim(),
      };
      const order = await checkout(token, payload);
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

      setFieldErrors(normalizeFieldErrors(err.errors));
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
              style={{
                ...styles.input,
                ...(fieldErrors.recipientName ? styles.inputError : {}),
              }}
              maxLength={120}
              required
            />
            {fieldErrors.recipientName && (
              <p style={styles.fieldError}>{fieldErrors.recipientName}</p>
            )}
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Phone number</span>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(fieldErrors.phoneNumber ? styles.inputError : {}),
              }}
              maxLength={40}
              required
            />
            {fieldErrors.phoneNumber && (
              <p style={styles.fieldError}>{fieldErrors.phoneNumber}</p>
            )}
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Shipping address</span>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              style={{
                ...styles.textarea,
                ...(fieldErrors.shippingAddress ? styles.inputError : {}),
              }}
              rows="5"
              maxLength={300}
              required
            />
            {fieldErrors.shippingAddress && (
              <p style={styles.fieldError}>{fieldErrors.shippingAddress}</p>
            )}
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
