# Of Blood Merch - Quick Start Guide

🎯 **TL;DR:** Your merch system is already working! Orders automatically flow from Shopify → Printful.

---

## ✅ Current Status

**Integration Type:** Printful Native (automatic)  
**Order Flow:** Customer → Shopify → Printful → Customer  
**Status:** ✅ OPERATIONAL

---

## 🚀 Quick Commands

```bash
# Check integration status
npm run check:integration

# Verify Printful connection
npm run verify:printful

# Start development server
npm run dev
```

---

## 📝 Essential Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=if8vpt-fk.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=5117aa248ba23dece49001d4d1cd97ea
PRINTFUL_API_KEY=lHKLNj1CCH6CvzZzFmMoww5k2Ca3O3ZHPhfTDkAN
RESEND_API_KEY=re_cNPaecEq_1frJo2KBGTVV55W3CJ2ePPii
```

---

## 🔄 How It Works

1. **Customer shops** → Your site shows products from Shopify
2. **Customer checks out** → Redirects to Shopify payment
3. **Customer pays** → Printful app receives order automatically
4. **Printful fulfills** → Prints, packs, ships
5. **Customer receives** → Product delivered with tracking

**No manual steps required!** 🎉

---

## 🛠️ Optional: Enhanced Shipping Emails

Want to send branded tracking emails?

1. Go to [Printful Dashboard](https://www.printful.com/dashboard/webhooks)
2. Add webhook: `https://your-domain.com/api/webhooks/printful`
3. Select event: `package_shipped`
4. Copy the secret and add to `.env.local`:
   ```bash
   PRINTFUL_WEBHOOK_SECRET=your_secret_here
   ```

---

## 🧪 Testing

### Quick Test
1. Visit `http://localhost:3000/merch`
2. Add product to cart
3. View cart drawer
4. Update quantities
5. Click checkout (redirects to Shopify)

### Full Test (Use Shopify Test Mode)
1. Complete checkout with test payment
2. Check order in Printful dashboard
3. Verify email notifications

---

## 🎨 Key Files

```
app/
├── merch/
│   ├── page.tsx                    # Product grid
│   └── [handle]/page.tsx           # Product details
├── api/
│   ├── cart/                       # Cart operations
│   └── webhooks/
│       ├── printful/route.ts       # Shipping notifications ⭐
│       └── shopify/route.ts        # Optional logging
components/
└── cart/cart-drawer.tsx            # Cart UI
lib/
├── shopify.ts                      # Shopify API
└── printful.ts                     # Printful API
```

---

## ⚠️ What You DON'T Need

- ❌ Shopify Admin API token (for basic operation)
- ❌ Shopify order webhook (Printful app handles this)
- ❌ Manual variant mapping (maintained by Printful)
- ❌ Custom sync logic (automatic)

---

## 🔍 Monitoring

### Check Orders
- **Shopify:** Admin → Orders
- **Printful:** Dashboard → Orders

### Check Logs
```bash
# Development
npm run dev
# Watch console for [Printful Webhook] and [API /api/cart/*] logs

# Production (Vercel)
vercel logs production
```

---

## 🚨 Common Issues

### Products not showing?
- Check Shopify credentials in `.env.local`
- Restart dev server after changing env vars

### Orders not reaching Printful?
- Verify Printful app is installed in Shopify
- Check order actually paid (not just created)

### Cart issues?
- Clear browser localStorage
- Check browser console for errors

---

## 📚 Full Documentation

See `docs/commerce/ACTUAL_SETUP.md` for:
- Complete architecture explanation
- Detailed setup instructions
- Troubleshooting guide
- API documentation
- Customization options

---

## ✨ Your Setup is Simple & Robust

- **16 products** synced from Printful
- **Automatic fulfillment** via Printful app
- **Secure payments** via Shopify
- **Beautiful storefront** via Next.js
- **Zero manual processing** required

🎸 **Focus on making music. We handle the merch.** 🤘

---

**Questions?** See full docs or contact ofbloodband@gmail.com

