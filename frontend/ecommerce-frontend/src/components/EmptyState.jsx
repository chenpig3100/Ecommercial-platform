import { Link } from "react-router-dom";
import styles from "../styles/uiStateStyles";

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <section style={styles.emptyState}>
      <h2 style={styles.emptyTitle}>{title}</h2>
      {description && <p style={styles.emptyText}>{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} style={styles.emptyAction}>
          {actionLabel}
        </Link>
      )}
    </section>
  );
}
