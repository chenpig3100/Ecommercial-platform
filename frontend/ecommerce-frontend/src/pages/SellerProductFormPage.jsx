import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProduct, getManagedProductById, updateProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/sellerPageStyles";

const initialFormState = {
  name: "",
  description: "",
  category: "",
  price: "",
  imageUrl: "",
  stock: "",
  isActive: true,
};

export default function SellerProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadProduct() {
      setIsLoading(true);
      setError("");

      try {
        const product = await getManagedProductById(token, id);
        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: String(product.price),
          imageUrl: product.imageUrl ?? "",
          stock: String(product.stock),
          isActive: product.isActive,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id, isEditMode, token]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      imageUrl: formData.imageUrl.trim(),
      stock: Number(formData.stock),
      isActive: formData.isActive,
    };

    try {
      if (isEditMode) {
        await updateProduct(token, id, payload);
      } else {
        await createProduct(token, payload);
      }

      navigate("/seller/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p style={styles.status}>Loading product editor...</p>;
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Seller Listing Editor</p>
        <h1 style={styles.title}>
          {isEditMode ? "Fine-tune an existing product." : "Create a new storefront listing."}
        </h1>
        <p style={styles.subtitle}>
          Set the key product details first, then decide whether the product should be visible to
          customers right away.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{isEditMode ? "Edit Product" : "New Product"}</h2>
          <Link to="/seller/products" style={styles.secondaryButton}>
            Back to products
          </Link>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label htmlFor="name" style={styles.fieldLabel}>
              Product name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="description" style={styles.fieldLabel}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ ...styles.input, ...styles.textarea }}
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label htmlFor="category" style={styles.fieldLabel}>
                Category
              </label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="imageUrl" style={styles.fieldLabel}>
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.twoColumnGrid}>
            <div style={styles.fieldGroup}>
              <label htmlFor="price" style={styles.fieldLabel}>
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="stock" style={styles.fieldLabel}>
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <div>
              <strong>{formData.isActive ? "Published" : "Unpublished"}</strong>
              <p style={styles.helperText}>
                Published products appear in the public catalog. Unpublished products stay visible
                only in the seller dashboard.
              </p>
            </div>
          </label>

          <div style={styles.actionRow}>
            <button type="submit" disabled={isSaving} style={styles.primaryButton}>
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Save changes"
                  : "Create product"}
            </button>
            <Link to="/seller/products" style={styles.secondaryButton}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
