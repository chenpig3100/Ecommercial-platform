import { API_BASE_URL } from "./config";

function createAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || fallbackMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function checkout(token, payload) {
  const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse(response, "Unable to complete checkout");
}

export async function getOrderById(token, id) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load order");
}

export async function getMyOrders(token) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load orders");
}

export async function getSellerOrders(token, { status = "" } = {}) {
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }

  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/seller/orders${query ? `?${query}` : ""}`, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load seller orders");
}

export async function getSellerOrderById(token, id) {
  const response = await fetch(`${API_BASE_URL}/seller/orders/${id}`, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load seller order");
}

export async function updateSellerOrderStatus(token, id, payload) {
  const response = await fetch(`${API_BASE_URL}/seller/orders/${id}/status`, {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse(response, "Unable to update seller order status");
}
