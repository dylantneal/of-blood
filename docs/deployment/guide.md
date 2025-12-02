# 🚀 Deployment Guide - Of Blood Website

Your code is ready and pushed to GitHub! Follow this guide to deploy to production.

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [x] Code pushed to GitHub (https://github.com/dylantneal/of-blood)
- [ ] Shopify store setup with products
- [ ] Resend account created
- [ ] Domain name registered (e.g., of-blood.com)
- [ ] All environment variables ready

---

## 🎯 Recommended Hosting: Vercel

**Why Vercel?**
- Made by the Next.js team (perfect compatibility)
- Free tier is generous for band websites
- Zero configuration needed
- Automatic deployments from GitHub
- Global CDN for fast performance
- Easy custom domain setup

**Alternatives:** Netlify, Railway, AWS Amplify (more complex)

---

## 📋 Step-by-Step Deployment

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your **GitHub account** (easiest way)
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Project

1. Click **"Add New Project"** in Vercel dashboard
2. Select **"Import Git Repository"**
3. Choose `dylantneal/of-blood` from the list
4. Click **"Import"**

### Step 3: Configure Environment Variables

⚠️ **CRITICAL:** Add these environment variables in Vercel settings:

#### Required Variables:

```bash
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxx

# Resend (Email)
RESEND_API_KEY=re_xxxxx
RESEND_AUDIENCE_ID=your_audience_id

# Admin Panel
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_SECRET=your-random-64-char-string

# Contact Form
CONTACT_EMAIL=ofbloodband@gmail.com
FROM_EMAIL_DOMAIN=of-blood.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://of-blood.com
```

#### Optional Variables:
```bash
# Printful (if using)
PRINTFUL_API_KEY=your_key
PRINTFUL_WEBHOOK_SECRET=your_secret

# Shopify Webhooks
SHOPIFY_WEBHOOK_SECRET=your_secret
```

**To add in Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add each variable one by one
3. Apply to: **Production, Preview, and Development**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Vercel will give you a URL like: `of-blood.vercel.app`

🎉 **Your site is now live!**

---

## 🌐 Custom Domain Setup

### Connect Your Domain (e.g., of-blood.com)

1. In Vercel, go to: Project → Settings → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `of-blood.com`
4. Vercel will provide DNS instructions

### Update DNS Records

**If your domain is with:**
- **GoDaddy / Namecheap / Name.com:**
  1. Log in to your domain registrar
  2. Go to DNS settings
  3. Add these records:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21 (Vercel IP)
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

- **Cloudflare:**
  1. Add same records as above
  2. Set proxy status to "DNS Only" (gray cloud)

**DNS propagation takes 5-60 minutes**

---

## 📧 Email Configuration (Resend)

### Verify Your Domain for Sending Emails

1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter: `of-blood.com`
4. Add the DNS records Resend provides:
   - **MX records** (for receiving bounces)
   - **TXT records** (for SPF, DKIM, DMARC)

5. Wait for verification (usually 5-15 minutes)

### Create Audience for Newsletter

1. Go to [resend.com/audiences](https://resend.com/audiences)
2. Click **"Create Audience"**
3. Copy the Audience ID
4. Add to Vercel: `RESEND_AUDIENCE_ID=your_id`

---

## 🛍️ Shopify Configuration

### Get Storefront API Credentials

1. Log in to **Shopify Admin**
2. Go to: **Settings → Apps and sales channels → Develop apps**
3. Click **"Create an app"** (if you haven't already)
4. Name it: "Of Blood Website"
5. Click **"Configure Storefront API"**

### Set Permissions

Enable these scopes:
- ✅ `unauthenticated_read_product_listings`
- ✅ `unauthenticated_read_product_inventory`
- ✅ `unauthenticated_write_checkouts`
- ✅ `unauthenticated_read_checkouts`

### Get Your Token

1. Click **"Install app"**
2. Go to **API credentials** tab
3. Find **"Storefront API access token"**
4. Click **"Reveal token once"** and copy it
5. It should start with `shpat_`

### Add to Vercel

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
```

---

## 🔒 Security Checklist

- [ ] Admin password is strong (12+ characters)
- [ ] Session secret is random (generate with `openssl rand -base64 32`)
- [ ] Environment variables are NOT in your code (only in Vercel)
- [ ] `.env.local` is in `.gitignore` (already done ✅)
- [ ] Rate limiting is enabled (already implemented ✅)
- [ ] XSS protection is enabled (already implemented ✅)

---

## 🧪 Testing Your Deployment

### Test These Features:

1. **Homepage** - Should load fast with animations
2. **Music Page** - Click play on a track
3. **Merch Store** - Add item to cart → goes to Shopify checkout
4. **Contact Form** - Submit → should receive email
5. **Newsletter** - Subscribe → added to Resend audience
6. **Admin Panel** - Visit `/admin/tour` → login works

### Check Performance

Use these tools:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

**Target scores:**
- Performance: 90+
- SEO: 95+
- Accessibility: 90+

---

## 🔄 Automatic Deployments

**Now configured!** Every time you push to GitHub:
1. Vercel detects the change
2. Automatically builds and deploys
3. Updates your live site in 2-3 minutes

```bash
# Local workflow:
git add .
git commit -m "Update tour dates"
git push origin main
# → Auto-deploys to production!
```

---

## 📊 Post-Deployment Tasks

### 1. Submit to Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property: `of-blood.com`
3. Verify ownership (use DNS method)
4. Submit sitemap: `https://of-blood.com/sitemap.xml`

### 2. Add to Social Media Profiles

Update these with your new URL:
- Instagram bio
- Facebook page
- Bandcamp profile
- YouTube channel about section

### 3. Test Checkout Flow

1. Add test product to cart
2. Go through checkout on Shopify
3. Use Shopify's test credit card: `4242 4242 4242 4242`
4. Verify order appears in Shopify admin

### 4. Monitor Errors

In Vercel dashboard:
- Check **"Functions"** tab for API errors
- Review **"Analytics"** for traffic
- Set up error alerts (Settings → Integrations)

---

## 🆘 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all required vars in Vercel settings

**Error: Module not found**
- Solution: Ensure `package.json` is committed to GitHub

### Site Loads But Features Broken

**Cart doesn't work**
- Check Shopify credentials are correct
- Verify Storefront API permissions are enabled
- Check browser console for errors

**Contact form fails**
- Verify Resend API key is correct
- Check domain is verified in Resend
- Look at Vercel function logs

**Images don't load**
- Check `next.config.mjs` has correct image domains
- Verify Shopify CDN is accessible

### Email Issues

**Emails not sending**
- Verify Resend API key starts with `re_`
- Check domain verification status in Resend
- Ensure `FROM_EMAIL_DOMAIN` matches verified domain

**Emails go to spam**
- Complete DNS setup (SPF, DKIM, DMARC)
- Wait 24-48 hours for reputation to build
- Ask Resend support about deliverability

---

## 📝 Updating Content

### Add New Releases

Edit `data/releases.json`:
```json
{
  "id": "2",
  "title": "Your New Release",
  "type": "EP",
  "date": "2025-01-15",
  "cover": "/images/releases/new-cover.png",
  "links": {
    "spotify": "https://...",
    "bandcamp": "https://..."
  },
  "tracks": [...]
}
```

Commit and push → auto-deploys!

### Add Tour Dates

**Option 1:** Use Admin Panel
- Visit: `https://of-blood.com/admin/tour`
- Login with your admin password
- Add/edit/delete shows

**Option 2:** Edit JSON
- Edit `data/shows.json`
- Commit and push

### Add Products

Add products in **Shopify Admin** → they'll appear automatically on your merch page (updates every 60 seconds via ISR).

---

## 🎉 You're Live!

Your website is now deployed and ready to rock! 🤘

**Next Steps:**
1. Share the URL with your fans
2. Monitor analytics in Vercel
3. Test the contact form and cart
4. Start promoting tour dates and merch

**Need help?** Check the docs in `/docs` or review Vercel's support resources.

---

## 📞 Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Shopify API:** [shopify.dev/docs](https://shopify.dev/docs)
- **Resend Docs:** [resend.com/docs](https://resend.com/docs)

---

**Last Updated:** December 2, 2025

