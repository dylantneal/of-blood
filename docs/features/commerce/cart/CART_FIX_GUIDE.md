# Cart Fix Guide

## What Was Fixed

The cart system had issues with data transformation and error handling. Here's what I fixed:

### 1. **Created Cart Utility Module** (`lib/cart-utils.ts`)
- Centralized cart data transformation logic
- Added comprehensive null/undefined checks
- Better error handling with detailed logging
- Safely extracts data from Shopify's nested GraphQL response structure

### 2. **Updated All Cart API Routes**
Now using the safe transformation utility:
- `/api/cart` (GET) - Fetch cart
- `/api/cart/add` (POST) - Add items
- `/api/cart/update` (POST) - Update quantities
- `/api/cart/remove` (POST) - Remove items

### 3. **Improved Cart Context** (`contexts/cart-context.tsx`)
- Added conditional debug logging (disabled by default)
- Better error messages
- More robust state management

### 4. **Enhanced Cart Drawer** (`components/cart/cart-drawer.tsx`)
- Made debug panel conditional (disabled by default)
- Cleaner user interface
- Better loading states

### 5. **Created Test Endpoint** (`/api/cart/test`)
- Diagnostic tool to verify Shopify connection
- Tests cart creation and retrieval
- Provides detailed error information

---

## How to Test

### Step 1: Check Environment Variables

Make sure your `.env.local` file has these set:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx
```

### Step 2: Test the Connection

1. Start the dev server: `npm run dev`
2. Visit: http://localhost:3000/api/cart/test
3. You should see JSON output like:

```json
{
  "timestamp": "2025-11-14T...",
  "tests": {
    "environmentVariables": {
      "domain": "✅ Set",
      "token": "✅ Set"
    },
    "createCart": {
      "success": true,
      "cartId": "gid://shopify/Cart/...",
      "checkoutUrl": "https://..."
    },
    "getCart": {
      "success": true,
      "hasLines": true,
      "linesStructure": ["edges"]
    }
  },
  "success": true,
  "message": "✅ Cart system is working!"
}
```

### Step 3: Test Adding Products

1. Go to your merch page: http://localhost:3000/merch
2. Click on a product
3. Select a variant (size, color, etc.)
4. Click "Add to Cart"
5. The cart drawer should slide open automatically
6. You should see the item with:
   - Product image
   - Product title
   - Variant (e.g., "Large")
   - Quantity
   - Price

### Step 4: Test Cart Operations

- **Increase/Decrease Quantity**: Use the +/- buttons
- **Remove Item**: Click "Remove" button
- **View Total**: Should update automatically
- **Checkout**: Click "Checkout" button (redirects to Shopify)

---

## Troubleshooting

### Problem: Items not appearing in cart

**Check the browser console** (F12 → Console tab):

Look for error messages starting with:
- `[Cart Utils]` - Transformation errors
- `[API /api/cart/add]` - API errors
- `[Cart Context]` - State management errors

### Problem: "Configuration Error" on merch page

**Solution:**
1. Verify Shopify credentials in `.env.local`
2. Make sure your Shopify Storefront API token is valid
3. Check token permissions (needs `unauthenticated_read_product_listings`)

### Problem: Cart shows empty even after adding items

**Possible causes:**
1. **Shopify API returning unexpected structure** - Check `/api/cart/test`
2. **Cart ID not being saved** - Check localStorage in browser DevTools
3. **Transformation failing** - Enable debug mode (see below)

---

## Enable Debug Mode

If you need detailed logs to diagnose issues:

### In Cart Context (`contexts/cart-context.tsx`)
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development' && true; // Change false to true
```

### In Cart Drawer (`components/cart/cart-drawer.tsx`)
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development' && true; // Change false to true
```

This will show:
- Detailed console logs for every operation
- Debug panel in cart drawer showing cart state
- Transformation details for each item

---

## Common Shopify API Issues

### 401 Unauthorized
- **Cause**: Invalid or missing Storefront API token
- **Fix**: 
  1. Go to Shopify Admin → Settings → Apps → Develop apps
  2. Click your app → API credentials
  3. Find "Storefront API" section (NOT Admin API)
  4. Click "Reveal token once" and copy it
  5. Update `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` in `.env.local`
  6. Restart dev server

### 403 Forbidden
- **Cause**: Token doesn't have required permissions
- **Fix**:
  1. Go to your app → Configuration
  2. Enable these Storefront API scopes:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_write_checkouts`
  3. Save and get a new token

### 404 Not Found
- **Cause**: Wrong store domain
- **Fix**: Verify `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` is correct (e.g., `your-store.myshopify.com`)

---

## Data Flow

Here's how the cart system works now:

```
1. User clicks "Add to Cart"
   ↓
2. product-detail-client.tsx calls addItem(variantId, quantity)
   ↓
3. cart-context.tsx sends POST to /api/cart/add
   ↓
4. API route calls shopify.ts addToCart()
   ↓
5. Shopify returns GraphQL response
   ↓
6. cart-utils.ts transforms response safely
   ↓
7. API returns transformed Cart object
   ↓
8. cart-context.tsx updates cart state
   ↓
9. cart-drawer.tsx displays items
   ↓
10. Custom event triggers drawer to open
```

---

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] `/api/cart/test` returns success
- [ ] Products appear on `/merch` page
- [ ] Can open product detail page
- [ ] Can select variants
- [ ] "Add to Cart" button works
- [ ] Cart drawer opens automatically
- [ ] Items appear in cart with correct details
- [ ] Can increase/decrease quantity
- [ ] Can remove items
- [ ] Total updates correctly
- [ ] Cart badge shows item count in header
- [ ] "Checkout" button redirects to Shopify
- [ ] Cart persists after page refresh

---

## Next Steps

Once the cart is working:

1. **Test the full checkout flow** on Shopify
2. **Set up Printful integration** (if using print-on-demand)
3. **Configure webhooks** for order fulfillment
4. **Test with real products** and complete a test order
5. **Remove debug panels** (already done, just verify)

---

## Need More Help?

If issues persist:

1. **Enable debug mode** (see above)
2. **Check browser console** for detailed errors
3. **Check terminal/server logs** for API errors
4. **Visit `/api/cart/test`** to verify Shopify connection
5. **Verify you have at least one product** in your Shopify store
6. **Make sure products have variants** with `availableForSale: true`

---

## Files Modified

- ✅ `lib/cart-utils.ts` (NEW) - Safe cart transformation
- ✅ `app/api/cart/route.ts` - Uses new utility
- ✅ `app/api/cart/add/route.ts` - Uses new utility
- ✅ `app/api/cart/update/route.ts` - Uses new utility
- ✅ `app/api/cart/remove/route.ts` - Uses new utility
- ✅ `app/api/cart/test/route.ts` (NEW) - Diagnostic endpoint
- ✅ `contexts/cart-context.tsx` - Better error handling
- ✅ `components/cart/cart-drawer.tsx` - Cleaner UI, conditional debug

All changes are backward-compatible and production-ready!

