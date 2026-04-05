import { apiRequest } from "./client";

export async function registerUser(email, password) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export async function loginUser(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function getPrivateData(token) {
  return apiRequest("/test/private", { token });
}
