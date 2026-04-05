import { apiRequest } from "./client";

export async function getProducts({ search = "", category = "" } = {}) {
  return apiRequest("/products", {
    query: { search, category },
  });
}

export async function getProductById(id) {
  return apiRequest(`/products/${id}`);
}

export async function getCategories() {
  return apiRequest("/products/categories");
}

export async function getManagedProducts(token, { search = "", category = "" } = {}) {
  return apiRequest("/products/manage", {
    token,
    query: { search, category },
  });
}

export async function getManagedProductById(token, id) {
  return apiRequest(`/products/manage/${id}`, { token });
}

export async function createProduct(token, product) {
  return apiRequest("/products", {
    method: "POST",
    token,
    body: product,
  });
}

export async function updateProduct(token, id, product) {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    token,
    body: product,
  });
}

export async function deleteProduct(token, id) {
  await apiRequest(`/products/${id}`, {
    method: "DELETE",
    token,
  });
}
