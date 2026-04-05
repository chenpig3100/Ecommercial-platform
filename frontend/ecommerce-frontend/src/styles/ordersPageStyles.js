const ordersPageStyles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto 3rem",
    padding: "0 1.5rem",
    color: "#2d241f",
  },
  hero: {
    padding: "2rem",
    borderRadius: "28px",
    marginBottom: "1.5rem",
    background:
      "linear-gradient(135deg, rgba(255,247,231,0.96), rgba(215,232,200,0.9) 48%, rgba(49,82,64,0.92) 100%)",
    color: "#1f2118",
    boxShadow: "0 18px 48px rgba(49, 82, 64, 0.16)",
  },
  eyebrow: {
    margin: "0 0 0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  title: {
    margin: "0 0 0.75rem",
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    lineHeight: 1.05,
  },
  subtitle: {
    maxWidth: "720px",
    margin: 0,
    lineHeight: 1.7,
  },
  list: {
    display: "grid",
    gap: "1rem",
  },
  card: {
    padding: "1.5rem",
    borderRadius: "24px",
    backgroundColor: "#fffdf8",
    border: "1px solid #d6e2d7",
    boxShadow: "0 12px 32px rgba(45, 72, 53, 0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "0.9rem",
  },
  orderNumber: {
    margin: "0 0 0.2rem",
    fontSize: "1.3rem",
    fontWeight: "800",
  },
  orderMeta: {
    margin: 0,
    color: "#5b655c",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "1rem",
  },
  sellerList: {
    display: "grid",
    gap: "0.6rem",
  },
  sellerChip: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.85rem 1rem",
    borderRadius: "16px",
    backgroundColor: "#f4f8f2",
    border: "1px solid #dde7da",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "1rem",
  },
  mutedText: {
    color: "#607064",
  },
  primaryLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.85rem 1.2rem",
    borderRadius: "999px",
    backgroundColor: "#315240",
    color: "#f7fbf5",
    textDecoration: "none",
    fontWeight: "700",
  },
  emptyState: {
    padding: "2rem",
    borderRadius: "24px",
    backgroundColor: "#fffdf8",
    border: "1px solid #dde7da",
    textAlign: "center",
  },
  emptyTitle: {
    margin: "0 0 0.5rem",
  },
  emptyText: {
    margin: "0 0 1rem",
    color: "#5b655c",
  },
  status: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b5a4f",
  },
  error: {
    marginBottom: "1rem",
    color: "#b42318",
    fontWeight: "700",
  },
};

export default ordersPageStyles;
