import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../styles/navBarStyles";

export default function Navbar() {
  const { isAuthenticated, userEmail, roles, hasAnyRole, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const isSeller = hasAnyRole(["Seller", "Admin"]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.leftGroup}>
        <Link to="/" style={styles.brand}>Bryan Store</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        {isAuthenticated && (
          <Link to="/cart" style={styles.link}>
            Cart ({totalItems})
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}
        {isSeller && (
          <Link to="/seller/dashboard" style={styles.link}>Seller Dashboard</Link>
        )}
      </div>

      <div>
        {isAuthenticated ? (
          <>
            <span style={styles.email}>{roles.join(", ")}</span>
            <span style={styles.email}>{userEmail}</span>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
