import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { deleteProduct, getManagedProducts, updateProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/sellerPageStyles";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getStatusBadgeStyle(isActive) {
  return {
    ...styles.statusBadge,
    ...(isActive ? styles.statusActive : styles.statusInactive),
  };
}

export default function SellerProductsPage() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [categoryInput, setCategoryInput] = useState(searchParams.get("category") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    setSearchInput(search);
    setCategoryInput(category);
  }, [search, category]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getManagedProducts(token, { search, category });
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [token, search, category]);

  const applyFilters = (nextSearch, nextCategory) => {
    const nextParams = {};

    if (nextSearch.trim()) {
      nextParams.search = nextSearch.trim();
    }

    if (nextCategory.trim()) {
      nextParams.category = nextCategory.trim();
    }

    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    applyFilters(searchInput, categoryInput);
  };

  const handleStatusToggle = async (product) => {
    setError("");
    setSuccessMessage("");

    try {
      const updatedProduct = await updateProduct(token, product.id, {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        isActive: !product.isActive,
      });

      setProducts((currentProducts) =>
        currentProducts.map((item) => (item.id === product.id ? updatedProduct : item))
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
        <p style={styles.eyebrow}>Seller Product Management</p>
        <h1 style={styles.title}>Manage what shoppers can see in your storefront.</h1>
        <p style={styles.subtitle}>
          Add new products, adjust details, and switch products on or off sale without leaving
          your dashboard.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Catalog Controls</h2>
          <Link to="/seller/products/new" style={styles.primaryButton}>
            Add Product
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search your products"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Filter by category"
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.primaryButton}>
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setCategoryInput("");
              setSearchParams({});
            }}
            style={styles.secondaryButton}
          >
            Reset
          </button>
        </form>
      </section>

      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {isLoading ? (
        <p style={styles.status}>Loading seller products...</p>
      ) : products.length === 0 ? (
        <section style={styles.section}>
          <p style={styles.status}>No products found yet. Start by creating your first listing.</p>
        </section>
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
                  <span style={getStatusBadgeStyle(product.isActive)}>
                    {product.isActive ? "Published" : "Unpublished"}
                  </span>
                  <span style={styles.stockBadge}>{product.stock} in stock</span>
                </div>

                <h2 style={styles.productTitle}>{product.name}</h2>
                <p style={styles.productDescription}>{product.description}</p>

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
