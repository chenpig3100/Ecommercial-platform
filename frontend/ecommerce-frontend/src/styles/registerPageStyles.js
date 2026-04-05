const registerPageStyles = {
  container: {
    maxWidth: "460px",
    margin: "0 auto",
    padding: "2rem 1.5rem 3rem",
    color: "#2d241f",
  },
  card: {
    padding: "2rem",
    borderRadius: "28px",
    background:
      "linear-gradient(180deg, rgba(255,250,242,0.98), rgba(248,238,224,0.96))",
    border: "1px solid #ead8be",
    boxShadow: "0 18px 48px rgba(90, 61, 33, 0.12)",
  },
  title: {
    margin: "0 0 0.75rem",
    fontSize: "2rem",
    color: "#3a2414",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    color: "#6b5a4f",
    lineHeight: 1.7,
  },
  form: {
    display: "grid",
    gap: "1rem",
  },
  field: {
    display: "grid",
    gap: "0.45rem",
  },
  label: {
    fontWeight: "700",
    color: "#5b412d",
  },
  input: {
    padding: "0.9rem 1rem",
    fontSize: "1rem",
    borderRadius: "14px",
    border: "1px solid #ccb396",
    backgroundColor: "#ffffff",
  },
  inputError: {
    border: "1px solid #d46c5f",
    boxShadow: "0 0 0 3px rgba(212,108,95,0.14)",
  },
  fieldError: {
    margin: 0,
    color: "#b42318",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  button: {
    padding: "0.9rem 1rem",
    cursor: "pointer",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#7f4f24",
    color: "#fffaf4",
    fontWeight: "700",
  },
  success: {
    color: "#0e6245",
    marginTop: "1rem",
    fontWeight: "700",
  },
  error: {
    color: "#b42318",
    marginTop: "1rem",
    fontWeight: "700",
  },
};

export default registerPageStyles;
