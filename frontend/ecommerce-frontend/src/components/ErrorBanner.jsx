import styles from "../styles/uiStateStyles";

export default function ErrorBanner({ message }) {
  if (!message) {
    return null;
  }

  return <p style={styles.errorBanner}>{message}</p>;
}
