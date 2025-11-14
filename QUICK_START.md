# Quick Start: Get Products on Your Site in 5 Steps

If you just want to get products showing on your website quickly, follow these steps:

## Step 1: Create Shopify Account (5 minutes)

1. Go to [shopify.com](https://www.shopify.com) and sign up
2. Complete the basic setup
3. Note your store URL: `your-store.myshopify.com`

## Step 2: Get API Credentials (3 minutes)

1. In Shopify: **Settings** → **Apps and sales channels** → **Develop apps**
2. Click **Create an app** → Name it "Website"
3. Go to **Configuration** → **Storefront API** → Enable scopes → **Save**
4. Go to **API credentials** → **Reveal token** → Copy it

## Step 3: Create Printful Account (2 minutes)

1. Go to [printful.com](https://www.printful.com) and sign up
2. In Printful: **Stores** → **Add store** → **Shopify**
3. Authorize the connection

## Step 4: Create a Test Product (10 minutes)

1. In Printful: **Stores** → Your store → **Add product**
2. Choose a product (e.g., T-shirt)
3. Upload a design image
4. Select sizes/colors
5. Set price and details
6. Click **Submit to store**

## Step 5: Update Your Website (2 minutes)

1. Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_your_token_here
PRINTFUL_API_KEY=your_printful_key_here
```

2. Restart your dev server: `npm run dev`
3. Visit `http://localhost:3000/merch`
4. Your products should appear! 🎉

---

**That's it!** Your products are now on your website. 

For detailed instructions, see `SHOPIFY_PRINTFUL_SETUP_GUIDE.md`

