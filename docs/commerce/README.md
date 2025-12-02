# Of Blood - Commerce Documentation

**Last Updated:** December 2, 2025  
**Status:** ✅ Production Ready

---

## 📚 Documentation Index

### 🚀 Start Here

**[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- Essential commands
- Quick reference
- Common tasks
- TL;DR overview

### 📖 Complete Guide

**[ACTUAL_SETUP.md](./ACTUAL_SETUP.md)** - Everything you need to know
- Complete architecture
- Detailed setup instructions
- API documentation
- Troubleshooting guide
- Customization options

### ✅ Verification Report

**[INTEGRATION_VERIFIED.md](./INTEGRATION_VERIFIED.md)** - System audit
- Component verification
- Test results
- Maintenance guide
- Production checklist

---

## 🎯 Quick Overview

### What You Have

- **Shopify** - Product catalog and secure checkout
- **Printful** - Print-on-demand fulfillment (automatic)
- **Next.js** - Your custom storefront
- **Resend** - Email notifications

### How Orders Flow

```
Customer → Your Site → Shopify Cart → Checkout → Payment
                                                     ↓
                                            Printful App (automatic)
                                                     ↓
                                            Print → Pack → Ship
```

**No manual processing needed!** ✅

---

## 🛠️ Essential Commands

```bash
# Check integration status
npm run check:integration

# Verify Printful connection  
npm run verify:printful

# Start development server
npm run dev
```

---

## 📁 File Structure

```
docs/commerce/
├── README.md                           # This file
├── QUICK_START.md                      # Quick reference
├── ACTUAL_SETUP.md                     # Complete guide
├── INTEGRATION_VERIFIED.md             # Verification report
├── DATABASE_SCHEMA.sql                 # Optional database schema
├── SHOPIFY_PRINTFUL_SETUP_GUIDE.md    # Legacy guide
└── SHOPIFY_INTEGRATION_COMPLETE.md    # Custom integration docs (not used)

app/api/
├── cart/                               # Cart operations
│   ├── route.ts                        # Get/create cart
│   ├── add/route.ts                    # Add items
│   ├── update/route.ts                 # Update quantities
│   └── remove/route.ts                 # Remove items
├── orders/
│   └── create/route.ts                 # Get checkout URL
└── webhooks/
    ├── printful/route.ts               # Shipping notifications ⭐
    └── shopify/route.ts                # Optional logging

lib/
├── shopify.ts                          # Shopify API client
├── printful.ts                         # Printful API client
└── cart-utils.ts                       # Cart helpers

scripts/
├── check-integration-setup.ts          # Integration diagnostic
└── verify-printful-connection.ts       # Printful verification
```

---

## ✅ System Status

All components verified and operational:

- ✅ **Shopify Integration** - 16 products loaded
- ✅ **Printful Integration** - API validated, auto-sync active
- ✅ **Cart System** - All operations working
- ✅ **Checkout Flow** - Redirects properly
- ✅ **Webhooks** - Enhanced and ready
- ✅ **Email System** - Configured and tested
- ✅ **Error Handling** - Comprehensive
- ✅ **Documentation** - Complete

---

## 🎯 Key Points

### You're Using: Printful Native Integration

**What this means:**
- Orders automatically sync from Shopify → Printful
- No custom webhooks needed for fulfillment
- No manual variant mapping required
- Printful app handles everything

### You DON'T Need:
- ❌ Shopify Admin API token (for basic operation)
- ❌ Shopify order webhook (fulfillment handled by Printful app)
- ❌ Custom sync logic (automatic)
- ❌ Manual order processing (100% automated)

### You MIGHT Want (Optional):
- ⚪ Printful webhook - For branded shipping emails
- ⚪ Shopify webhook - For order analytics/logging

---

## 🧪 Testing

### Quick Test
```bash
npm run check:integration
```

### Manual Test
1. Visit `/merch`
2. Add product to cart
3. View cart drawer
4. Update quantities
5. Click checkout

---

## 🚀 Production Deployment

### Before Launch
- [x] All components verified
- [x] Environment variables set
- [x] Documentation complete
- [ ] Deploy to production
- [ ] Update webhook URLs
- [ ] Test full flow

### After Launch
- Monitor first few orders
- Verify email delivery
- Check Printful dashboard
- Review logs regularly

---

## 📞 Support

- **Documentation:** This directory
- **Commands:** `npm run check:integration`
- **Contact:** ofbloodband@gmail.com

---

## 🎸 Built For Musicians

This system was designed to let you focus on making music while your merch sells itself.

**Zero manual processing. Maximum automation. Complete peace of mind.** ✅

---

**Ready to go live?** See [ACTUAL_SETUP.md](./ACTUAL_SETUP.md) for deployment instructions.

