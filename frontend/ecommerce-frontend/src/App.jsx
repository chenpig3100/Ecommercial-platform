import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import SellerProductFormPage from "./pages/SellerProductFormPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersPage from "./pages/OrdersPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerOrderDetailPage from "./pages/SellerOrderDetailPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["Buyer"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["Buyer"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["Buyer"]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["Buyer"]}>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Buyer"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["Seller", "Admin"]}>
              <SellerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["Seller", "Admin"]}>
              <SellerOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["Seller", "Admin"]}>
              <SellerOrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute allowedRoles={["Seller", "Admin"]}>
              <SellerProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/new"
          element={
            <ProtectedRoute allowedRoles={["Seller", "Admin"]}>
              <SellerProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Seller", "Admin"]}>
              <SellerProductFormPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
