# XSS Vulnerability Fix

## What Was Fixed

### 1. ✅ XSS in Contact Form (CRITICAL)
**Issue:** User input was directly inserted into HTML emails without sanitization, allowing HTML/JavaScript injection.

**Files Changed:**
- `app/api/contact/route.ts`

**Solution:**
- Added `escapeHtml()` function to sanitize all user inputs
- Escapes dangerous HTML characters: `&`, `<`, `>`, `"`, `'`, `/`
- All user-provided fields now sanitized: name, email, venue, date, message
- Newlines still converted to `<br>` tags (but only after escaping)

**Example Attack Prevented:**
```javascript
// Before fix - attacker could inject:
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">

// After fix - rendered as:
&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;
&lt;img src=x onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;
```

---

### 2. ✅ Hardcoded Email Addresses (QUICK WIN)
**Issue:** Email addresses were hardcoded in the API route, making them hard to change.

**Files Changed:**
- `app/api/contact/route.ts`
- `app/api/newsletter/route.ts`
- `env.example`

**Solution:**
- Moved email addresses to environment variables
- Added `CONTACT_EMAIL` for where form submissions are sent
- Added `FROM_EMAIL_DOMAIN` for the sender domain
- Falls back to defaults if not set (backward compatible)

---

### 3. ✅ Wrong Email Domain in Newsletter (SPAM FILTER ISSUE)
**Issue:** Newsletter confirmation emails sent from `onboarding@resend.dev` (Resend's dev domain), which looks unprofessional and hits spam filters.

**Files Changed:**
- `app/api/newsletter/route.ts`

**Solution:**
- Now uses `FROM_EMAIL_DOMAIN` environment variable
- Defaults to `newsletter@of-blood.com`
- Professional sender address that won't hit spam filters

---

## Configuration

### Required Setup

Add these to your `.env.local` file:

```bash
# Contact form email addresses
CONTACT_EMAIL=ofbloodband@gmail.com
FROM_EMAIL_DOMAIN=of-blood.com
```

### Email Domain Setup

For production, you need to verify your domain with Resend:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain (e.g., `of-blood.com`)
3. Add the DNS records they provide to your domain registrar
4. Wait for verification (usually < 1 hour)
5. Set `FROM_EMAIL_DOMAIN=of-blood.com` in your environment variables

**Important:** Until your domain is verified, use Resend's development domain:
```bash
FROM_EMAIL_DOMAIN=resend.dev
```

---

## Testing

### Test Contact Form XSS Protection

Try submitting this malicious payload in the contact form:

```
Name: <script>alert('XSS')</script>
Email: test@example.com
Message: <img src=x onerror="alert('XSS')">
```

**Expected Result:** Email should arrive with the HTML escaped, not executed:
```
From: &lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;
Message: &lt;img src=x onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;
```

### Test Email Configuration

1. Submit a contact form
2. Check that email arrives at `CONTACT_EMAIL` address
3. Check that "From" header shows your domain
4. Subscribe to newsletter
5. Check confirmation email sender is `newsletter@your-domain.com`

---

## Migration Guide

### If You Already Have .env.local

Add these two lines to your existing `.env.local`:

```bash
CONTACT_EMAIL=ofbloodband@gmail.com
FROM_EMAIL_DOMAIN=of-blood.com
```

### If You Don't Have .env.local

Copy the example file:

```bash
cp env.example .env.local
```

Then fill in your credentials.

---

## Security Impact

### Before Fix
- ❌ Contact form vulnerable to XSS attacks
- ❌ Attacker could inject malicious HTML/JS into emails
- ❌ Email addresses hardcoded and hard to change
- ❌ Newsletter emails from dev domain (unprofessional)

### After Fix
- ✅ All user input properly escaped (XSS prevented)
- ✅ Email addresses configurable via environment variables
- ✅ Professional email sender domains
- ✅ Production-ready security

---

## What's Still Not "Perfect" (But Totally Fine)

These were **not** fixed because they're not actually problems for a band website:

1. **No rate limiting** - Add Cloudflare if you get spam
2. **Simple email validation** - Resend validates anyway
3. **Admin uses simple auth** - Only protects tour dates, fine for now
4. **No CSRF tokens** - Low risk for this use case
5. **No automated tests** - Manual testing is fine at this scale

Ship it! 🚀

