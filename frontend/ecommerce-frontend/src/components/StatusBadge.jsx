import styles from "../styles/uiStateStyles";

const toneMap = {
  pending: {
    backgroundColor: "#fff3d6",
    color: "#935d00",
  },
  processing: {
    backgroundColor: "#e7f0ff",
    color: "#2251a3",
  },
  shipped: {
    backgroundColor: "#ebe7ff",
    color: "#5a35b2",
  },
  delivered: {
    backgroundColor: "#dcf6e5",
    color: "#0f6b44",
  },
  cancelled: {
    backgroundColor: "#fde6e2",
    color: "#b63b2f",
  },
  published: {
    backgroundColor: "#dcf6e5",
    color: "#0f6b44",
  },
  unpublished: {
    backgroundColor: "#fff0dd",
    color: "#9b5a15",
  },
  neutral: {
    backgroundColor: "#f0ece6",
    color: "#5b5147",
  },
};

function getTone(status) {
  if (!status) {
    return toneMap.neutral;
  }

  const normalizedStatus = String(status).trim().toLowerCase();
  return toneMap[normalizedStatus] ?? toneMap.neutral;
}

export default function StatusBadge({ status, style }) {
  return <span style={{ ...styles.badge, ...getTone(status), ...style }}>{status}</span>;
}
