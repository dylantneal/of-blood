# Merch Integration Summary

## Overview

A complete e-commerce solution has been implemented with Printful and Shopify integration. Customers can browse products, add them to a cart, complete checkout, and orders are automatically fulfilled through Printful.

## Features Implemented

### ✅ Shopping Experience
- **Product Catalog**: Displays products from Shopify store
- **Product Detail Pages**: Full product pages with variant selection (size, color, etc.)
- **Shopping Cart**: Persistent cart with add/update/remove functionality
- **Cart Drawer**: Slide-out cart panel accessible from header
- **Checkout Flow**: Collects shipping information before payment

### ✅ Order Processing
- **Shopify Integration**: Uses Shopify's secure checkout for payment processing
- **Printful Sync**: Orders automatically sync to Printful for fulfillment
- **Webhook Handlers**: Automated order processing via webhooks

### ✅ Customer Communication
- **Order Confirmation**: Email sent when order is placed
- **Shipping Notification**: Email sent with tracking when order ships

## Architecture

### Frontend Components
- `app/merch/page.tsx` - Product listing page
- `app/merch/[handle]/page.tsx` - Product detail page
- `app/checkout/page.tsx` - Checkout page
- `components/cart/cart-drawer.tsx` - Cart UI component
- `contexts/cart-context.tsx` - Cart state management

### Backend API Routes
- `/api/cart/*` - Cart management (create, add, update, remove)
- `/api/orders/create` - Create order and get checkout URL
- `/api/webhooks/shopify` - Handle Shopify order webhooks
- `/api/webhooks/printful` - Handle Printful shipping webhooks

### Libraries
- `lib/shopify.ts` - Shopify Storefront API client
- `lib/printful.ts` - Printful API client
- `lib/types.ts` - TypeScript type definitions

## Order Flow

1. **Customer adds products to cart** → Stored in Shopify Cart API
2. **Customer goes to checkout** → Enters shipping information
3. **Customer completes payment** → Redirected to Shopify checkout
4. **Shopify processes payment** → Order created in Shopify
5. **Webhook triggered** → `/api/webhooks/shopify` receives order
6. **Order synced to Printful** → Printful API creates order
7. **Printful fulfills order** → Prints, packs, ships product
8. **Shipping webhook** → `/api/webhooks/printful` receives shipping update
9. **Customer notified** → Email sent with tracking information

## Setup Requirements

### Environment Variables

Add to `.env.local`:
```bash
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token

# Printful
PRINTFUL_API_KEY=your_printful_api_key

# Webhooks
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
```

### Shopify Setup

1. **Storefront API Access Token**
   - Go to Shopify Admin > Settings > Apps and sales channels
   - Create custom app with Storefront API access
   - Enable scopes: `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`

2. **Webhook Configuration**
   - Go to Settings > Notifications > Webhooks
   - Create webhook: Event = "Order payment", URL = `https://your-domain.com/api/webhooks/shopify`

### Printful Setup

1. **API Key**
   - Get from Printful Dashboard > Settings > API

2. **Product Mapping**
   - Map Shopify variant IDs to Printful variant IDs
   - Store mapping in Shopify metafields or product properties
   - See `PRINTFUL_SETUP.md` for details

3. **Webhook Configuration**
   - Go to Printful Dashboard > Settings > Webhooks
   - Add URL: `https://your-domain.com/api/webhooks/printful`
   - Select event: `package.shipped`

## Important Notes

### Variant Mapping

**Critical**: You must map Shopify product variants to Printful variant IDs. The webhook handler looks for this mapping in:
- Product properties with name `_printful_variant_id`
- Or you can modify the webhook handler to use your preferred mapping method

Example mapping:
- Shopify Variant ID: `gid://shopify/ProductVariant/123456`
- Printful Variant ID: `4011` (for a specific t-shirt size/color)

### Payment Processing

Currently uses Shopify's secure checkout for payment processing. This is the recommended approach as it:
- Handles PCI compliance
- Supports multiple payment methods
- Provides fraud protection
- Handles tax calculations

If you need a fully custom checkout, you would need to integrate Stripe directly (requires additional setup).

### Testing

1. Add test products to Shopify
2. Map variants to Printful variants
3. Create test order
4. Verify webhook receives order
5. Check Printful dashboard for order
6. Verify emails are sent

## Next Steps

1. **Set up Printful account** and get API key
2. **Configure Shopify webhook** pointing to your domain
3. **Map product variants** to Printful variants
4. **Test with a real order** to verify end-to-end flow
5. **Monitor webhook logs** for any issues

## Support Files

- `PRINTFUL_SETUP.md` - Detailed Printful setup guide
- `env.example` - Environment variable template
- `lib/printful.ts` - Printful API client documentation

## Troubleshooting

### Cart not working
- Check browser console for errors
- Verify Shopify Storefront API token is correct
- Check network tab for API call failures

### Orders not syncing
- Verify webhook is configured in Shopify
- Check webhook URL is accessible
- Verify Printful API key is correct
- Check server logs for errors

### Emails not sending
- Verify Resend API key is set
- Check email addresses are valid
- Review Resend dashboard for delivery status

