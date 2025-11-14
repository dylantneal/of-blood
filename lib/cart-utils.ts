/**
 * Cart transformation utilities
 * Safely transforms Shopify cart responses to our Cart type
 */

import { Cart, CartItem } from "./types";

/**
 * Safely transform Shopify cart response to our Cart type
 */
export function transformShopifyCart(shopifyCart: any): Cart {
  console.log('[Cart Utils] Transforming Shopify cart:', JSON.stringify(shopifyCart, null, 2));

  // Validate cart structure
  if (!shopifyCart) {
    throw new Error('Cart data is null or undefined');
  }

  if (!shopifyCart.id) {
    throw new Error('Cart ID is missing');
  }

  // Safely extract lines
  const lines = shopifyCart.lines?.edges || [];
  console.log(`[Cart Utils] Found ${lines.length} line(s) in cart`);

  // Transform cart items
  const items: CartItem[] = lines
    .map((edge: any, index: number) => {
      try {
        const node = edge?.node;
        if (!node) {
          console.warn(`[Cart Utils] Line ${index} has no node, skipping`);
          return null;
        }

        const merchandise = node.merchandise;
        if (!merchandise) {
          console.warn(`[Cart Utils] Line ${index} has no merchandise, skipping`);
          return null;
        }

        const product = merchandise.product;
        if (!product) {
          console.warn(`[Cart Utils] Line ${index} merchandise has no product, skipping`);
          return null;
        }

        // Extract product image safely - try multiple sources
        const images = product.images?.edges || [];
        const merchandiseImage = merchandise.image?.url || '';
        const productImage = images[0]?.node?.url || '';
        const finalImage = merchandiseImage || productImage || '';

        // Use node.id if available, otherwise use variantId as fallback for unique key
        const itemId = node.id || merchandise.id || `temp-${index}`;

        const item: CartItem = {
          id: itemId,
          variantId: merchandise.id || '',
          productId: product.id || '',
          title: product.title || 'Untitled Product',
          variantTitle: merchandise.title || 'Default',
          quantity: node.quantity || 0,
          price: Math.round(parseFloat(merchandise.price?.amount || '0') * 100),
          image: finalImage,
          handle: product.handle || '',
        };

        console.log(`[Cart Utils] Transformed item ${index}:`, item);
        return item;
      } catch (error) {
        console.error(`[Cart Utils] Error transforming line ${index}:`, error);
        return null;
      }
    })
    .filter((item: CartItem | null): item is CartItem => item !== null);

  console.log(`[Cart Utils] Successfully transformed ${items.length} item(s)`);

  // Extract total amount safely
  const totalAmount = shopifyCart.cost?.totalAmount?.amount 
    ? Math.round(parseFloat(shopifyCart.cost.totalAmount.amount) * 100)
    : 0;

  const currencyCode = shopifyCart.cost?.totalAmount?.currencyCode || 'USD';

  const cart: Cart = {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl || '',
    totalQuantity: shopifyCart.totalQuantity || 0,
    totalAmount,
    currencyCode,
    items,
  };

  console.log('[Cart Utils] Final transformed cart:', {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.totalAmount,
    itemsCount: cart.items.length,
  });

  return cart;
}

