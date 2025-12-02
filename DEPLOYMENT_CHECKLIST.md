# ✅ Deployment Checklist - Of Blood

Quick reference checklist for deploying to production.

---

## 🔧 Before Deployment

### GitHub
- [x] Code pushed to GitHub
- [x] `.gitignore` excludes sensitive files
- [x] All changes committed

### Credentials Ready
- [ ] Shopify store domain
- [ ] Shopify Storefront API token
- [ ] Resend API key
- [ ] Admin password (strong, 12+ chars)
- [ ] Session secret (64 random chars)
- [ ] Domain name registered

### Content Preparation
- [ ] Products added to Shopify
- [ ] Music releases in `data/releases.json`
- [ ] Tour dates in `data/shows.json`
- [ ] Images uploaded to `/public/images`
- [ ] Audio files uploaded to `/public/audio`

---

## 🚀 Deployment Steps

### 1. Vercel Setup
- [ ] Sign up at vercel.com with GitHub
- [ ] Import `dylantneal/of-blood` repository
- [ ] Project imported successfully

### 2. Environment Variables
Add these in Vercel → Settings → Environment Variables:

**Required:**
- [ ] `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- [ ] `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_AUDIENCE_ID`
- [ ] `ADMIN_PASSWORD`
- [ ] `ADMIN_SESSION_SECRET`
- [ ] `CONTACT_EMAIL`
- [ ] `FROM_EMAIL_DOMAIN`
- [ ] `NEXT_PUBLIC_SITE_URL`

**Optional:**
- [ ] `PRINTFUL_API_KEY`
- [ ] `PRINTFUL_WEBHOOK_SECRET`
- [ ] `SHOPIFY_WEBHOOK_SECRET`

### 3. Deploy
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (2-3 min)
- [ ] Site live at `*.vercel.app`

---

## 🌐 Domain Configuration

### DNS Records
- [ ] Add A record: `@` → `76.76.21.21`
- [ ] Add CNAME: `www` → `cname.vercel-dns.com`
- [ ] Wait for propagation (5-60 min)
- [ ] Custom domain connected in Vercel

### Resend Domain Verification
- [ ] Domain added in Resend dashboard
- [ ] MX records added to DNS
- [ ] TXT records added (SPF, DKIM, DMARC)
- [ ] Domain verified (green checkmark)

---

## 🧪 Testing

### Core Features
- [ ] Homepage loads correctly
- [ ] Music player works
- [ ] Product images display
- [ ] Add to cart → redirects to Shopify
- [ ] Contact form sends email
- [ ] Newsletter signup works
- [ ] Admin panel login works (`/admin/tour`)

### Performance Checks
- [ ] PageSpeed score 90+ (mobile & desktop)
- [ ] All images optimized
- [ ] No console errors
- [ ] API routes respond correctly

### Cross-Browser Testing
- [ ] Chrome ✅
- [ ] Safari ✅
- [ ] Firefox ✅
- [ ] Mobile Safari ✅
- [ ] Mobile Chrome ✅

---

## 🔒 Security Verification

- [ ] Admin password is strong
- [ ] Session secret is random and long
- [ ] No environment vars in code
- [ ] Rate limiting works (test contact form)
- [ ] XSS protection active
- [ ] HTTPS enabled (automatic with Vercel)

---

## 📊 Post-Launch

### Search Engine Optimization
- [ ] Submit to Google Search Console
- [ ] Submit sitemap (`/sitemap.xml`)
- [ ] Verify structured data at schema.org validator
- [ ] Check Open Graph preview on social media

### Analytics & Monitoring
- [ ] Review Vercel Analytics
- [ ] Check Function logs for errors
- [ ] Set up error notifications
- [ ] Monitor Shopify orders

### Social Media
- [ ] Update Instagram bio with URL
- [ ] Update Facebook page
- [ ] Update Bandcamp profile
- [ ] Update YouTube about section
- [ ] Update Spotify artist profile

---

## 🎯 First Week Checklist

- [ ] Test checkout flow with test card
- [ ] Verify emails are delivered (not spam)
- [ ] Check mobile experience thoroughly
- [ ] Share with bandmates for feedback
- [ ] Announce to fans on social media
- [ ] Monitor for any user-reported issues

---

## 🆘 Common Issues & Quick Fixes

**Build fails:**
→ Check environment variables are set

**Cart broken:**
→ Verify Shopify API credentials and permissions

**Email not sending:**
→ Check Resend domain verification status

**Images not loading:**
→ Verify image domains in `next.config.mjs`

**Site is slow:**
→ Check Vercel Analytics for slow functions

---

## 📝 Maintenance Tasks

### Weekly
- [ ] Check Vercel function logs for errors
- [ ] Review Shopify order fulfillment
- [ ] Monitor site performance

### Monthly
- [ ] Update npm packages (`npm update`)
- [ ] Review and respond to contact form emails
- [ ] Check SEO rankings
- [ ] Backup important data

### As Needed
- [ ] Add new releases
- [ ] Update tour dates
- [ ] Add new products to Shopify
- [ ] Update band photos

---

## 🎉 Launch Ready?

When all checkboxes above are ✅, you're ready to announce:

**"🤘 New website live at of-blood.com 🤘"**

Share on:
- Instagram Stories
- Facebook
- Twitter/X
- Discord/Patreon
- Email newsletter

---

**Need the detailed guide?** See `DEPLOYMENT_GUIDE.md`

**Last Updated:** December 2, 2025

