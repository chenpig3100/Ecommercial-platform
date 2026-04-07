import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import styles from "../styles/registerPageStyles";
import { normalizeFieldErrors } from "../utils/formErrors";

function validateRegisterForm(form) {
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

  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
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
    setMessage("");
    setError("");
    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const data = await registerUser(form.email.trim(), form.password);
      setMessage(data.message || "Account created successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>
          Create a customer account to save your details, manage orders, and enjoy a smoother
          checkout experience.
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
              placeholder="At least 8 characters"
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

          <label style={styles.field}>
            <span style={styles.label}>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                ...(fieldErrors.confirmPassword ? styles.inputError : {}),
              }}
            />
            {fieldErrors.confirmPassword && (
              <p style={styles.fieldError}>{fieldErrors.confirmPassword}</p>
            )}
          </label>

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </section>
    </main>
  );
}
