import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, updateProduct } from "../api/products";
import { getAdminProducts } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/adminPageStyles";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

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

function statusFilterToValue(statusFilter) {
  if (statusFilter === "active") {
    return true;
  }

  if (statusFilter === "inactive") {
    return false;
  }

  return undefined;
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getAdminProducts(token, {
          search,
          category,
          sellerEmail,
          isActive: statusFilterToValue(statusFilter),
        });
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [token, search, category, sellerEmail, statusFilter]);

  const handleStatusToggle = async (product) => {
    setError("");
    setSuccessMessage("");

    try {
      const updatedProduct = await updateProduct(token, product.id, {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl ?? "",
        stock: product.stock,
        isActive: !product.isActive,
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === product.id ? { ...product, ...updatedProduct, sellerEmail: product.sellerEmail } : item
        )
      );
      setSuccessMessage(
        `${product.name} is now ${updatedProduct.isActive ? "published" : "unpublished"}.`
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await deleteProduct(token, product.id);
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id));
      setSuccessMessage(`${product.name} was deleted.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Products</p>
        <h1 style={styles.title}>Review catalog quality across every seller.</h1>
        <p style={styles.subtitle}>
          Search by listing details or seller email, then unpublish risky listings without leaving
          the admin area.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Catalog Review</h2>
        </div>

        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder="Search by product name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Seller email"
            value={sellerEmail}
            onChange={(event) => setSellerEmail(event.target.value)}
            style={styles.input}
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={styles.input}
          >
            <option value="">All statuses</option>
            <option value="active">Published</option>
            <option value="inactive">Unpublished</option>
          </select>
        </div>
      </section>

      {successMessage && <p style={styles.success}>{successMessage}</p>}
      <ErrorBanner message={error} />

      {isLoading ? (
        <LoadingState message="Loading admin products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products matched"
          description="Try adjusting the filters or search across a different seller."
        />
      ) : (
        <section style={styles.list}>
          {products.map((product) => (
            <article key={product.id} style={styles.productCard}>
              <div style={styles.imageWrap}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={styles.image} />
                ) : (
                  <div style={styles.imagePlaceholder}>No image</div>
                )}
              </div>

              <div style={styles.productBody}>
                <div style={styles.productMeta}>
                  <span style={styles.categoryBadge}>{product.category}</span>
                  <StatusBadge status={product.isActive ? "Published" : "Unpublished"} />
                </div>

                <h2 style={styles.productTitle}>{product.name}</h2>
                <p style={styles.productDescription}>{product.description}</p>

                <div style={styles.metaGrid}>
                  <div style={styles.metaBlock}>
                    <span style={styles.metaLabel}>Seller</span>
                    <span style={styles.metaValue}>{product.sellerEmail || "Unknown seller"}</span>
                  </div>
                  <div style={styles.metaBlock}>
                    <span style={styles.metaLabel}>Stock</span>
                    <span style={styles.metaValue}>{product.stock}</span>
                  </div>
                  <div style={styles.metaBlock}>
                    <span style={styles.metaLabel}>Created</span>
                    <span style={styles.metaValue}>{formatDate(product.createdAtUtc)}</span>
                  </div>
                </div>

                <div style={styles.productFooter}>
                  <span style={styles.price}>{formatPrice(product.price)}</span>
                  <div style={styles.actionRow}>
                    <Link
                      to={`/seller/products/${product.id}/edit`}
                      style={styles.secondaryButton}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(product)}
                      style={styles.secondaryButton}
                    >
                      {product.isActive ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      style={styles.dangerButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
