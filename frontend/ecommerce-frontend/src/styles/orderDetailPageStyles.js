const orderDetailPageStyles = {
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
      "radial-gradient(circle at top left, rgba(255,247,231,0.96), rgba(227,205,171,0.92) 48%, rgba(88,118,74,0.9) 100%)",
    color: "#2b170a",
    boxShadow: "0 18px 48px rgba(73, 89, 43, 0.18)",
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
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    lineHeight: 1.05,
  },
  subtitle: {
    margin: 0,
    fontSize: "1.05rem",
    lineHeight: 1.7,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.95fr) minmax(0, 1.2fr)",
    gap: "1.5rem",
    alignItems: "start",
  },
  detailsCard: {
    padding: "1.5rem",
    borderRadius: "24px",
    backgroundColor: "#fffaf2",
    border: "1px solid #ecdcc8",
  },
  itemsCard: {
    padding: "1.5rem",
    borderRadius: "24px",
    backgroundColor: "white",
    border: "1px solid #ecdcc8",
    boxShadow: "0 12px 32px rgba(67, 41, 18, 0.08)",
  },
  sectionTitle: {
    margin: "0 0 1rem",
    fontSize: "1.35rem",
  },
  detailLine: {
    margin: "0 0 0.8rem",
    lineHeight: 1.7,
    color: "#4f4035",
  },
  subsectionTitle: {
    margin: "1.5rem 0 0.9rem",
    fontSize: "1.05rem",
  },
  shipmentList: {
    display: "grid",
    gap: "0.75rem",
  },
  shipmentCard: {
    padding: "1rem",
    borderRadius: "18px",
    backgroundColor: "#fff",
    border: "1px solid #ecdcc8",
  },
  itemsList: {
    display: "grid",
    gap: "0.9rem",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "0.9rem",
    borderBottom: "1px solid #f0e2d2",
  },
  itemName: {
    margin: "0 0 0.2rem",
    fontWeight: "700",
  },
  itemMeta: {
    margin: 0,
    color: "#5f5147",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingTop: "1rem",
    marginTop: "1rem",
    borderTop: "1px solid #ecdcc8",
    fontSize: "1.05rem",
  },
  primaryLink: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.9rem 1.25rem",
    borderRadius: "999px",
    backgroundColor: "#7f4f24",
    color: "#fffaf4",
    textDecoration: "none",
    fontWeight: "700",
  },
  secondaryLink: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.9rem 1.25rem",
    borderRadius: "999px",
    backgroundColor: "#ffffff",
    color: "#7f4f24",
    border: "1px solid #d9c4a8",
    textDecoration: "none",
    fontWeight: "700",
  },
  linkRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
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

export default orderDetailPageStyles;
