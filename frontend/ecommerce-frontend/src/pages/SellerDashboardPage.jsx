import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getManagedProducts } from "../api/products";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/sellerPageStyles";

export default function SellerDashboardPage() {
  const { token, userEmail, roles } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getManagedProducts(token);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [token]);

  const publishedProducts = products.filter((product) => product.isActive).length;
  const unpublishedProducts = products.length - publishedProducts;

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Seller Dashboard</p>
        <h1 style={styles.title}>Shape your storefront from one control room.</h1>
        <p style={styles.subtitle}>
          Track listing health, jump into product editing, and decide what is currently visible to
          shoppers.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Account Snapshot</h2>
            <p style={styles.helperText}>
              Signed in as {userEmail} with roles: {roles.join(", ")}
            </p>
          </div>
          <div style={styles.actionRow}>
            <Link to="/seller/orders" style={styles.secondaryButton}>
              Seller Orders
            </Link>
            <Link to="/seller/products" style={styles.secondaryButton}>
              Manage Products
            </Link>
            <Link to="/seller/products/new" style={styles.primaryButton}>
              Add Product
            </Link>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {isLoading ? (
          <p style={styles.status}>Loading seller summary...</p>
        ) : (
          <div style={styles.statGrid}>
            <article style={styles.statCard}>
              <span style={styles.statLabel}>Total products</span>
              <strong style={styles.statValue}>{products.length}</strong>
            </article>
            <article style={styles.statCard}>
              <span style={styles.statLabel}>Published</span>
              <strong style={styles.statValue}>{publishedProducts}</strong>
            </article>
            <article style={styles.statCard}>
              <span style={styles.statLabel}>Unpublished</span>
              <strong style={styles.statValue}>{unpublishedProducts}</strong>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}
