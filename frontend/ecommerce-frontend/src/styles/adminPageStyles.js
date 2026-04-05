import sellerStyles from "./sellerPageStyles";

const adminPageStyles = {
  ...sellerStyles,
  hero: {
    ...sellerStyles.hero,
    background:
      "linear-gradient(135deg, rgba(228,240,237,0.98), rgba(164,204,194,0.92) 42%, rgba(38,77,73,0.96) 100%)",
    color: "#102a29",
  },
  section: {
    ...sellerStyles.section,
    backgroundColor: "#f7fbfa",
    border: "1px solid #d5e5e1",
  },
  statCard: {
    ...sellerStyles.statCard,
    border: "1px solid #d5e5e1",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,248,246,0.94))",
  },
  primaryButton: {
    ...sellerStyles.primaryButton,
    backgroundColor: "#1f5b56",
  },
  secondaryButton: {
    ...sellerStyles.secondaryButton,
    border: "1px solid #afcfc8",
    color: "#284d49",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "0.75rem",
  },
  panelGrid: {
    display: "grid",
    gap: "1rem",
  },
  panelCard: {
    padding: "1.25rem",
    borderRadius: "22px",
    border: "1px solid #d5e5e1",
    backgroundColor: "#ffffff",
    boxShadow: "0 12px 28px rgba(21, 58, 55, 0.08)",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "0.75rem",
  },
  metaBlock: {
    display: "grid",
    gap: "0.3rem",
  },
  metaLabel: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#607b76",
    fontWeight: "700",
  },
  metaValue: {
    color: "#234542",
    fontWeight: "700",
  },
  roleGroup: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  roleBadge: {
    padding: "0.35rem 0.65rem",
    borderRadius: "999px",
    backgroundColor: "#e2f0ec",
    color: "#1f5b56",
    fontSize: "0.8rem",
    fontWeight: "700",
  },
  fieldError: {
    margin: 0,
    color: "#b42318",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  inputError: {
    border: "1px solid #d46c5f",
    boxShadow: "0 0 0 3px rgba(212,108,95,0.14)",
  },
};

export default adminPageStyles;
