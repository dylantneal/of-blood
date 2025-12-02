# CI/CD Quick Start Guide

Get your CI/CD pipeline up and running in 10 minutes.

## Prerequisites

- ✅ GitHub repository created
- ✅ Vercel account connected to GitHub
- ✅ Project deployed once manually to Vercel

## Step 1: Install Local Dependencies (2 min)

```bash
# Install new dev dependencies
npm install --save-dev husky lint-staged

# Set up Git hooks
npm run prepare
```

**Verify:**
```bash
ls .husky/pre-commit  # Should exist
```

## Step 2: Get Vercel Credentials (3 min)

### Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions"
4. Copy the token (you won't see it again!)

### Get Project IDs

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Get IDs
vercel env ls
```

Or get from Vercel Dashboard:
- **ORG_ID**: Settings → General → Organization ID
- **PROJECT_ID**: Project Settings → General → Project ID

## Step 3: Add GitHub Secrets (2 min)

Go to: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

Add these three secrets:

```
Name: VERCEL_TOKEN
Value: [paste your token from Step 2]

Name: VERCEL_ORG_ID  
Value: [your org ID]

Name: VERCEL_PROJECT_ID
Value: [your project ID]
```

Optional but recommended:

```
Name: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
Value: your-store.myshopify.com

Name: NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
Value: [your storefront API token]
```

## Step 4: Set Up Branch Protection (2 min)

Go to: **GitHub Repository → Settings → Branches → Add rule**

```
Branch name pattern: main

☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
   ☑️ Quality Gates
   ☑️ Security Scan  
   ☑️ Build & Test
☑️ Require conversation resolution before merging
```

Click **Create** / **Save changes**

## Step 5: Test the Pipeline (1 min)

### Test Local Hooks

```bash
# Make a small change
echo "# Test" >> README.md

# Commit (hooks will run)
git add README.md
git commit -m "test: verify pre-commit hooks"

# You should see:
# 🔍 Running pre-commit checks...
# ✅ Pre-commit checks passed!
```

### Test CI Pipeline

```bash
# Push to trigger CI
git push origin main

# Check GitHub Actions tab
# You should see workflows running
```

### Test Preview Deployment

```bash
# Create a test branch
git checkout -b test/pipeline

# Make a change
echo "console.log('test');" >> app/page.tsx

# Push and create PR
git add .
git commit -m "test: trigger preview deployment"
git push origin test/pipeline

# Go to GitHub and create Pull Request
# Check for:
# ✅ CI checks running
# ✅ Preview deployment URL in PR comment
```

## Step 6: Configure Dependabot (Optional)

This is already set up in `.github/dependabot.yml`!

To enable:
1. Go to **GitHub Repository → Settings → Code security and analysis**
2. Enable **Dependabot alerts**
3. Enable **Dependabot security updates**

## Verification Checklist

After setup, verify:

- [ ] Local pre-commit hooks run on `git commit`
- [ ] CI workflow runs on push to main
- [ ] PR creates preview deployment
- [ ] PR requires checks to pass before merge
- [ ] Push to main triggers production deployment
- [ ] Security scan runs successfully
- [ ] Dependabot creates weekly PRs

## What Happens Now?

### On Every Commit (Locally)

```
git commit
  ↓
Pre-commit hooks run:
  ├─ ESLint auto-fixes your code
  ├─ Formats JSON/Markdown files  
  ├─ Warns about console.logs
  └─ Shows TODOs
  ↓
Commit succeeds ✅
```

### On Every Push

```
git push
  ↓
GitHub Actions triggers:
  ├─ Quality Gates (ESLint, TypeScript)
  ├─ Security Scan (vulnerabilities, secrets)
  └─ Build & Test
  ↓
All green ✅
```

### On Pull Request

```
Create PR
  ↓
Automatically:
  ├─ CI pipeline runs
  ├─ Preview deployment created
  ├─ Lighthouse audit runs
  └─ Comment with preview URL
  ↓
Review → Merge ✅
```

### On Merge to Main

```
PR merged
  ↓
Automatically:
  ├─ CI pipeline runs again
  ├─ Production deployment
  ├─ Deployment tagged
  └─ Health checks run
  ↓
Live at of-blood.com ✅
```

## Troubleshooting

### "Vercel token is invalid"

**Fix:**
```bash
# Regenerate token at vercel.com/account/tokens
# Update GitHub secret: VERCEL_TOKEN
```

### "npm audit failed"

**Fix:**
```bash
npm audit fix
git add package*.json
git commit -m "fix: update vulnerable dependencies"
git push
```

### Pre-commit hooks not running

**Fix:**
```bash
# Reinstall hooks
rm -rf .husky
npm run prepare

# Make executable
chmod +x .husky/*
```

### CI passes locally but fails on GitHub

**Check:**
```bash
# Use same Node version as CI (18)
nvm use 18

# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. **Read the full guide**: [docs/deployment/cicd-pipeline.md](./cicd-pipeline.md)
2. **Review workflows**: Check `.github/workflows/*.yml` files
3. **Customize**: Adjust thresholds and checks as needed
4. **Monitor**: Watch first few deployments closely

## Emergency Rollback

If something goes wrong after deployment:

### Option 1: Vercel Dashboard (Fastest)
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Deployments
4. Find last working deployment
5. Click "..." → "Promote to Production"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
# New deployment triggered automatically
```

## Support

- 📚 **Full Documentation**: [cicd-pipeline.md](./cicd-pipeline.md)
- 🔧 **Troubleshooting**: See main CI/CD docs
- 🐛 **Issues**: Check GitHub Actions logs
- 💬 **Questions**: Review workflow files for details

---

**Setup Time**: ~10 minutes  
**Maintenance**: ~15 minutes per week  
**Benefits**: Automated testing, security, and deployment 🚀

