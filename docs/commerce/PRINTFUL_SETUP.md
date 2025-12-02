# Printful Integration Setup Guide

This guide will help you set up the Printful integration for order fulfillment.

## Overview

The integration works as follows:
1. Customer adds products to cart on your website
2. Customer completes checkout (payment processed by Shopify)
3. Shopify webhook triggers when order is paid
4. Order is automatically synced to Printful for fulfillment
5. Printful prints, packs, and ships the product
6. Customer receives shipping confirmation email with tracking

## Step 1: Get Printful API Key

1. Sign up for a Printful account at [printful.com](https://www.printful.com)
2. Go to **Settings** > **API**
3. Click **Generate API key** or use your existing key
4. Copy the API key

## Step 2: Add API Key to Environment Variables

Add to your `.env.local` file:
```
PRINTFUL_API_KEY=your_printful_api_key_here
```

## Step 3: Map Shopify Products to Printful Variants

**Important**: You need to map each Shopify product variant to a Printful variant ID.

### Option A: Using Shopify Metafields (Recommended)

1. In Shopify Admin, go to **Products**
2. For each product variant, add a metafield:
   - Namespace: `printful`
   - Key: `variant_id`
   - Value: The Printful variant ID (e.g., `4011` for a Gildan 64000 Unisex Softstyle T-Shirt in Black, Size M)

### Option B: Using Product Tags

Add a tag to your Shopify products in the format: `printful_variant_4011`

### Option C: Database Mapping

Create a mapping table in your database that stores:
- Shopify variant ID → Printful variant ID

## Step 4: Set Up Shopify Webhook

1. In Shopify Admin, go to **Settings** > **Notifications** > **Webhooks**
2. Click **Create webhook**
3. Configure:
   - **Event**: Order payment
   - **Format**: JSON
   - **URL**: `https://your-domain.com/api/webhooks/shopify`
4. Generate a webhook secret and add it to your `.env.local`:
   ```
   SHOPIFY_WEBHOOK_SECRET=your_webhook_secret_here
   ```

## Step 5: Set Up Printful Webhook

1. In Printful Dashboard, go to **Settings** > **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/printful`
3. Select events:
   - `package.shipped` (for shipping notifications)
4. Set a webhook secret in Printful and add it to `.env.local`:
   ```
   PRINTFUL_WEBHOOK_SECRET=your_printful_webhook_secret
   ```

## Step 6: Test the Integration

1. Create a test order in your Shopify store
2. Complete payment
3. Check Printful dashboard to see if order was created
4. Check email inbox for order confirmation

## Troubleshooting

### Orders not syncing to Printful

- Check webhook logs in Shopify Admin
- Verify `PRINTFUL_API_KEY` is set correctly
- Ensure product variants have Printful variant IDs mapped
- Check server logs for errors

### Shipping emails not sending

- Verify `RESEND_API_KEY` is set
- Check Printful webhook is configured correctly
- Check server logs for email errors

## Product Setup in Printful

1. In Printful Dashboard, go to **Stores** > **Your Store**
2. Click **Add product**
3. Choose a product template
4. Upload your designs
5. Configure variants (sizes, colors)
6. **Important**: Note the variant IDs - you'll need these for mapping

## Finding Printful Variant IDs

1. In Printful Dashboard, go to **Catalog**
2. Browse products
3. Click on a product to see variant details
4. The variant ID is shown in the URL or product details
5. You can also use the Printful API to list variants

## Next Steps

- Set up product templates in Printful
- Upload your designs
- Map all Shopify variants to Printful variants
- Test with a real order
- Monitor webhook logs for any issues

