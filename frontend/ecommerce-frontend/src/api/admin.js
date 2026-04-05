import { apiRequest } from "./client";

export async function getAdminDashboard(token) {
  return apiRequest("/admin/dashboard", { token });
}

export async function getAdminUsers(token, { search = "", role = "" } = {}) {
  return apiRequest("/admin/users", {
    token,
    query: { search, role },
  });
}

export async function getAdminProducts(
  token,
  { search = "", category = "", sellerEmail = "", isActive } = {}
) {
  return apiRequest("/admin/products", {
    token,
    query: {
      search,
      category,
      sellerEmail,
      isActive,
    },
  });
}

export async function getAdminOrders(token, { search = "", status = "" } = {}) {
  return apiRequest("/admin/orders", {
    token,
    query: { search, status },
  });
}

export async function deleteAdminUser(token, userId) {
  await apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
    token,
  });
}
