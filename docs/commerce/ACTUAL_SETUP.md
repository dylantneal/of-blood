# Of Blood - Merch Integration: Actual Setup Documentation

**Last Updated:** December 2, 2025  
**Integration Type:** Printful Native Shopify Integration

---

## 🎯 Overview

Your merch store uses **Printful's native Shopify integration**, which means orders automatically flow from Shopify → Printful without custom webhooks or API calls. This is the simplest and most reliable approach.

## ✅ What You Have (Current Setup)

### Integration Architecture

```
Customer → Your Next.js Site → Shopify Storefront API
                                       ↓
                                   Shopify Cart
                                       ↓
                                Shopify Checkout
                                       ↓
                           [Printful App Installed]
                                       ↓
                                Printful Fulfillment
                                       ↓
                          [Printful Webhook - Optional]
                                       ↓
                              Customer Email Notification
```

### Verified Components

✅ **Shopify Storefront API** - Products displayed correctly  
✅ **Printful Integration** - Products synced from Printful  
✅ **Printful API Key** - Valid with all necessary scopes  
✅ **Cart System** - Fully functional with rate limiting  
✅ **Checkout Flow** - Redirects to Shopify payment  
✅ **Email System** - Ready for notifications  
✅ **Printful Webhook Handler** - Enhanced shipping notifications  

### Products Status

- **16 products** in Shopify
- **Vendor:** "Of Blood Armory" (custom name, not default "Printful")
- **SKUs:** Printful format (e.g., `5052585_8923`)
- **Categories:** Apparel, accessories, posters, patches, and more
- Products confirmed to be synced from Printful

---

## 📝 Environment Variables

### Required (Currently Configured ✅)

```bash
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=if8vpt-fk.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=5117aa248ba23dece49001d4d1cd97ea

# Printful API
PRINTFUL_API_KEY=lHKLNj1CCH6CvzZzFmMoww5k2Ca3O3ZHPhfTDkAN

# Email Service
RESEND_API_KEY=re_cNPaecEq_1frJo2KBGTVV55W3CJ2ePPii
```

### Optional (For Enhanced Features)

```bash
# Printful Webhook (for branded shipping emails)
PRINTFUL_WEBHOOK_SECRET=<get from Printful Dashboard>

# Shopify Webhook (for order logging/analytics - not needed for fulfillment)
SHOPIFY_WEBHOOK_SECRET=<get from Shopify if you want to log orders>
```

---

## 🔄 How Orders Flow (Current Setup)

### Step-by-Step Process

1. **Customer browses merch page**
   - Your Next.js site fetches products from Shopify via Storefront API
   - Products display with images, prices, variants

2. **Customer adds to cart**
   - Creates Shopify cart via Storefront API
   - Cart stored in Shopify (persistent)
   - Cart ID saved in browser localStorage

3. **Customer modifies cart**
   - Update quantities: `/api/cart/update`
   - Remove items: `/api/cart/remove`
   - All changes synced to Shopify cart

4. **Customer clicks checkout**
   - Redirects to Shopify's secure checkout
   - Customer enters shipping/payment info
   - Shopify processes payment securely

5. **Payment completed**
   - **Printful app automatically receives order** 🎯
   - No custom webhook needed
   - Order appears in Printful dashboard instantly

6. **Printful fulfills order**
   - Prints product
   - Packs and ships
   - Updates order status

7. **Customer receives tracking**
   - *Option A:* Printful sends default email
   - *Option B:* Your webhook sends branded email (if configured)

---

## 🛠️ Setup Instructions

### For New Deployments

#### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and add:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
PRINTFUL_API_KEY=your_printful_key
RESEND_API_KEY=your_resend_key
```

#### 2. Verify Printful Connection

Run the diagnostic:

```bash
npm run verify:printful
```

This checks:
- Printful API connection
- Product sync status
- Shopify product count

#### 3. (Optional) Set Up Printful Shipping Webhook

For branded tracking emails:

1. Go to **Printful Dashboard → Settings → Webhooks**
2. Click **Add webhook**
3. Configure:
   - **URL:** `https://your-domain.com/api/webhooks/printful`
   - **Events:** Select `package_shipped`
   - **Secret:** Generate and copy it
4. Add to `.env.local`:
   ```bash
   PRINTFUL_WEBHOOK_SECRET=your_secret_here
   ```

#### 4. Test the Flow

1. Visit `/merch` on your site
2. Add a product to cart
3. Go through checkout (use Shopify test mode)
4. Verify order appears in Printful dashboard

---

## 🚨 What You DON'T Need

### ❌ Shopify Admin API Token

**Not needed** for this setup. Only required if you want to:
- Read product metafields programmatically
- Implement custom order sync logic
- Access admin-level data

### ❌ Shopify Order Webhook

**Not needed** for order fulfillment. The Printful app handles this automatically.

You can optionally set this up for:
- Order analytics/logging
- Custom business logic
- Monitoring order flow

### ❌ Manual Variant Mapping

**Not needed** with Printful's native integration. Printful maintains the mapping internally.

### ❌ Custom Webhook Handler

The files at `/app/api/webhooks/shopify/orders-paid/` mentioned in some docs **don't exist** and **aren't needed**.

