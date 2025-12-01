# How to Find Your Shopify Storefront API Token

You're currently looking at the **Admin API** credentials (Client ID and Secret), but for your website, you need the **Storefront API** access token. Here's how to find it:

## Step-by-Step Instructions

### 1. You're in the Right Place
You're already in the app settings. Good!

### 2. Look for "API Credentials" Tab
- At the top of the page, you should see tabs like:
  - **Overview**
  - **Configuration** 
  - **API credentials** ← **Click this tab!**

### 3. Find "Storefront API" Section
- Scroll down in the API credentials tab
- Look for a section called **"Storefront API"** or **"Storefront API access token"**
- It should be separate from the "Admin API" section you're currently seeing

### 4. Install and Reveal Token
- If you see an **"Install app"** button, click it first
- Then click **"Reveal token once"** or **"Show token"**
- The token will start with `shpat_` followed by a long string
- **Copy this token immediately** - you won't be able to see it again!

### 5. If You Don't See Storefront API Section

This means the Storefront API hasn't been configured yet. Do this:

1. Go to the **Configuration** tab (at the top)
2. Scroll down to find **"Storefront API"** section
3. Click **"Configure"** button
4. Enable these scopes:
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_write_checkouts`
5. Click **Save**
6. Go back to **API credentials** tab
7. Now you should see the Storefront API section
8. Click **"Install app"** if needed
9. Click **"Reveal token once"** to see your token

## What You Need

You need TWO things from Shopify:

1. **Store Domain**: 
   - Look at the top of your Shopify admin page
   - It's something like: `your-store-name.myshopify.com`
   - This is your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`

2. **Storefront API Access Token**:
   - From the API credentials tab (as described above)
   - Starts with `shpat_...`
   - This is your `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

## Visual Guide

The page structure should look like this:

```
┌─────────────────────────────────────┐
│ [Overview] [Configuration] [API credentials] ← Click this
└─────────────────────────────────────┘

API credentials tab:
├── Admin API (what you're seeing now)
│   ├── Client ID
│   └── Secret
│
└── Storefront API (what you need!) ← Look for this
    └── Access token: shpat_xxxxxxxxxxxxx
```

## Quick Checklist

- [ ] Click "API credentials" tab
- [ ] Find "Storefront API" section
- [ ] If not there, go to Configuration tab and enable Storefront API
- [ ] Click "Install app" if needed
- [ ] Click "Reveal token once"
- [ ] Copy the token (starts with `shpat_`)
- [ ] Copy your store domain (from top of Shopify admin)
- [ ] Add both to `.env.local` file
- [ ] Restart dev server

## Still Can't Find It?

If you still don't see the Storefront API section:

1. Make sure you're in the correct app (the one you created for your website)
2. Check that you're in the **API credentials** tab, not Configuration
3. Try creating a new app if needed:
   - Settings → Apps and sales channels → Develop apps
   - Create a new app
   - Configure Storefront API in Configuration tab first
   - Then get token from API credentials tab

