const navBarStyles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    borderBottom: "1px solid #e7dccd",
    marginBottom: "2rem",
    background:
      "linear-gradient(135deg, rgba(255,246,233,0.98), rgba(247,233,213,0.92))",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  brand: {
    marginRight: "0.5rem",
    textDecoration: "none",
    color: "#472d1b",
    fontWeight: "800",
    letterSpacing: "0.04em",
  },
  link: {
    textDecoration: "none",
    color: "#5c4634",
    fontWeight: "600",
  },
  email: {
    marginRight: "1rem",
    color: "#6b5a4f",
  },
  button: {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "999px",
    border: "1px solid #c9a982",
    backgroundColor: "#fff8ef",
  },
}

export default navBarStyles;