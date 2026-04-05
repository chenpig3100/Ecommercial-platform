import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(message, { status = 500, traceId = "", errors = {}, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.traceId = traceId;
    this.errors = errors;
    this.data = data;
  }
}

function buildUrl(path, query) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (typeof value === "string" && !value.trim()) {
        return;
      }

      url.searchParams.set(key, String(value).trim());
    });
  }

  return url.toString();
}

function createHeaders(token, headers = {}, hasBody = false) {
  const nextHeaders = { ...headers };

  if (hasBody && !nextHeaders["Content-Type"]) {
    nextHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    nextHeaders.Authorization = `Bearer ${token}`;
  }

  return nextHeaders;
}

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (response.ok) {
    return data;
  }

  const message =
    data?.message ||
    data?.title ||
    data?.errors?.[""]?.[0] ||
    Object.values(data?.errors ?? {}).flat()[0] ||
    "Something went wrong.";

  throw new ApiError(message, {
    status: response.status,
    traceId: data?.traceId ?? "",
    errors: data?.errors ?? {},
    data,
  });
}

export async function apiRequest(path, { method = "GET", token, body, headers, query } = {}) {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: createHeaders(token, headers, body !== undefined),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return parseResponse(response);
}
