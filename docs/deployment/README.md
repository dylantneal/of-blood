# 🚀 Deployment Documentation

## 🤖 Automated CI/CD Pipeline (Recommended)

**Setup Time**: 10 minutes | **Maintenance**: ~15 min/week

This project includes a comprehensive automated CI/CD pipeline for secure, reliable deployments:

### Features
- ✅ Automated testing and linting on every push
- 🔒 Security scanning (dependencies, secrets, CodeQL)
- 📦 Automated builds with Next.js
- 🚀 Preview deployments for every PR
- 🌐 Production deployments on merge to main
- 🔄 Automated dependency updates (Dependabot)
- 🎯 Lighthouse performance audits
- 🔙 Easy rollback capabilities

### Quick Links
- **[CI/CD Quick Start](./cicd-quick-start.md)** - Get set up in 10 minutes
- **[Full CI/CD Documentation](./cicd-pipeline.md)** - Complete guide with architecture and troubleshooting

---

## 📖 Manual Deployment Guide

Prefer manual deployment? Follow this 15-minute guide:

# 🚀 Quick Start - Deploy in 15 Minutes

Your code is ready on GitHub. Follow these steps to get live ASAP.

---

## ⏱️ 15-Minute Deployment

### ✅ Step 1: Gather Your Credentials (5 min)

You need these **before** starting:

1. **Shopify Storefront API**
   - Store domain: `your-store.myshopify.com`
   - Access token: `shpat_xxxxx...`
   - [How to get →](https://shopify.dev/docs/api/usage/authentication#getting-started-with-authenticated-access)

2. **Resend Account**
   - Sign up at [resend.com](https://resend.com) (free tier)
   - Get API key from dashboard
   - Create an audience, copy the ID

3. **Admin Password**
   - Pick a strong password (12+ characters)
   - Generate session secret: 
     ```bash
     openssl rand -base64 32
     ```

---

### 🚀 Step 2: Deploy to Vercel (5 min)

1. **Go to [vercel.com](https://vercel.com/new)**
   - Sign in with GitHub

2. **Import Your Repository**
   - Select: `dylantneal/of-blood`
   - Click "Import"

3. **Add Environment Variables** (click "Add" for each):
   ```
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN = your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN = shpat_xxxxx
   RESEND_API_KEY = re_xxxxx
   RESEND_AUDIENCE_ID = xxxxx
   ADMIN_PASSWORD = your-strong-password
   ADMIN_SESSION_SECRET = your-64-char-random-string
   CONTACT_EMAIL = ofbloodband@gmail.com
   FROM_EMAIL_DOMAIN = of-blood.com
   NEXT_PUBLIC_SITE_URL = https://of-blood.vercel.app
   ```

4. **Click "Deploy"**
   - Wait 2-3 minutes
   - You'll get a URL like: `of-blood.vercel.app`

🎉 **Your site is live!**

---

### 🧪 Step 3: Test Everything (5 min)

Visit your new site and test:

- [ ] Homepage loads ✅
- [ ] Click "Music" → Play a track ✅
- [ ] Click "Merch" → Products display ✅
- [ ] Add to cart → Redirects to Shopify ✅
- [ ] Contact form → Sends email ✅
- [ ] Newsletter signup ✅

**If something doesn't work:** Check Vercel function logs for errors.

---

## 🌐 Optional: Custom Domain (10 min)

### Connect Your Domain

1. **In Vercel:** Settings → Domains → Add `of-blood.com`

2. **Update DNS** at your registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait 10-60 minutes** for DNS propagation

4. **Verify Domain in Resend:**
   - Add domain at resend.com/domains
   - Copy DNS records (MX, TXT)
   - Add to your domain registrar
   - Wait for verification ✅

---

## 📋 What You Just Did

✅ Deployed a production-ready Next.js app  
✅ Connected to Shopify for e-commerce  
✅ Set up email with Resend  
✅ Enabled automatic deployments from GitHub  
✅ Got a live URL for your band website  

---

## 🎯 Next Steps

**Immediate:**
1. Share the URL with your bandmates
2. Test the checkout flow
3. Verify emails aren't going to spam

**This Week:**
1. Add your domain (if you haven't)
2. Submit to Google Search Console
3. Update social media profiles with new URL
4. Announce to fans

**Ongoing:**
1. Add new releases to `data/releases.json`
2. Update tour dates via admin panel (`/admin/tour`)
3. Add products in Shopify (auto-appear on site)

---

## 🆘 Quick Troubleshooting

**Site deployed but features broken?**
→ Check environment variables are set correctly in Vercel

**Build failed?**
→ Check Vercel build logs for specific error

**Cart not working?**
→ Verify Shopify API permissions are enabled

**Contact form not sending?**
→ Check Resend API key and domain verification

---

## 📖 Full Documentation

- **Detailed Guide:** `DEPLOYMENT_GUIDE.md`
- **Complete Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **GitHub Repo:** `https://github.com/dylantneal/of-blood`

---

**Questions?** Check the docs or Vercel support.

**Ready to rock? 🤘** Your website is live and ready for fans!

---

**Last Updated:** December 2, 2025

