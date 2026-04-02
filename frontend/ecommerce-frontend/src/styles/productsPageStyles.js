const productsPageStyles = {
  page: {
    maxWidth: "1180px",
    margin: "0 auto 3rem",
    padding: "0 1.5rem",
    color: "#2d241f",
  },
  hero: {
    padding: "2rem",
    borderRadius: "28px",
    marginBottom: "1.5rem",
    background:
      "radial-gradient(circle at top left, rgba(255,244,220,0.95), rgba(232,199,150,0.9) 52%, rgba(118,79,47,0.85) 100%)",
    color: "#2b170a",
    boxShadow: "0 18px 48px rgba(103, 72, 36, 0.18)",
  },
  eyebrow: {
    margin: "0 0 0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  title: {
    margin: "0 0 0.75rem",
    fontSize: "clamp(2rem, 4vw, 3.6rem)",
    lineHeight: 1.05,
  },
  subtitle: {
    maxWidth: "720px",
    margin: 0,
    fontSize: "1.05rem",
    lineHeight: 1.7,
  },
  filterPanel: {
    marginBottom: "1.5rem",
    padding: "1.25rem",
    borderRadius: "24px",
    backgroundColor: "#fffaf2",
    border: "1px solid #eddcc5",
  },
  searchRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },
  searchInput: {
    flex: "1 1 320px",
    minWidth: "220px",
    padding: "0.9rem 1rem",
    borderRadius: "14px",
    border: "1px solid #cdb597",
    fontSize: "1rem",
  },
  primaryButton: {
    padding: "0.9rem 1.25rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#7f4f24",
    color: "#fffaf4",
    cursor: "pointer",
    fontWeight: "700",
  },
  secondaryButton: {
    padding: "0.9rem 1.25rem",
    borderRadius: "999px",
    border: "1px solid #cdb597",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "700",
  },
  categoryRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  categoryChip: {
    padding: "0.6rem 1rem",
    borderRadius: "999px",
    border: "1px solid #d8c0a4",
    backgroundColor: "#fff",
    color: "#6b492e",
    cursor: "pointer",
    fontWeight: "600",
  },
  categoryChipActive: {
    backgroundColor: "#6b492e",
    color: "white",
    borderColor: "#6b492e",
  },
  status: {
    padding: "2rem 0",
    textAlign: "center",
    color: "#6b5a4f",
  },
  error: {
    color: "#b42318",
    marginBottom: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.25rem",
  },
  card: {
    overflow: "hidden",
    borderRadius: "24px",
    backgroundColor: "white",
    border: "1px solid #ecdcc8",
    boxShadow: "0 12px 32px rgba(67, 41, 18, 0.08)",
  },
  cardImageWrap: {
    height: "220px",
    background:
      "linear-gradient(135deg, rgba(255,245,228,0.95), rgba(240,216,183,0.92))",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  placeholderImage: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#8d6f55",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  cardBody: {
    padding: "1rem",
  },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.75rem",
    fontSize: "0.85rem",
    marginBottom: "0.9rem",
  },
  categoryLabel: {
    color: "#7f4f24",
    fontWeight: "700",
  },
  stockLabel: {
    color: "#6b5a4f",
  },
  cardTitle: {
    margin: "0 0 0.6rem",
    fontSize: "1.2rem",
  },
  cardDescription: {
    margin: "0 0 1rem",
    color: "#5f5147",
    lineHeight: 1.6,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  price: {
    fontSize: "1.1rem",
  },
  cardLink: {
    color: "#7f4f24",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default productsPageStyles;
