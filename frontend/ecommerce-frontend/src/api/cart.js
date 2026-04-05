import { apiRequest } from "./client";

export async function getCart(token) {
  return apiRequest("/cart", { token });
}

export async function addCartItem(token, item) {
  return apiRequest("/cart/items", {
    method: "POST",
    token,
    body: item,
  });
}

export async function updateCartItem(token, itemId, item) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: "PUT",
    token,
    body: item,
  });
}

export async function removeCartItem(token, itemId) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: "DELETE",
    token,
  });
}

export async function clearCart(token) {
  return apiRequest("/cart", {
    method: "DELETE",
    token,
  });
}
