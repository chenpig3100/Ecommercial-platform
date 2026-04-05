import { useEffect, useState } from "react";
import { deleteAdminUser, getAdminUsers } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/adminPageStyles";
import LoadingState from "../components/LoadingState";
import ErrorBanner from "../components/ErrorBanner";
import EmptyState from "../components/EmptyState";

const roleOptions = ["", "Buyer", "Seller", "Admin"];

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      try {
        const data = await getAdminUsers(token, { search, role });
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, [token, search, role]);

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete account ${user.email}? This only works if the account has no linked product or order history.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteAdminUser(token, user.id);
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id));
      setSuccessMessage(`${user.email} was deleted.`);
      window.alert(`${user.email} was deleted successfully.`);
    } catch (err) {
      setError(err.message);
      window.alert(`Unable to delete ${user.email}: ${err.message}`);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Admin Users</p>
        <h1 style={styles.title}>Track who is buying, selling, and managing the store.</h1>
        <p style={styles.subtitle}>
          Filter by role or email to inspect account activity without leaving the admin area.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>User Directory</h2>
        </div>

        <div style={styles.filterGrid}>
          <input
            type="text"
            placeholder="Search by email or role"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={styles.input}
          />
          <select value={role} onChange={(event) => setRole(event.target.value)} style={styles.input}>
            {roleOptions.map((option) => (
              <option key={option || "all"} value={option}>
                {option || "All roles"}
              </option>
            ))}
          </select>
        </div>
      </section>

      {successMessage && <p style={styles.success}>{successMessage}</p>}
      <ErrorBanner message={error} />

      {isLoading ? (
        <LoadingState message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users matched"
          description="Try a different email keyword or role filter."
        />
      ) : (
        <section style={styles.panelGrid}>
          {users.map((user) => (
            <article key={user.id} style={styles.panelCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>{user.email}</h2>
                  <div style={styles.roleGroup}>
                    {user.roles.length > 0 ? (
                      user.roles.map((item) => (
                        <span key={item} style={styles.roleBadge}>
                          {item}
                        </span>
                      ))
                    ) : (
                      <span style={styles.helperText}>No roles assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.metaGrid}>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Products</span>
                  <span style={styles.metaValue}>{user.productCount}</span>
                </div>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Customer orders</span>
                  <span style={styles.metaValue}>{user.customerOrderCount}</span>
                </div>
                <div style={styles.metaBlock}>
                  <span style={styles.metaLabel}>Seller orders</span>
                  <span style={styles.metaValue}>{user.sellerOrderCount}</span>
                </div>
              </div>

              <div style={{ ...styles.actionRow, justifyContent: "flex-end", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(user)}
                  style={styles.dangerButton}
                >
                  Delete account
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
