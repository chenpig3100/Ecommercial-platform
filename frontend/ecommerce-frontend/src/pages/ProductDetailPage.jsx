import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/productDetailPageStyles";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProductById(id);
        setProduct(data);
        setQuantity(data.stock > 0 ? 1 : 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading product details..." />;
  }

  if (error) {
    return (
      <div style={styles.page}>
        <ErrorBanner message={error} />
        <Link to="/products" style={styles.backLink}>
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = async () => {
    setCartMessage("");
    setCartError("");
    setIsAddingToCart(true);

    try {
      await addItem(product.id, quantity);
      setCartMessage("Item added to cart.");
    } catch (err) {
      setCartError(err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

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

          <section style={styles.purchasePanel}>
            {isAuthenticated && isBuyer ? (
              <>
                <div style={styles.quantityRow}>
                  <label htmlFor="quantity" style={styles.quantityLabel}>
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    style={styles.quantityInput}
                    disabled={product.stock === 0}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  style={styles.addToCartButton}
                  disabled={product.stock === 0 || isAddingToCart}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : isAddingToCart
                      ? "Adding..."
                      : "Add to cart"}
                </button>

                {cartMessage && <p style={styles.success}>{cartMessage}</p>}
                {cartError && <p style={styles.errorText}>{cartError}</p>}
              </>
            ) : (
              <p style={styles.errorText}>
                Only buyer accounts can add items to cart and place orders.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
