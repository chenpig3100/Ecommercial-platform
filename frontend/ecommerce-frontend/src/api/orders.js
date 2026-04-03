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
