# Security Tests

This directory contains tests to verify security fixes, particularly XSS protection.

## Available Tests

### 1. Unit Test - XSS Protection

Tests the `escapeHtml()` function with various malicious payloads.

**Run:**
```bash
npx tsx tests/xss-test.ts
```

**What it tests:**
- Script tag injection
- Image onerror injection
- Iframe injection
- Event handler injection
- JavaScript protocol in links
- SVG/XML attacks
- HTML entity bypass attempts
- Normal text handling

### 2. Integration Test - API Contact Form

Tests the actual contact form API endpoint with malicious requests.

**Prerequisites:**
- Dev server must be running
- RESEND_API_KEY must be configured (will send real emails)

**Run:**
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run test
npx tsx tests/api-contact-test.ts
```

**What it tests:**
- XSS attempts in all form fields
- Multiple simultaneous XSS attempts
- Normal legitimate submissions
- Validation of required fields

**⚠️ Warning:** This test sends real emails via Resend. Check your inbox to verify malicious payloads are properly escaped.

## Test Results Summary

### Unit Test Results
✅ **All 10 tests passed**

Confirmed that dangerous payloads like:
- `<script>alert("XSS")</script>`
- `<img src=x onerror="alert('XSS')">`
- `<iframe src="javascript:alert('XSS')"></iframe>`

Are properly escaped to:
- `&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;`
- `&lt;img src=x onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;`
- `&lt;iframe src=&quot;javascript:alert(&#39;XSS&#39;)&quot;&gt;&lt;/iframe&gt;`

### Integration Test Results
Run the integration test to verify the API endpoint handles attacks correctly.

## Manual Testing

You can also manually test the contact form:

1. Go to: http://localhost:3000/contact
2. Submit this payload:
   - **Name:** `<script>alert('XSS')</script>`
   - **Email:** `your-email@example.com`
   - **Message:** `<img src=x onerror="alert('XSS')">`
   - **Type:** General

3. Check the email you receive - it should show the escaped HTML, not execute any code.

## What's Being Protected

The XSS fix protects against:
- **Stored XSS** - Malicious code saved and displayed later
- **Email injection attacks** - HTML/JS executed when email is opened
- **Script execution** - Any `<script>` tags being run
- **Event handlers** - onerror, onload, onclick, etc.
- **Protocol handlers** - javascript:, data:, vbscript:, etc.

## Adding More Tests

To add a new test case to the unit test, add to the `testCases` array:

```typescript
{
  name: "Your test name",
  input: '<your malicious payload>',
  expected: '&lt;your escaped payload&gt;',
  dangerous: true,
}
```

To add a new API test case, add to the `testCases` array in `api-contact-test.ts`.

