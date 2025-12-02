# Vercel Deployment Guide - Of Blood

Complete guide for deploying your Of Blood site to Vercel with GitHub integration.

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] All environment variables ready (see `.env.example`)
- [x] Code tested locally (`npm run test:merch`)

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

Your code is ready to push! The changes include:
- Enhanced webhook handlers
- Comprehensive test suite
- Complete documentation
- Optimized cart operations

### Step 2: Connect Vercel to GitHub

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your **of-blood** repository
5. Vercel will auto-detect Next.js

### Step 3: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)  
**Root Directory:** `./` (leave default)  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `.next` (auto-detected)  
**Install Command:** `npm install` (auto-detected)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

#### Required Variables

```bash
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=if8vpt-fk.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=5117aa248ba23dece49001d4d1cd97ea

# Printful API
PRINTFUL_API_KEY=lHKLNj1CCH6CvzZzFmMoww5k2Ca3O3ZHPhfTDkAN

# Email Service
RESEND_API_KEY=re_cNPaecEq_1frJo2KBGTVV55W3CJ2ePPii
```

#### Optional Variables

```bash
# Printful Webhook (for branded shipping emails)
PRINTFUL_WEBHOOK_SECRET=[get from Printful Dashboard]

# Shopify Webhook (for order logging)
SHOPIFY_WEBHOOK_SECRET=[get from Shopify Admin]

# Admin Features
ADMIN_PASSWORD=Schecter7$
```

**Important:** For each variable, select the environment(s):
- ✅ **Production** (required)
- ✅ **Preview** (recommended)
- ⚪ **Development** (optional)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Vercel will provide your production URL: `https://of-blood.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Update Webhook URLs

Once deployed, update these webhook URLs to your production domain:

#### 1. Printful Webhook (Optional)

1. Go to **Printful Dashboard → Settings → Webhooks**
2. Update webhook URL to: `https://of-blood.vercel.app/api/webhooks/printful`
3. Ensure `package_shipped` event is selected
4. Copy the webhook secret
5. Add to Vercel environment variables as `PRINTFUL_WEBHOOK_SECRET`
6. Redeploy (Settings → Deployments → Redeploy)

#### 2. Shopify Webhook (Optional)

1. Go to **Shopify Admin → Settings → Notifications → Webhooks**
2. If you have a webhook configured, update URL to: `https://of-blood.vercel.app/api/webhooks/shopify`
3. Copy the webhook secret
4. Add to Vercel environment variables as `SHOPIFY_WEBHOOK_SECRET`
5. Redeploy

---

## ✅ Verify Deployment

### 1. Test Product Loading

Visit: `https://of-blood.vercel.app/merch`

**Expected:** All 16 products display correctly

### 2. Test Cart Operations

1. Add a product to cart
2. Open cart drawer
3. Update quantity
4. Remove item

**Expected:** All operations work smoothly

### 3. Test Checkout

1. Add product to cart
2. Click checkout
3. Should redirect to Shopify checkout

**Expected:** Valid Shopify checkout URL

### 4. Check Logs

In Vercel Dashboard:
1. Go to your project
2. Click **"Logs"** tab
3. Look for any errors

### 5. Run Integration Test

From your local machine (pointing to production):

```bash
# Test production endpoints
curl https://of-blood.vercel.app/api/cart -X POST

# Should return a cart object
```

---

## 🔄 Continuous Deployment

Once connected, Vercel will automatically:

- **Deploy on Push:** Every push to `main` branch triggers production deploy
- **Preview Deployments:** Pull requests get preview URLs
- **Instant Rollback:** Rollback to any previous deployment instantly

### Deploy New Changes

```bash
# Make changes locally
git add .
git commit -m "Your change description"
git push origin main

# Vercel automatically deploys!
```

---

## 🌍 Custom Domain (Optional)

### Add Your Custom Domain

1. Go to **Project Settings → Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `of-blood.com`)
4. Follow DNS configuration instructions
5. Vercel provides SSL certificate automatically

### DNS Configuration

Add these records to your domain provider:

**For apex domain (of-blood.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 Monitor Performance

### Vercel Analytics

1. Go to **Analytics** tab in project
2. View:
   - Page views
   - Performance metrics
   - Top pages
   - Visitor data

### Check Build Logs

1. Go to **Deployments** tab
2. Click on any deployment
3. View build logs for debugging

---

## 🆘 Troubleshooting

### Build Fails

**Check:**
- All dependencies in `package.json`
- No TypeScript errors
- Environment variables set correctly

**Solution:**
```bash
# Test build locally
npm run build

# If it fails locally, fix issues
# If it succeeds locally, check Vercel logs
```

### Environment Variables Not Working

**Check:**
- Variables are set for correct environment (Production/Preview)
- No typos in variable names
- Redeploy after adding variables

**Solution:**
1. Go to Settings → Environment Variables
2. Verify all required variables exist
3. Click **Redeploy** button

### Webhooks Not Receiving Events

**Check:**
- Webhook URLs updated to production domain
- Webhook secrets configured in Vercel
- Check Vercel function logs

**Solution:**
1. Verify webhook URL in Printful/Shopify dashboard
2. Check webhook delivery logs in Printful/Shopify
3. View Vercel function logs for errors

### Products Not Loading

**Check:**
- `NEXT_PUBLIC_*` variables are set
- Shopify credentials are correct
- API tokens haven't expired

**Solution:**
```bash
# Test Shopify connection
curl https://of-blood.vercel.app/api/cart -X POST

# Should return cart object, not error
```

---

## 🔐 Security Best Practices

### Environment Variables

- ✅ **Never commit** `.env.local` to git
- ✅ **Use Vercel's** environment variable system
- ✅ **Rotate secrets** periodically
- ✅ **Use different values** for preview/production if needed

### Webhook Security

- ✅ **Always verify** webhook signatures
- ✅ **Use HTTPS only** (Vercel provides this)
- ✅ **Keep secrets** in environment variables
- ✅ **Monitor** webhook logs for suspicious activity

---

## 📈 Performance Optimization

Vercel automatically provides:

- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Edge Caching** - Static assets cached at edge
- ✅ **Image Optimization** - Automatic image optimization
- ✅ **Compression** - Automatic gzip/brotli compression
- ✅ **HTTP/2** - Faster protocol
- ✅ **Smart Caching** - Intelligent cache invalidation

---

## 🔄 Rollback Procedure

If something goes wrong:

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **"..."** menu
4. Click **"Promote to Production"**
5. Previous version is instantly live!

---

## 📞 Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Your Test Suite:** `npm run test:merch`

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables added to Vercel
- [ ] Production deployment successful
- [ ] Products loading on `/merch`
- [ ] Cart operations working
- [ ] Checkout redirecting properly
- [ ] Webhook URLs updated (if using)
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active (automatic)
- [ ] Test complete order flow
- [ ] Monitor first few orders closely

---

## 🎉 You're Live!

Once deployed, your merch store will:
- ✅ Automatically handle all orders
- ✅ Sync with Printful for fulfillment
- ✅ Process payments securely via Shopify
- ✅ Scale automatically with traffic
- ✅ Deploy new changes instantly

**Rock on!** 🤘

---

**Questions?** Check [Vercel Documentation](https://vercel.com/docs) or run `npm run test:merch` to verify your setup.

