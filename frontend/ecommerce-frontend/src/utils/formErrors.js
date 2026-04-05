export function normalizeFieldErrors(errors = {}) {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );
}
