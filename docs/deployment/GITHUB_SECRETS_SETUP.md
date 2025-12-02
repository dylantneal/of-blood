# GitHub Secrets Setup Guide

This guide shows you how to set up GitHub Secrets for CI/CD and security.

---

## 🔐 What Are GitHub Secrets?

GitHub Secrets allow you to store sensitive information securely in your repository. These secrets can be used in GitHub Actions workflows without exposing them in your code.

---

## 📝 Secrets to Add

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets

Add these secrets one by one:

#### 1. SHOPIFY_STORE_DOMAIN
- **Value:** `if8vpt-fk.myshopify.com`
- **Used for:** Shopify API connection

#### 2. SHOPIFY_STOREFRONT_TOKEN
- **Value:** `5117aa248ba23dece49001d4d1cd97ea`
- **Used for:** Shopify Storefront API access

#### 3. PRINTFUL_API_KEY
- **Value:** `lHKLNj1CCH6CvzZzFmMoww5k2Ca3O3ZHPhfTDkAN`
- **Used for:** Printful API access

#### 4. RESEND_API_KEY
- **Value:** `re_cNPaecEq_1frJo2KBGTVV55W3CJ2ePPii`
- **Used for:** Email service

### Optional Secrets

#### 5. PRINTFUL_WEBHOOK_SECRET
- **Value:** [Get from Printful Dashboard]
- **Used for:** Printful webhook verification

#### 6. SHOPIFY_WEBHOOK_SECRET
- **Value:** [Get from Shopify Admin]
- **Used for:** Shopify webhook verification

#### 7. ADMIN_PASSWORD
- **Value:** `Schecter7$`
- **Used for:** Admin features

---

## 🤖 GitHub Actions (Optional)

You can create automated testing workflows that run on every push:

### Example Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test Merch System

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run linter
      run: npm run lint
    
    - name: Run integration tests
      env:
        NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: ${{ secrets.SHOPIFY_STORE_DOMAIN }}
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${{ secrets.SHOPIFY_STOREFRONT_TOKEN }}
        PRINTFUL_API_KEY: ${{ secrets.PRINTFUL_API_KEY }}
        RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
      run: npm run test:merch
```

This workflow will:
- ✅ Run on every push
- ✅ Check TypeScript types
- ✅ Run linter
- ✅ Execute comprehensive tests

---

## 🔒 Security Best Practices

### DO ✅

- Store all sensitive data in secrets
- Use different secrets for different environments
- Rotate secrets periodically
- Limit secret access to necessary workflows
- Use GitHub's secret scanning

### DON'T ❌

- Commit secrets to your repository
- Share secrets in plain text
- Use production secrets in development
- Print secrets in logs
- Copy secrets to public places

---

## 📊 Managing Secrets

### View Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You'll see a list of all secrets
3. ⚠️ You cannot view secret values (security feature)

### Update Secrets

1. Click on the secret name
2. Click **"Update secret"**
3. Enter new value
4. Click **"Update secret"**

### Delete Secrets

1. Click on the secret name
2. Click **"Remove secret"**
3. Confirm deletion

---

## 🌍 Environment-Specific Secrets

For different environments (staging, production), you can use:

### Environments

1. Go to **Settings** → **Environments**
2. Create environments: `staging`, `production`
3. Add environment-specific secrets

### Using in Workflows

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh
```

---

## ✅ Verification

After adding secrets, verify they work:

### Manual Test

1. Create a simple workflow that echoes (masks) secret existence
2. Check workflow runs successfully
3. Verify secrets are not exposed in logs

### Automated Test

GitHub automatically:
- ✅ Masks secrets in logs
- ✅ Prevents accidental exposure
- ✅ Alerts on secret scanning findings

---

## 🆘 Troubleshooting

### Secret Not Working in Workflow

**Check:**
- Secret name matches exactly (case-sensitive)
- Secret is in correct scope (repository vs. environment)
- Workflow has permission to access secrets

**Solution:**
1. Verify secret name in workflow file
2. Check Settings → Secrets to confirm it exists
3. Ensure environment is specified if using environment secrets

### Secret Exposed Accidentally

**Immediate Actions:**
1. Delete the exposed secret immediately
2. Generate new credentials
3. Update secret in GitHub
4. Review Git history for exposure
5. Consider rotating related credentials

---

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## ⚠️ Important Note

**For Vercel Deployment:** You'll need to add these same variables to Vercel (not just GitHub). See `VERCEL_DEPLOYMENT.md` for details.

GitHub Secrets are primarily for:
- GitHub Actions workflows
- CI/CD pipelines
- Automated testing

Vercel Environment Variables are for:
- Runtime application configuration
- Production deployments
- API connections

**Both are needed for complete setup!**

---

**Security Status:** Following these practices keeps your credentials safe! 🔐

