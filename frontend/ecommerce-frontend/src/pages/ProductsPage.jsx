import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, getProducts } from "../api/products";
import styles from "../styles/productsPageStyles";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts({ search, category });
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [category, search]);

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
    applyFilters(searchInput, category);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Product Catalog</p>
        <h1 style={styles.title}>Discover products with category and search built in.</h1>
        <p style={styles.subtitle}>
          Browse the catalog, filter by category, and open any item for full details.
        </p>
      </section>

      <section style={styles.filterPanel}>
        <form onSubmit={handleSearchSubmit} style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by product name or description"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.primaryButton}>
            Search
          </button>
          <button type="button" onClick={clearFilters} style={styles.secondaryButton}>
            Reset
          </button>
        </form>

        <div style={styles.categoryRow}>
          <button
            type="button"
            onClick={() => applyFilters(searchInput, "")}
            style={{
              ...styles.categoryChip,
              ...(category === "" ? styles.categoryChipActive : {}),
            }}
          >
            All
          </button>

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => applyFilters(searchInput, item)}
              style={{
                ...styles.categoryChip,
                ...(category === item ? styles.categoryChipActive : {}),
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {error && <p style={styles.error}>{error}</p>}

      {isLoading ? (
        <p style={styles.status}>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={styles.status}>No products matched the current filter.</p>
      ) : (
        <section style={styles.grid}>
          {products.map((product) => (
            <article key={product.id} style={styles.card}>
              <div style={styles.cardImageWrap}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={styles.cardImage} />
                ) : (
                  <div style={styles.placeholderImage}>No image</div>
                )}
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardMeta}>
                  <span style={styles.categoryLabel}>{product.category}</span>
                  <span style={styles.stockLabel}>{product.stock} in stock</span>
                </div>
                <h2 style={styles.cardTitle}>{product.name}</h2>
                <p style={styles.cardDescription}>{product.description}</p>
                <div style={styles.cardFooter}>
                  <strong style={styles.price}>{formatPrice(product.price)}</strong>
                  <Link to={`/products/${product.id}`} style={styles.cardLink}>
                    View details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
