import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProduct, getManagedProductById, updateProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/sellerPageStyles";
import { normalizeFieldErrors } from "../utils/formErrors";

const initialFormState = {
  name: "",
  description: "",
  category: "",
  price: "",
  imageUrl: "",
  stock: "",
  isActive: true,
};

function isValidImageUrl(value) {
  if (!value.trim()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateProductForm(formData) {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Product name is required.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Product name must be at least 2 characters.";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required.";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (!formData.category.trim()) {
    errors.category = "Category is required.";
  } else if (formData.category.trim().length < 2) {
    errors.category = "Category must be at least 2 characters.";
  }

  if (formData.price === "") {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(Number(formData.price)) || Number(formData.price) < 0) {
    errors.price = "Price must be a number greater than or equal to 0.";
  }

  if (formData.stock === "") {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
    errors.stock = "Stock must be a whole number greater than or equal to 0.";
  }

  if (!isValidImageUrl(formData.imageUrl)) {
    errors.imageUrl = "Image URL must be a valid absolute URL.";
  }

  return errors;
}

export default function SellerProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
    setFieldErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSaving(true);

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
      setFieldErrors(normalizeFieldErrors(err.errors));
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
              style={{
                ...styles.input,
                ...(fieldErrors.name ? styles.inputError : {}),
              }}
            />
            {fieldErrors.name && <p style={styles.fieldError}>{fieldErrors.name}</p>}
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
              style={{
                ...styles.input,
                ...styles.textarea,
                ...(fieldErrors.description ? styles.inputError : {}),
              }}
            />
            {fieldErrors.description && (
              <p style={styles.fieldError}>{fieldErrors.description}</p>
            )}
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
                style={{
                  ...styles.input,
                  ...(fieldErrors.category ? styles.inputError : {}),
                }}
              />
              {fieldErrors.category && <p style={styles.fieldError}>{fieldErrors.category}</p>}
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
                style={{
                  ...styles.input,
                  ...(fieldErrors.imageUrl ? styles.inputError : {}),
                }}
              />
              {fieldErrors.imageUrl && <p style={styles.fieldError}>{fieldErrors.imageUrl}</p>}
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
                style={{
                  ...styles.input,
                  ...(fieldErrors.price ? styles.inputError : {}),
                }}
              />
              {fieldErrors.price && <p style={styles.fieldError}>{fieldErrors.price}</p>}
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
                style={{
                  ...styles.input,
                  ...(fieldErrors.stock ? styles.inputError : {}),
                }}
              />
              {fieldErrors.stock && <p style={styles.fieldError}>{fieldErrors.stock}</p>}
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
