import styles from "../styles/uiStateStyles";

export default function LoadingState({ message = "Loading..." }) {
  return <p style={styles.loading}>{message}</p>;
}
