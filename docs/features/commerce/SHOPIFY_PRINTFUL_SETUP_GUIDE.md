# Complete Shopify + Printful Setup Guide

This guide will walk you through setting up Shopify and Printful from scratch so you can sell print-on-demand products on your website.

## Part 1: Shopify Store Setup

### Step 1: Create a Shopify Account

1. Go to [shopify.com](https://www.shopify.com)
2. Click **"Start free trial"** or **"Get started"**
3. Enter your email address and create a password
4. Fill out the store setup form:
   - **Store name**: Choose a name (you can change this later)
   - **What do you plan to sell?**: Select "Clothing and accessories" or "Other"
   - **Are you setting this up for a client?**: Select "No"
5. Complete the account setup

### Step 2: Complete Store Setup

1. After creating your account, Shopify will ask some questions:
   - **What's your current revenue?**: Select "I'm just getting started"
   - **What industry are you in?**: Select "Music" or "Entertainment"
   - **What's your main goal?**: Select "Sell products online"
2. Skip any optional steps for now (you can complete them later)

### Step 3: Get Your Store Domain

1. In Shopify Admin, look at the top of the page
2. You'll see your store URL, something like: `your-store-name.myshopify.com`
3. **Write this down** - you'll need it for your `.env.local` file
4. This is your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`

### Step 4: Set Up Storefront API (For Your Website)

1. In Shopify Admin, go to **Settings** (bottom left)
2. Click **Apps and sales channels**
3. Click **Develop apps** (at the bottom)
4. Click **Create an app**
5. Name it: **"Of Blood Website"**
6. Click **Create app**

7. Now configure the API:
   - Click on your app name
   - Go to **Configuration** tab
   - Scroll down to **Storefront API**
   - Click **Configure**

8. Enable these scopes (permissions):
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_write_customers` (optional, for future use)

9. Click **Save**

10. Get your API credentials:
    - Go to **API credentials** tab
    - Under **Storefront API access token**, click **Install app** (if needed)
    - Click **Reveal token once**
    - **Copy the token** - it starts with `shpat_...`
    - **IMPORTANT**: Save this token! You won't be able to see it again.

11. You now have:
    - Store domain: `your-store-name.myshopify.com`
    - Access token: `shpat_xxxxxxxxxxxxx`

---

## Part 2: Printful Account Setup

### Step 1: Create Printful Account

1. Go to [printful.com](https://www.printful.com)
2. Click **"Sign up"** (top right)
3. Choose **"Create account"** or sign up with Google/Apple
4. Complete the signup form

### Step 2: Connect Printful to Shopify

1. In Printful Dashboard, go to **Stores** (left sidebar)
2. Click **"Add store"** or **"Connect store"**
3. Select **Shopify**
4. Click **"Connect Shopify store"**
5. You'll be redirected to Shopify to authorize the connection
6. Click **"Install app"** in Shopify
7. Authorize Printful to access your store
8. You'll be redirected back to Printful
9. Your Shopify store should now appear in Printful's store list

### Step 3: Get Printful API Key

1. In Printful Dashboard, go to **Settings** (gear icon, top right)
2. Click **API**
3. You'll see your API key (starts with something like a long string)
4. Click **"Show"** or **"Reveal"** to see the full key
5. **Copy this key** - you'll need it for your `.env.local` file

---

## Part 3: Create Your First Product

### Step 1: Design Your Product in Printful

1. In Printful Dashboard, go to **Stores** → Select your Shopify store
2. Click **"Add product"** or **"Create product"**
3. You'll see a catalog of products. Choose a category:
   - **Apparel** → T-shirts, Hoodies, etc.
   - **Accessories** → Hats, Bags, etc.
   - **Home & Living** → Posters, etc.

4. For example, to create a T-shirt:
   - Click **"Apparel"**
   - Click **"T-Shirts"**
   - Browse and select a product (e.g., "Gildan 64000 Unisex Softstyle T-Shirt")
   - Click **"Add product"**

### Step 2: Customize Your Product

1. **Upload Your Design**:
   - Click **"Add file"** or drag and drop your design
   - Supported formats: PNG, JPG, PDF (with transparent background recommended)
   - Position and resize your design on the product mockup
   - You can add designs to front, back, sleeves, etc.

2. **Choose Variants** (Sizes/Colors):
   - Select which sizes you want to offer (S, M, L, XL, etc.)
   - Select which colors you want to offer
   - Each size/color combination is a "variant"

3. **Set Product Details**:
   - **Product title**: e.g., "Of Blood - Blood Sigil T-Shirt"
   - **Description**: Write a product description
   - **Tags**: Add tags like "metal", "band merch", etc.

4. **Set Pricing**:
   - Printful will show you the base cost
   - Set your **retail price** (what customers pay)
   - Your profit = Retail price - Base cost

5. **Preview**:
   - Review your product mockups
   - Make sure everything looks good

6. **Submit to Store**:
   - Click **"Submit to store"** or **"Add to store"**
   - Printful will create the product in your Shopify store
   - This may take a minute

### Step 3: Verify Product in Shopify

1. Go back to Shopify Admin
2. Go to **Products** (left sidebar)
3. You should see your new product from Printful
4. Click on it to view/edit:
   - You can add more images
   - Edit the description
   - Adjust pricing
   - Set product status to "Active"

---

## Part 4: Configure Your Website

### Step 1: Update .env.local File

1. In your project root, open or create `.env.local`
2. Add these lines with your actual values:

```bash
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_actual_token_here

# Printful API
PRINTFUL_API_KEY=your_printful_api_key_here

# Resend API (for emails - get from resend.com if you haven't already)
RESEND_API_KEY=re_your_resend_key

# Other settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: 
- Replace `your-store-name.myshopify.com` with your actual Shopify store domain
- Replace `shpat_your_actual_token_here` with your actual Storefront API token
- Replace `your_printful_api_key_here` with your actual Printful API key
- No quotes around the values
- No spaces around the `=` sign

### Step 2: Restart Your Dev Server

1. Stop your current dev server (Ctrl+C or Cmd+C)
2. Run `npm run dev` again
3. The environment variables will now be loaded

### Step 3: Test Your Setup

1. Go to `http://localhost:3000/merch`
2. You should see your products from Shopify!
3. If you see products, the integration is working!

---

## Part 5: Product Variant Mapping (Important!)

When a customer orders a product, the system needs to know which Printful variant to use. Here's how to set this up:

### Option A: Using Shopify Metafields (Recommended)

1. In Shopify Admin, go to **Products**
2. Click on a product that came from Printful
3. Scroll down to find **"Metafields"** section
4. For each variant, add a metafield:
   - **Namespace and key**: `printful.variant_id`
   - **Value**: The Printful variant ID (see below for how to find this)

### Option B: Find Printful Variant IDs

1. In Printful Dashboard, go to **Catalog**
2. Browse to find the product you're using
3. Click on it to see variant details
4. Each variant has an ID (like `4011`, `4012`, etc.)
5. Note these IDs for your Shopify variants

**For now, you can skip this step** - the webhook handler will need to be updated to handle the mapping. The products will still show on your site, but orders won't auto-sync until mapping is configured.

---

## Part 6: Testing the Full Flow

### Test Product Display

1. Visit `/merch` on your website
2. Products from Shopify should appear
3. Click on a product to see details
4. Try adding to cart

### Test Checkout (When Ready)

1. Add a product to cart
2. Go to checkout
3. Fill in shipping information
4. Complete payment (Shopify handles this securely)
5. Order should sync to Printful automatically

---

## Troubleshooting

### Products Not Showing

- ✅ Check `.env.local` file exists and has correct values
- ✅ Restart dev server after changing `.env.local`
- ✅ Verify Shopify Storefront API token is correct
- ✅ Check that products are "Active" in Shopify
- ✅ Check browser console for errors

### Can't Connect Printful to Shopify

- ✅ Make sure you're logged into the correct Shopify account
- ✅ Try disconnecting and reconnecting
- ✅ Check that Printful app is installed in Shopify

### Products Not Syncing to Printful

- ✅ Verify Printful API key is correct
- ✅ Check webhook is set up (see Part 7)
- ✅ Verify variant mapping is configured

---

## Part 7: Set Up Webhooks (For Automatic Order Fulfillment)

Once your site is live, you'll need to set up webhooks so orders automatically go to Printful.

### Shopify Webhook

1. In Shopify Admin, go to **Settings** → **Notifications**
2. Scroll to **Webhooks**
3. Click **Create webhook**
4. Configure:
   - **Event**: Order payment
   - **Format**: JSON
   - **URL**: `https://your-domain.com/api/webhooks/shopify`
5. Click **Save webhook**

### Printful Webhook

1. In Printful Dashboard, go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/printful`
3. Select event: **Package shipped**
4. Save

---

## Quick Reference

### Where to Find Things

**Shopify Store Domain**: 
- Look at the top of Shopify Admin
- Format: `your-store.myshopify.com`

**Shopify Storefront API Token**:
- Settings → Apps and sales channels → Develop apps
- Your app → API credentials tab

**Printful API Key**:
- Printful Dashboard → Settings → API

**Product Catalog**:
- Printful Dashboard → Catalog (to browse products)
- Printful Dashboard → Stores → Your Store → Add product (to create)

---

## Next Steps

1. ✅ Create Shopify account
2. ✅ Get Storefront API credentials
3. ✅ Create Printful account
4. ✅ Connect Printful to Shopify
5. ✅ Create your first product
6. ✅ Update `.env.local` file
7. ✅ Restart dev server
8. ✅ Test product display on website
9. ⏭️ Set up webhooks (when site is live)
10. ⏭️ Configure variant mapping (for order fulfillment)

---

## Need Help?

- **Shopify Help**: [help.shopify.com](https://help.shopify.com)
- **Printful Help**: [help.printful.com](https://help.printful.com)
- **Shopify Community**: [community.shopify.com](https://community.shopify.com)

Good luck! 🎸

