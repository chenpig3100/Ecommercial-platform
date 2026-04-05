import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import styles from "../styles/navBarStyles";

export default function Navbar() {
  const { isAuthenticated, userEmail, roles, isBuyer, isSeller, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("");
  const navRef = useRef(null);

  useEffect(() => {
    setOpenMenu("");
  }, [location.pathname]);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu("");
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleLogout = () => {
    setOpenMenu("");
    logout();
    navigate("/login");
  };

  const toggleMenu = (menuKey) => {
    setOpenMenu((current) => (current === menuKey ? "" : menuKey));
  };

  const closeMenu = () => {
    setOpenMenu("");
  };

  return (
    <nav style={styles.nav} ref={navRef}>
      <div style={styles.leftGroup}>
        <Link to="/" style={styles.brand}>Bryan Store</Link>
        <Link to="/products" style={styles.link}>Products</Link>
        {isAuthenticated && isBuyer && (
          <Link to="/cart" style={styles.link}>
            Cart ({totalItems})
          </Link>
        )}
        {isAuthenticated && isBuyer && (
          <div style={styles.menuWrap}>
            <button
              type="button"
              style={styles.menuTrigger}
              onClick={() => toggleMenu("buyer")}
            >
              My Account
              <span style={styles.menuChevron}>{openMenu === "buyer" ? "▲" : "▼"}</span>
            </button>
            {openMenu === "buyer" && (
              <div style={styles.menuPanel}>
                <div style={styles.menuTitle}>Buyer tools</div>
                <Link to="/dashboard" style={styles.menuLink} onClick={closeMenu}>Dashboard</Link>
                <Link to="/orders" style={styles.menuLink} onClick={closeMenu}>My Orders</Link>
              </div>
            )}
          </div>
        )}
        {isSeller && (
          <div style={styles.menuWrap}>
            <button
              type="button"
              style={styles.menuTrigger}
              onClick={() => toggleMenu("seller")}
            >
              Seller
              <span style={styles.menuChevron}>{openMenu === "seller" ? "▲" : "▼"}</span>
            </button>
            {openMenu === "seller" && (
              <div style={styles.menuPanel}>
                <div style={styles.menuTitle}>Seller workspace</div>
                <Link to="/seller/dashboard" style={styles.menuLink} onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link to="/seller/orders" style={styles.menuLink} onClick={closeMenu}>
                  Orders
                </Link>
                <Link to="/seller/products" style={styles.menuLink} onClick={closeMenu}>
                  Products
                </Link>
              </div>
            )}
          </div>
        )}
        {isAdmin && (
          <div style={styles.menuWrap}>
            <button
              type="button"
              style={styles.menuTrigger}
              onClick={() => toggleMenu("admin")}
            >
              Admin
              <span style={styles.menuChevron}>{openMenu === "admin" ? "▲" : "▼"}</span>
            </button>
            {openMenu === "admin" && (
              <div style={styles.menuPanel}>
                <div style={styles.menuTitle}>Admin tools</div>
                <Link to="/admin/dashboard" style={styles.menuLink} onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link to="/admin/users" style={styles.menuLink} onClick={closeMenu}>
                  Users
                </Link>
                <Link to="/admin/products" style={styles.menuLink} onClick={closeMenu}>
                  Products
                </Link>
                <Link to="/admin/orders" style={styles.menuLink} onClick={closeMenu}>
                  Orders
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.rightGroup}>
        {isAuthenticated ? (
          <>
            <div style={styles.accountMeta}>
              <span style={styles.roleText}>{roles.join(", ")}</span>
              <span style={styles.email}>{userEmail}</span>
            </div>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <div style={styles.authLinkGroup}>
            <Link to="/login" style={styles.authLinkButton}>Login</Link>
            <Link to="/register" style={styles.authLinkButton}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
