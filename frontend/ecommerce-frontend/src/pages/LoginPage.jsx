import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/loginPageStyles";
import { normalizeFieldErrors } from "../utils/formErrors";
import ErrorBanner from "../components/ErrorBanner";

function validateLoginForm(form) {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const data = await loginUser(form.email.trim(), form.password);
      login(data.token, data.email, data.roles);
      const nextPath = data.roles?.some((role) => role === "Seller" || role === "Admin")
        ? "/seller/dashboard"
        : "/dashboard";
      navigate(nextPath);
    } catch (err) {
      setFieldErrors(normalizeFieldErrors(err.errors));
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>
          Sign in to continue shopping, manage your store, or review platform activity.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.field}>
            <span style={styles.label}>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(fieldErrors.email ? styles.inputError : {}),
              }}
            />
            {fieldErrors.email && <p style={styles.fieldError}>{fieldErrors.email}</p>}
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(fieldErrors.password ? styles.inputError : {}),
              }}
            />
            {fieldErrors.password && <p style={styles.fieldError}>{fieldErrors.password}</p>}
          </label>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <ErrorBanner message={error} />
      </section>
    </main>
  );
}