---

## 📊 API Endpoints

### Cart Management

```typescript
GET  /api/cart?cartId=<id>         // Get cart contents
POST /api/cart                      // Create new cart
POST /api/cart/add                  // Add item to cart
POST /api/cart/update               // Update item quantity
POST /api/cart/remove               // Remove item from cart
```

### Orders

```typescript
POST /api/orders/create             // Get Shopify checkout URL
```

### Webhooks

```typescript
POST /api/webhooks/printful         // Printful shipping notifications
POST /api/webhooks/shopify          // Shopify events (optional logging)
```

---

## 🧪 Testing

### Integration Test

Run comprehensive integration check:

```bash
npm run check:integration
```

This verifies:
- ✅ All environment variables
- ✅ Shopify connection
- ✅ Printful connection
- ✅ Integration mode detection
- ✅ Recommendations

### Manual Testing Checklist

- [ ] Products load on `/merch` page
- [ ] Product details show on `/merch/[handle]` page
- [ ] Add to cart works
- [ ] Cart drawer opens and shows items
- [ ] Update quantity works
- [ ] Remove from cart works
- [ ] Checkout redirects to Shopify
- [ ] (Test mode) Complete payment
- [ ] Order appears in Printful dashboard
- [ ] (With webhook) Tracking email sent when shipped

---

## 🔍 Monitoring & Debugging

### Check Shopify Products

```bash
curl -H "X-Shopify-Storefront-Access-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ products(first: 5) { edges { node { id title vendor } } } }"}' \
  https://YOUR_STORE.myshopify.com/api/2024-01/graphql.json
```

### Check Printful API

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.printful.com/store/products
```

### View Logs

For webhook debugging:

```bash
# Development
npm run dev

# Production (Vercel)
vercel logs production
```

Look for:
- `[Printful Webhook]` - Shipping notifications
- `[Shopify Webhook]` - Order events (if configured)
- `[API /api/cart/*]` - Cart operations

---

## ⚙️ Rate Limiting

All cart endpoints have rate limiting:
- **30 requests per minute** per IP
- Prevents abuse and API overload
- Returns 429 status if exceeded

---

## 🎨 Customization

### Branded Shipping Emails

The Printful webhook handler sends beautifully designed tracking emails with your branding. Customize the template at:

`app/api/webhooks/printful/route.ts`

Current email includes:
- Of Blood branding and colors
- Tracking number (clickable)
- Carrier and service info
- Track package button
- Professional styling

### Product Display

Customize product cards at:
- `app/merch/page.tsx` - Product grid
- `app/merch/[handle]/page.tsx` - Product details
- `app/merch/[handle]/product-detail-client.tsx` - Variant selection

### Cart UI

Customize cart drawer at:
- `components/cart/cart-drawer.tsx`

---

## 🚀 Production Deployment

### Checklist

- [ ] All env vars set in production
- [ ] Domain configured and DNS active
- [ ] SSL certificate active
- [ ] Printful webhook URL updated to production domain
- [ ] Test complete checkout flow
- [ ] Verify email delivery
- [ ] Monitor first few orders

### Vercel Deployment

Environment variables are set in Vercel dashboard under:
**Project Settings → Environment Variables**

Make sure to set them for:
- Production
- Preview (optional)
- Development (optional)

---

## 📈 Analytics (Optional)

To track order events, you can:

1. **Enable Shopify webhook** for order logging
2. **Add database** to store order records
3. **Integrate analytics** (Google Analytics, Plausible, etc.)
4. **Monitor Printful dashboard** for fulfillment metrics

---

## 🆘 Troubleshooting

### Products Not Showing

**Check:**
1. Shopify credentials in `.env.local`
2. Products are "Active" in Shopify
3. Run `npm run check:integration`

### Orders Not Reaching Printful

**Check:**
1. Printful app is installed in Shopify
2. Products are synced from Printful
3. Order completed payment (not just created)
4. Check Printful dashboard for order

### Shipping Emails Not Sending

**Check:**
1. `PRINTFUL_WEBHOOK_SECRET` is configured
2. Webhook URL is correct in Printful dashboard
3. `RESEND_API_KEY` is valid
4. Check Resend dashboard for delivery logs

### Cart Issues

**Check:**
1. Browser console for errors
2. localStorage for cart ID
3. Network tab for API failures
4. Try clearing cart and creating new one

---

## 📞 Support Resources

- **Shopify Help:** https://help.shopify.com
- **Printful Help:** https://help.printful.com
- **Resend Docs:** https://resend.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 🔄 Future Enhancements

Consider adding:
- **Order tracking page** - Let customers check order status
- **Database integration** - Track all orders locally
- **Admin dashboard** - View sales and fulfillment metrics
- **Email preferences** - Let customers opt in/out of notifications
- **Abandoned cart recovery** - Send reminder emails
- **Product reviews** - Collect customer feedback

---

## 📝 Notes

- This setup is **production-ready** as configured
- No manual order processing needed
- Printful handles all fulfillment automatically
- Focus on marketing and customer experience
- System is robust and reliable

---

**Questions?** Contact ofbloodband@gmail.com

