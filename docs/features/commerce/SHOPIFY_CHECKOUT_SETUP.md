# Shopify Store Setup - Enable Checkout

## Current Issue

Your cart system is working perfectly! However, when customers try to checkout, they see:

> "This store isn't set up to receive orders yet. Contact the store directly for help."

This is because your Shopify store needs additional configuration to process orders.

---

## ✅ Required Setup Steps

### 1. **Select a Shopify Plan**

1. Go to your Shopify Admin: https://if8vpt-fk.myshopify.com/admin
2. Look for a banner saying "Select a plan" or go to **Settings → Plan**
3. Choose a plan:
   - **Basic** ($39/month) - Good for starting out
   - **Shopify** ($105/month) - More features
   - **Advanced** ($399/month) - Advanced features
   
4. Most plans offer a **free trial** - you can start with that!

---

### 2. **Set Up Payment Processing**

**Go to: Settings → Payments**

**Option A: Shopify Payments (Recommended)**
- Click "Activate Shopify Payments"
- Fill in your business information
- Add bank account details for payouts
- Complete identity verification
- Save

**Option B: Third-Party Payment Provider**
- Choose PayPal, Stripe, or another provider
- Connect your account
- Configure settings
- Save

**Important:** You must have at least ONE payment method active.

---

### 3. **Configure Shipping**

**Go to: Settings → Shipping and delivery**

1. **Create a Shipping Profile:**
   - Click "Manage rates"
   - Set up shipping zones (e.g., United States, International)
   
2. **Add Shipping Rates:**
   - Flat rate (e.g., $5.00 for all orders)
   - Free shipping (set rate to $0)
   - Calculated rates (if using Shopify Payments)
   - Rate based on order value

Example setup:
```
United States:
- Standard Shipping: $5.00
- Free Shipping: $0 (for orders over $50)

Rest of World:
- International Shipping: $15.00
```

3. **Save**

---

### 4. **Add Store Information**

**Go to: Settings → Store details**

Fill in:
- ✅ Store name
- ✅ Store contact email
- ✅ Business address
- ✅ Store currency (USD)
- ✅ Time zone

---

### 5. **Add Legal Pages** (Optional but Recommended)

**Go to: Settings → Legal**

Shopify can auto-generate:
- Privacy Policy
- Terms of Service
- Shipping Policy
- Refund Policy

Click "Create from template" for each, then customize as needed.

---

### 6. **Test Mode (Optional)**

If you want to test without real payments:

**Go to: Settings → Payments → Test mode**
- Enable Shopify Payments test mode
- Use test card: `1` (Visa)
- Complete a test order
- Disable test mode when ready for real orders

---

## 🧪 Verify Setup

After completing the above:

1. **Go to your site:** http://localhost:3000/merch
2. **Add item to cart**
3. **Click Checkout**
4. **You should see:**
   - Shopify checkout page
   - Shipping options
   - Payment options
   - Ability to complete order

If you still see "not set up", check:
- [ ] At least one payment method is active
- [ ] Shipping rates are configured
- [ ] A plan is selected (or trial is active)

---

## 📋 Checklist

Before going live:

- [ ] Payment provider activated
- [ ] Shipping rates configured for all regions you ship to
- [ ] Store information complete
- [ ] Legal pages added
- [ ] Test order completed successfully
- [ ] Products have correct pricing
- [ ] Product variants have inventory/stock set
- [ ] Domain configured (if using custom domain)
- [ ] SSL enabled (automatic with Shopify)

---

## 🚀 Your Cart System Status

✅ **Frontend cart - WORKING**
- Add to cart ✅
- Cart drawer displays items ✅
- Quantity controls ✅
- Remove items ✅
- Total calculation ✅
- Checkout redirect ✅

✅ **Shopify Integration - WORKING**
- Products loading ✅
- Cart API working ✅
- Checkout URL generation ✅

⚠️ **Shopify Store - NEEDS SETUP**
- Payment provider ❌
- Shipping rates ❌
- Store plan ❌

---

## 📞 Need Help?

If you get stuck:
1. Shopify's setup wizard usually guides you through this
2. Contact Shopify support (they're very helpful!)
3. Check: Shopify Admin → Home (there's usually a setup checklist)

---

Once you complete these steps, your customers will be able to:
1. Add products to cart ✅ (working now!)
2. View cart ✅ (working now!)
3. Enter shipping info
4. Complete payment
5. Receive order confirmation

Your site code is 100% ready - you just need to finish the Shopify store configuration! 🎉

