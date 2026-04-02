const productDetailPageStyles = {
  page: {
    maxWidth: "1120px",
    margin: "0 auto 3rem",
    padding: "0 1.5rem",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "1rem",
    color: "#7f4f24",
    textDecoration: "none",
    fontWeight: "700",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 1.1fr) minmax(280px, 1fr)",
    gap: "1.5rem",
    alignItems: "stretch",
  },
  imagePanel: {
    minHeight: "420px",
    overflow: "hidden",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(255,245,228,0.95), rgba(230,199,158,0.9))",
    border: "1px solid #ecdcc8",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  placeholder: {
    height: "100%",
    minHeight: "420px",
    display: "grid",
    placeItems: "center",
    color: "#8d6f55",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  infoPanel: {
    padding: "2rem",
    borderRadius: "28px",
    backgroundColor: "#fffaf2",
    border: "1px solid #ecdcc8",
  },
  category: {
    display: "inline-block",
    marginBottom: "0.8rem",
    padding: "0.35rem 0.75rem",
    borderRadius: "999px",
    backgroundColor: "#f3e2cd",
    color: "#7f4f24",
    fontWeight: "700",
  },
  title: {
    margin: "0 0 0.75rem",
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    lineHeight: 1.05,
    color: "#2d241f",
  },
  price: {
    margin: "0 0 1rem",
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#6a3f19",
  },
  description: {
    margin: "0 0 1.5rem",
    lineHeight: 1.8,
    color: "#56493f",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1rem",
  },
  infoCard: {
    padding: "1rem",
    borderRadius: "20px",
    backgroundColor: "white",
    border: "1px solid #ecdcc8",
  },
  infoLabel: {
    display: "block",
    marginBottom: "0.45rem",
    color: "#7f4f24",
    fontSize: "0.9rem",
    fontWeight: "700",
  },
  status: {
    padding: "2rem",
    textAlign: "center",
    color: "#6b5a4f",
  },
  error: {
    color: "#b42318",
    marginBottom: "1rem",
  },
};

export default productDetailPageStyles;
