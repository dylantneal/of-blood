# 🚀 Quick Improvements - Start Here

**Goal:** Implement high-impact improvements in under 2 hours

---

## ⚡ 5-Minute Wins

### 1. Add Skip Navigation Link
```typescript
// app/layout.tsx - Add after <body> tag
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-background rounded"
>
  Skip to main content
</a>

// Then add id to main
<main id="main-content" className="...">
```

### 2. Remove Duplicate Cart File
```bash
rm components/cart/cart-drawer-new.tsx
```

### 3. Add Error Monitoring
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4. Add Analytics
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

// Add before </body>
<Analytics />
```

---

## ⏱️ 30-Minute Wins

### 5. Add Basic Structured Data
```typescript
// components/seo/schema.tsx
export function BandSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          "name": "Of Blood",
          "genre": "Death Metal",
          "url": "https://ofblood.band",
          "sameAs": [
            "https://instagram.com/ofbloodband",
            "https://youtube.com/@OfBloodBand"
          ]
        })
      }}
    />
  );
}
```

```typescript
// app/layout.tsx - Add to head
<BandSchema />
```

### 6. Add Security Headers
```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // ... rest of config
};
```

### 7. Add Bundle Analyzer
```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  // existing config
});
```

Run: `ANALYZE=true npm run build`

---

## 🕐 1-Hour Wins

### 8. Setup Playwright E2E Tests
```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// tests/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Of Blood/);
});

test('can navigate to merch', async ({ page }) => {
  await page.goto('/');
  await page.click('a:has-text("Merch")');
  await expect(page).toHaveURL(/\/merch/);
});

test('can add item to cart', async ({ page }) => {
  await page.goto('/merch');
  const productLink = page.locator('a[href*="/merch/"]').first();
  await productLink.click();
  
  await page.click('button:has-text("Add to Cart")');
  
  // Check cart badge updates
  const badge = page.locator('[aria-label="Open collection"] span');
  await expect(badge).toHaveText('1');
});
```

```json
// package.json - add script
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 9. Improve Cart Drawer Accessibility
```typescript
// components/cart/cart-drawer.tsx
import FocusTrap from 'focus-trap-react';

export function CartDrawer({ isOpen, onClose }: Props) {
  const { cart, error } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 z-100"
        aria-hidden="true"
      />
      
      <FocusTrap active={isOpen}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          className="fixed right-0 top-0 h-screen w-full max-w-md bg-background border-l border-line z-101"
        >
          <div className="flex items-center justify-between p-6 border-b border-line">
            <h2 id="cart-title" className="font-display text-2xl">
              Collection
            </h2>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 hover:bg-muted rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div role="alert" className="p-4 bg-primary/10 border-l-2 border-primary">
              {error}
            </div>
          )}

          {/* Rest of cart content */}
        </div>
      </FocusTrap>
    </>
  );
}
```

Install: `npm install focus-trap-react`

### 10. Add Live Region for Cart Updates
```typescript
// components/layout/header.tsx
import { useCart } from "@/contexts/cart-context";

export default function Header() {
  const { cart } = useCart();

  return (
    <header>
      {/* Existing header content */}
      
      {/* Announce cart updates to screen readers */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {cart && cart.totalQuantity > 0 && (
          `Cart updated. ${cart.totalQuantity} ${cart.totalQuantity === 1 ? 'item' : 'items'} in cart.`
        )}
      </div>
    </header>
  );
}
```

---

## 📊 Impact Summary

| Improvement | Time | Impact | Difficulty |
|-------------|------|--------|------------|
| Skip link | 5min | High | Easy |
| Remove duplicate | 1min | Low | Easy |
| Sentry | 15min | High | Easy |
| Analytics | 10min | Medium | Easy |
| Structured data | 30min | Medium | Medium |
| Security headers | 20min | Medium | Easy |
| Bundle analyzer | 5min | Medium | Easy |
| E2E tests | 1hr | High | Medium |
| Cart accessibility | 1hr | High | Medium |
| Live regions | 30min | Medium | Easy |

---

## 🎯 Recommended Order

1. **Add Sentry** (15 min) - Know when things break
2. **Add Skip Link** (5 min) - Basic accessibility
3. **Add Analytics** (10 min) - Track usage
4. **Security Headers** (20 min) - Better security
5. **Remove Duplicate** (1 min) - Code cleanup
6. **Bundle Analyzer** (5 min) - Understand bundle size
7. **Cart Accessibility** (1 hr) - Better UX
8. **E2E Tests** (1 hr) - Prevent regressions
9. **Structured Data** (30 min) - Better SEO
10. **Live Regions** (30 min) - Better announcements

**Total Time: ~4 hours for all improvements**

---

## 🚦 Testing Your Changes

### After Each Change:
```bash
# 1. Lint
npm run lint

# 2. Type check
npx tsc --noEmit

# 3. Build
npm run build

# 4. Test locally
npm run dev
```

### Accessibility Testing:
1. Install [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
2. Open DevTools → axe DevTools tab
3. Click "Scan ALL of my page"
4. Fix any critical/serious issues

### Performance Testing:
1. Open DevTools → Lighthouse tab
2. Run audit (Performance + Accessibility + Best Practices + SEO)
3. Aim for 90+ on all metrics

---

## ✅ Checklist

- [ ] Sentry error monitoring added
- [ ] Analytics added
- [ ] Skip navigation link added
- [ ] Security headers added
- [ ] Duplicate cart file removed
- [ ] Bundle analyzer setup
- [ ] Basic E2E tests written
- [ ] Cart drawer accessibility improved
- [ ] Live regions for cart updates
- [ ] Structured data added
- [ ] All tests passing
- [ ] Lighthouse score 90+

---

## 📚 Resources

- [Next.js Performance Docs](https://nextjs.org/docs/basic-features/font-optimization)
- [Web.dev Accessibility](https://web.dev/accessibility/)
- [Playwright Docs](https://playwright.dev/)
- [Schema.org Music](https://schema.org/MusicGroup)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Start with the 5-minute wins, then move to 30-minute wins, then 1-hour wins!**


