"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Cart, CartItem } from "@/lib/types";

type CartContextType = {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  clearError: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = "of-blood-cart-id";
const DEBUG_MODE = process.env.NODE_ENV === 'development' && false;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRefreshingRef = useRef(false);
  
  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      console.log('[Cart Context] No cart ID found, skipping refresh');
      setCart(null);
      setError(null);
      return;
    }

    // Prevent multiple simultaneous refresh calls
    if (isRefreshingRef.current) {
      console.log('[Cart Context] Refresh already in progress, skipping');
      return;
    }
    isRefreshingRef.current = true;

    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // URL encode the cartId to handle special characters like ?key=
      const encodedCartId = encodeURIComponent(cartId);
      console.log('[Cart Context] Refreshing cart ID:', cartId.substring(0, 30) + '...');
      
      const response = await fetch(`/api/cart?cartId=${encodedCartId}`);
      if (response.ok) {
        const cartData = await response.json();
        console.log('[Cart Context] ✓ Cart refreshed. Total items:', cartData.totalQuantity, '| Line items:', cartData.items?.length || 0);
        
        if (cartData.items) {
          console.log('[Cart Context] ✓ Cart contents:', cartData.items.map((i: any) => 
            `${i.title} (${i.variantTitle}) x${i.quantity}`
          ));
        }
        
        setCart(cartData);
        setError(null);
      } else {
        console.warn('[Cart Context] ⚠️ Failed to refresh cart (invalid/expired), clearing cart ID');
        // Cart might be invalid or expired, clear it
        localStorage.removeItem(CART_ID_KEY);
        setCart(null);
        setError('Your cart has expired. Please add items again.');
      }
    } catch (error: any) {
      console.error("[Cart Context] ✗ Error refreshing cart:", error);
      // Don't clear cart on network errors, just keep the old state and show error
      setError('Unable to refresh cart. Please check your connection.');
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      console.log('[Cart Context] Loading cart on mount. Cart ID:', cartId);
      refreshCart();
    } else {
      console.log('[Cart Context] No cart ID found on mount');
    }
  }, [refreshCart]);

  const addItem = async (variantId: string, quantity: number) => {
    console.log('[Cart Context] ========== ADD ITEM ==========');
    console.log('[Cart Context] Request:', { variantId, quantity });
    setIsLoading(true);
    setError(null); // Clear previous errors
    
    try {
      // Validate inputs
      if (!variantId || quantity < 1) {
        throw new Error('Invalid item or quantity');
      }

      let cartId = localStorage.getItem(CART_ID_KEY);

      // Create cart if it doesn't exist
      if (!cartId) {
        console.log('[Cart Context] No cart exists, creating new cart');
        try {
          const createResponse = await fetch("/api/cart", {
            method: "POST",
          });
          
          if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to create cart");
          }
          
          const newCart = await createResponse.json();
          cartId = newCart.id as string;
          
          if (!cartId) {
            throw new Error("Cart creation failed - no cart ID returned");
          }
          
          localStorage.setItem(CART_ID_KEY, cartId);
          console.log('[Cart Context] ✓ New cart created:', cartId);
        } catch (createError: any) {
          console.error('[Cart Context] ✗ Failed to create cart:', createError);
          setError('Unable to create cart. Please try again.');
          throw new Error(`Cart creation failed: ${createError.message}`);
        }
      }

      // Add item to cart
      console.log('[Cart Context] Sending to API:', { cartId, variantId, quantity });
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, variantId, quantity }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Cart Context] API returned error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = error.message || error.error || "Failed to add item to cart";
        
        if (response.status === 404) {
          errorMessage = "Item not found. It may be out of stock.";
          // Clear invalid cart
          localStorage.removeItem(CART_ID_KEY);
          setCart(null);
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again.";
        }
        
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const cartData = await response.json();
      console.log('[Cart Context] ✓ API Response - Total items in cart:', cartData.totalQuantity);
      console.log('[Cart Context] ✓ Items breakdown:', cartData.items?.map((i: any) => ({ 
        title: i.title, 
        variant: i.variantTitle,
        qty: i.quantity 
      })));
      
      // CRITICAL: Set the new cart state
      setCart(cartData);
      setError(null); // Clear any previous errors on success
      console.log('[Cart Context] ✓ Cart state updated');
    } catch (error: any) {
      console.error("[Cart Context] ✗ Error adding to cart:", error);
      
      // Set user-friendly error message if not already set
      if (!error.message.includes('Unable to create cart')) {
        setError(error.message || 'Failed to add item. Please try again.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      console.error('[Cart Context] No cart ID found');
      setError('Cart not found. Please refresh the page.');
      return;
    }

    // Validate quantity
    if (quantity < 0) {
      setError('Invalid quantity');
      return;
    }

    console.log('[Cart Context] updateItem called:', { cartId, lineId, quantity });
    setIsLoading(true);
    setError(null);
    
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
        
        let errorMessage = errorData.error || "Failed to update cart";
        if (response.status === 404) {
          errorMessage = "Cart item not found. Refreshing cart...";
          // Refresh cart to sync state
          setTimeout(() => refreshCart(), 500);
        }
        
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const cartData = await response.json();
      console.log('[Cart Context] Cart updated successfully:', cartData);
      setCart(cartData);
      setError(null);
    } catch (error: any) {
      console.error("[Cart Context] Error updating cart:", error.message || error);
      setError(error.message || 'Failed to update item. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) {
      console.error('[Cart Context] No cart ID found');
      setError('Cart not found. Please refresh the page.');
      return;
    }

    console.log('[Cart Context] removeItem called:', { cartId, lineId });
    setIsLoading(true);
    setError(null);
    
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
        
        let errorMessage = errorData.error || "Failed to remove item from cart";
        if (response.status === 404) {
          errorMessage = "Item already removed. Refreshing cart...";
          // Refresh cart to sync state
          setTimeout(() => refreshCart(), 500);
        }
        
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const cartData = await response.json();
      console.log('[Cart Context] Item removed successfully:', cartData);
      setCart(cartData);
      setError(null);
    } catch (error: any) {
      console.error("[Cart Context] Error removing from cart:", error.message || error);
      setError(error.message || 'Failed to remove item. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    localStorage.removeItem(CART_ID_KEY);
    setCart(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
        clearCart,
        clearError,
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

