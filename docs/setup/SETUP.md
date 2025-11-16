# Of Blood - Setup Guide

This guide will help you get the **Of Blood** website up and running.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` and add your credentials.

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site!

---

## Detailed Setup

### Shopify Integration

1. **Create a Shopify Store** (if you don't have one):
   - Visit [shopify.com](https://www.shopify.com)
   - Sign up for a plan (can start with trial)

2. **Create a Custom App**:
   - Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
   - Click **Develop apps** → **Create an app**
   - Name it "Of Blood Website"

3. **Configure Storefront API**:
   - In your app, go to **Configuration** → **Storefront API**
   - Enable the following scopes:
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_write_checkouts`
   - Click **Save**

4. **Get Your Credentials**:
   - Go to **API credentials** tab
   - Copy your **Storefront API access token**
   - Your store domain is `your-store.myshopify.com`

5. **Add to `.env.local`**:
   ```
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   ```

### Email Setup (Resend)

1. **Sign up at [resend.com](https://resend.com)**

2. **Get API Key**:
   - Go to **API Keys** in your dashboard
   - Create a new API key
   - Copy the key

3. **Verify Your Domain** (for production):
   - Go to **Domains** → **Add Domain**
   - Follow DNS setup instructions
   - For development, you can use `onboarding@resend.dev` (limited to your email only)

4. **Add to `.env.local`**:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

5. **Update Email Addresses**:
   - Edit `app/api/contact/route.ts`
   - Replace `booking@ofblood.band` with your actual email

### Newsletter Setup

Choose **one** of these providers:

#### Option A: Mailchimp

1. Sign up at [mailchimp.com](https://mailchimp.com)
2. Create an audience
3. Get your API key: **Account** → **Extras** → **API keys**
4. Get your Audience ID: **Audience** → **Settings** → **Audience name and defaults**
5. Add to `.env.local`:
   ```
   MAILCHIMP_API_KEY=your_key
   MAILCHIMP_SERVER_PREFIX=us1
   MAILCHIMP_AUDIENCE_ID=your_id
   ```
6. Uncomment Mailchimp code in `app/api/newsletter/route.ts`

#### Option B: ConvertKit

1. Sign up at [convertkit.com](https://convertkit.com)
2. Create a form
3. Get your API key: **Settings** → **Advanced** → **API Secret**
4. Get your Form ID from the form URL
5. Add to `.env.local`:
   ```
   CONVERTKIT_API_KEY=your_key
   CONVERTKIT_FORM_ID=your_form_id
   ```
6. Uncomment ConvertKit code in `app/api/newsletter/route.ts`

### Admin Access

Add the credentials that protect the `/admin/tour` tools:

```
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=$(openssl rand -base64 32)
```

Use a different random string for production and keep it private—this secret signs the encrypted admin cookie.

---

## Customization

### Replace Placeholder Content

1. **Images**: Add your band photos, logos, and social assets to `/public/images/photos/`, `/public/images/logos/`, or `/public/images/instagram/` (whichever fits best)
2. **Data**: Update `/data/shows.json` and `/data/releases.json`
3. **About Page**: Edit `/app/about/page.tsx` with your band's story
4. **Social Links**: Update links in `/components/layout/footer.tsx`

### Update Colors/Theme

Edit `/app/globals.css` to change the color scheme:

```css
:root {
  --bg: #0A0A0A;        /* Background */
  --fg: #F2F2F2;        /* Text */
  --primary: #B30A0A;   /* Blood red */
  --gold: #C9A227;      /* Gold accent */
}
```

### Change Fonts

1. Edit `/app/layout.tsx`
2. Replace font imports from Google Fonts
3. Update `--font-body` and `--font-display` variables

---

## Deployment to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click **Import Project**
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**:
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add all variables from your `.env.local`
   - Make sure to add them for **Production**, **Preview**, and **Development**

4. **Deploy**:
   - Click **Deploy**
   - Your site will be live at `your-project.vercel.app`

5. **Add Custom Domain** (optional):
   - Go to **Settings** → **Domains**
   - Add your custom domain (e.g., `ofblood.band`)
   - Update DNS records as instructed

---

## Production Checklist

Before going live, make sure to:

- [ ] Replace all placeholder images
- [ ] Update all placeholder links (social media, streaming, tickets)
- [ ] Update contact email addresses
- [ ] Set up domain and SSL certificate
- [ ] Test all forms (contact, newsletter)
- [ ] Test Shopify checkout flow
- [ ] Add actual tour dates
- [ ] Add real product data from Shopify
- [ ] Set up analytics (Plausible, Google Analytics, etc.)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit for performance
- [ ] Update SEO metadata with real keywords
- [ ] Create and upload favicon/app icons
- [ ] Test all external links
- [ ] Set up email auto-responders
- [ ] Configure CORS/CSP headers if needed

---

## Troubleshooting

### Shopify products not showing
- Check your Storefront API token is correct
- Verify product availability in Shopify admin
- Check browser console for API errors

### Contact form not sending
- Verify Resend API key
- Check email addresses are valid
- Look for errors in Vercel function logs

### Newsletter signup fails
- Ensure you've uncommented integration code
- Verify API credentials
- Check provider's dashboard for errors

### Build fails on Vercel
- Check all environment variables are set
- Verify no TypeScript errors locally
- Review Vercel build logs

---

## Getting Help

- Check the main [README.md](./README.md)
- Review Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Shopify Storefront API: [shopify.dev/docs/api/storefront](https://shopify.dev/docs/api/storefront)
- Resend docs: [resend.com/docs](https://resend.com/docs)

---

**You're all set! Now go forth and summon the tendrils of descending divinity. 🩸⚡**

