import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function normalizeRoles(roles) {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles.filter((role) => typeof role === "string" && role.trim().length > 0);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [roles, setRoles] = useState(() =>
    normalizeRoles(JSON.parse(localStorage.getItem("userRoles") ?? "[]"))
  );

  const login = (jwtToken, email, userRoles = []) => {
    const normalizedRoles = normalizeRoles(userRoles);

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRoles", JSON.stringify(normalizedRoles));

    setToken(jwtToken);
    setUserEmail(email);
    setRoles(normalizedRoles);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoles");

    setToken(null);
    setUserEmail(null);
    setRoles([]);
  };

  const isAuthenticated = !!token;
  const hasRole = (role) => roles.includes(role);
  const hasAnyRole = (allowedRoles = []) => {
    if (!allowedRoles.length) {
      return true;
    }

    return allowedRoles.some((role) => roles.includes(role));
  };
  const isBuyer = hasRole("Buyer");
  const isSeller = hasAnyRole(["Seller", "Admin"]);
  const isAdmin = hasRole("Admin");

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        roles,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        isBuyer,
        isSeller,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
