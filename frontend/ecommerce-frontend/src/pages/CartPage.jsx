import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "../styles/cartPageStyles";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CartPage() {
  const {
    items,
    totalItems,
    totalAmount,
    isLoading,
    error,
    updateItem,
    removeItem,
    clearCart,
  } = useCart();

  const handleQuantityChange = async (itemId, nextQuantity) => {
    if (nextQuantity < 1) {
      return;
    }

    try {
      await updateItem(itemId, nextQuantity);
    } catch {
      // The context already stores the latest error message for display.
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
    } catch {
      // The context already stores the latest error message for display.
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch {
      // The context already stores the latest error message for display.
    }
  };

  if (isLoading) {
    return <p style={styles.status}>Loading your cart...</p>;
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Sprint 5 Cart Module</p>
        <h1 style={styles.title}>Review your bag before heading to checkout.</h1>
        <p style={styles.subtitle}>
          Update quantities, remove products, and keep an eye on the latest synced prices.
        </p>
      </section>

      {error && <p style={styles.error}>{error}</p>}

      {items.length === 0 ? (
        <section style={styles.emptyState}>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Browse products and add something you would love to buy.</p>
          <Link to="/products" style={styles.primaryLink}>
            Explore products
          </Link>
        </section>
      ) : (
        <section style={styles.layout}>
          <div style={styles.itemsPanel}>
            {items.map((item) => (
              <article key={item.id} style={styles.itemCard}>
                <div style={styles.imageWrap}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} style={styles.image} />
                  ) : (
                    <div style={styles.placeholder}>No image</div>
                  )}
                </div>

                <div style={styles.itemBody}>
                  <div style={styles.itemHeader}>
                    <div>
                      <p style={styles.category}>{item.category}</p>
                      <h2 style={styles.itemTitle}>{item.productName}</h2>
                    </div>
                    <strong style={styles.itemPrice}>{formatPrice(item.unitPrice)}</strong>
                  </div>

                  <p style={styles.stockText}>{item.availableStock} item(s) currently in stock</p>

                  <div style={styles.itemFooter}>
                    <label style={styles.quantityGroup}>
                      <span style={styles.quantityLabel}>Qty</span>
                      <input
                        type="number"
                        min="1"
                        max={item.availableStock}
                        value={item.quantity}
                        onChange={(event) =>
                          handleQuantityChange(item.id, Number(event.target.value))
                        }
                        style={styles.quantityInput}
                      />
                    </label>

                    <strong style={styles.subtotal}>{formatPrice(item.subtotal)}</strong>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Cart summary</p>
            <div style={styles.summaryRow}>
              <span>Total items</span>
              <strong>{totalItems}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Total amount</span>
              <strong>{formatPrice(totalAmount)}</strong>
            </div>
            <Link to="/checkout" style={styles.checkoutButton}>
              Go to checkout
            </Link>
            <button type="button" onClick={handleClearCart} style={styles.clearButton}>
              Clear cart
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}
