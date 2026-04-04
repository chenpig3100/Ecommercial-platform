import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  addCartItem,
  clearCart as clearCartRequest,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cart";

const CartContext = createContext();

const emptyCart = {
  id: null,
  userId: "",
  totalItems: 0,
  totalAmount: 0,
  items: [],
  updatedAtUtc: null,
};

export function CartProvider({ children }) {
  const { token, isAuthenticated, isBuyer } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token || !isBuyer) {
      setCart(emptyCart);
      setError("");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadCart() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getCart(token);
        if (isMounted) {
          setCart(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isBuyer, token]);

  async function runCartAction(action) {
    if (!token || !isBuyer) {
      throw new Error("Please log in to manage your cart.");
    }

    setError("");

    try {
      const data = await action();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function refreshCart() {
    return runCartAction(() => getCart(token));
  }

  async function addItem(productId, quantity = 1) {
    return runCartAction(() => addCartItem(token, { productId, quantity }));
  }

  async function updateItem(itemId, quantity) {
    return runCartAction(() => updateCartItem(token, itemId, { quantity }));
  }

  async function removeItem(itemId) {
    return runCartAction(() => removeCartItem(token, itemId));
  }

  async function clearCart() {
    return runCartAction(() => clearCartRequest(token));
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        isLoading,
        error,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
