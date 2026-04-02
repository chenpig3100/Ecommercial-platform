import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/login",
  unauthorizedTo = "/unauthorized",
}) {
  const { isAuthenticated, hasAnyRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return children;
}
