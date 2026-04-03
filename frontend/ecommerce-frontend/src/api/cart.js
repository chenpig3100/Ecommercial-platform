import { API_BASE_URL } from "./config";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

function createAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getCart(token) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load cart");
}

export async function addCartItem(token, item) {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(item),
  });

  return parseResponse(response, "Unable to add item to cart");
}

export async function updateCartItem(token, itemId, item) {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(item),
  });

  return parseResponse(response, "Unable to update cart item");
}

export async function removeCartItem(token, itemId) {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response, "Unable to remove cart item");
}

export async function clearCart(token) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response, "Unable to clear cart");
}
