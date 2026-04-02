import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import styles from "../styles/productDetailPageStyles";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <p style={styles.status}>Loading product details...</p>;
  }

  if (error) {
    return (
      <div style={styles.page}>
        <p style={styles.error}>{error}</p>
        <Link to="/products" style={styles.backLink}>
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main style={styles.page}>
      <Link to="/products" style={styles.backLink}>
        Back to products
      </Link>

      <section style={styles.layout}>
        <div style={styles.imagePanel}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} style={styles.image} />
          ) : (
            <div style={styles.placeholder}>No image available</div>
          )}
        </div>

        <div style={styles.infoPanel}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>{formatPrice(product.price)}</p>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <span style={styles.infoLabel}>Stock</span>
              <strong>{product.stock}</strong>
            </div>
            <div style={styles.infoCard}>
              <span style={styles.infoLabel}>Product ID</span>
              <strong>#{product.id}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
