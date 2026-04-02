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

export async function getProducts({ search = "", category = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (category.trim()) {
    params.set("category", category.trim());
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(url);

  return parseResponse(response, "Unable to load products");
}

export async function getProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  return parseResponse(response, "Unable to load product details");
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  return parseResponse(response, "Unable to load categories");
}

export async function getManagedProducts(token, { search = "", category = "" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (category.trim()) {
    params.set("category", category.trim());
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/products/manage${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(url, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load seller products");
}

export async function getManagedProductById(token, id) {
  const response = await fetch(`${API_BASE_URL}/products/manage/${id}`, {
    headers: createAuthHeaders(token),
  });

  return parseResponse(response, "Unable to load seller product");
}

export async function createProduct(token, product) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(product),
  });

  return parseResponse(response, "Unable to create product");
}

export async function updateProduct(token, id, product) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(product),
  });

  return parseResponse(response, "Unable to update product");
}

export async function deleteProduct(token, id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to delete product");
  }
}
