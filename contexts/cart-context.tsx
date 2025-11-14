"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Cart, CartItem } from "@/lib/types";

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = "of-blood-cart-id";
const DEBUG_MODE = process.env.NODE_ENV === 'development' && false;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isRefreshingRef = useRef(false);
  
  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      if (DEBUG_MODE) console.log('[Cart Context] No cart ID found, skipping refresh');
      return;
    }

    // Prevent multiple simultaneous refresh calls
    if (isRefreshingRef.current) {
      if (DEBUG_MODE) console.log('[Cart Context] Refresh already in progress, skipping');
      return;
    }
    isRefreshingRef.current = true;

    setIsLoading(true);
    try {
      // URL encode the cartId to handle special characters like ?key=
      const encodedCartId = encodeURIComponent(cartId);
      if (DEBUG_MODE) console.log('[Cart Context] Refreshing cart:', cartId);
      
      const response = await fetch(`/api/cart?cartId=${encodedCartId}`);
      if (response.ok) {
        const cartData = await response.json();
        if (DEBUG_MODE) console.log('[Cart Context] Cart refreshed successfully:', cartData);
        setCart(cartData);
      } else {
        console.warn('[Cart Context] Failed to refresh cart, clearing invalid cart');
        // Cart might be invalid, clear it
        localStorage.removeItem(CART_ID_KEY);
        setCart(null);
      }
    } catch (error) {
      console.error("[Cart Context] Error refreshing cart:", error);
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      if (DEBUG_MODE) console.log('[Cart Context] Loading cart on mount. Cart ID:', cartId);
      refreshCart();
    }
  }, [refreshCart]);

  const addItem = async (variantId: string, quantity: number) => {
    setIsLoading(true);
    try {
      let cartId = localStorage.getItem(CART_ID_KEY);

      // Create cart if it doesn't exist
      if (!cartId) {
        if (DEBUG_MODE) console.log('[Cart Context] No cart exists, creating new cart');
        const createResponse = await fetch("/api/cart", {
          method: "POST",
        });
        if (!createResponse.ok) throw new Error("Failed to create cart");
        const newCart = await createResponse.json();
        cartId = newCart.id as string;
        if (cartId) {
          localStorage.setItem(CART_ID_KEY, cartId);
          if (DEBUG_MODE) console.log('[Cart Context] New cart created:', cartId);
        }
      }

      // Add item to cart
      if (DEBUG_MODE) console.log('[Cart Context] Adding item to cart:', { cartId, variantId, quantity });
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, variantId, quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add item to cart");
      }

      const cartData = await response.json();
      if (DEBUG_MODE) console.log('[Cart Context] Item added successfully:', cartData);
      setCart(cartData);
    } catch (error) {
      console.error("[Cart Context] Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      console.error('[Cart Context] No cart ID found');
      return;
    }

    console.log('[Cart Context] updateItem called:', { cartId, lineId, quantity });
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId, quantity }),
      });

      console.log('[Cart Context] Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Cart Context] Update failed:', errorData);
        throw new Error(errorData.error || "Failed to update cart");
      }

      const cartData = await response.json();
      console.log('[Cart Context] Cart updated successfully:', cartData);
      setCart(cartData);
    } catch (error: any) {
      console.error("[Cart Context] Error updating cart:", error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      console.error('[Cart Context] No cart ID found');
      return;
    }

    console.log('[Cart Context] removeItem called:', { cartId, lineId });
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, lineId }),
      });

      console.log('[Cart Context] Remove response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Cart Context] Remove failed:', errorData);
        throw new Error(errorData.error || "Failed to remove item from cart");
      }

      const cartData = await response.json();
      console.log('[Cart Context] Item removed successfully:', cartData);
      setCart(cartData);
    } catch (error: any) {
      console.error("[Cart Context] Error removing from cart:", error.message || error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    localStorage.removeItem(CART_ID_KEY);
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

