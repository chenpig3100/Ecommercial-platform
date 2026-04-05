import { apiRequest } from "./client";

export async function checkout(token, payload) {
  return apiRequest("/orders/checkout", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function getOrderById(token, id) {
  return apiRequest(`/orders/${id}`, { token });
}

export async function getMyOrders(token) {
  return apiRequest("/orders", { token });
}

export async function getSellerOrders(token, { status = "" } = {}) {
  return apiRequest("/seller/orders", {
    token,
    query: { status },
  });
}

export async function getSellerOrderById(token, id) {
  return apiRequest(`/seller/orders/${id}`, { token });
}

export async function updateSellerOrderStatus(token, id, payload) {
  return apiRequest(`/seller/orders/${id}/status`, {
    method: "PUT",
    token,
    body: payload,
  });
}
