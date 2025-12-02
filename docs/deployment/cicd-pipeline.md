# CI/CD Pipeline Documentation

## Overview

This project uses a comprehensive CI/CD pipeline designed for security, reliability, and ease of use for solo development. The pipeline integrates GitHub Actions with Vercel for automated testing, security scanning, and deployments.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Workflow                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Local Development                                         │
│    ├─ Pre-commit hooks (Husky)                              │
│    ├─ ESLint auto-fix                                        │
│    └─ Type checking                                          │
├─────────────────────────────────────────────────────────────┤
│ 2. Push to GitHub                                            │
│    └─ Triggers CI Pipeline                                   │
├─────────────────────────────────────────────────────────────┤
│ 3. CI Pipeline (GitHub Actions)                             │
│    ├─ Quality Gates                                          │
│    │  ├─ ESLint                                              │
│    │  ├─ TypeScript compilation                             │
│    │  └─ Code quality checks                                │
│    ├─ Security Scanning                                      │
│    │  ├─ npm audit                                           │
│    │  ├─ Secret detection (TruffleHog)                      │
│    │  ├─ CodeQL analysis                                     │
│    │  └─ Dependency scanning                                │
│    └─ Build & Test                                           │
│       ├─ Next.js build                                       │
│       ├─ Build size analysis                                 │
│       └─ Lighthouse audit (PRs only)                         │
├─────────────────────────────────────────────────────────────┤
│ 4. Deployment                                                │
│    ├─ Preview (Pull Requests)                               │
│    │  └─ Vercel preview deployment                          │
│    └─ Production (main branch)                              │
│       ├─ Vercel production deployment                       │
│       ├─ Deployment tagging                                  │
│       └─ Post-deployment health checks                      │
└─────────────────────────────────────────────────────────────┘
```

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**

#### Quality Gates
- **ESLint**: Ensures code style and catches potential bugs
- **TypeScript**: Validates type safety across the codebase
- **Console.log check**: Warns about debugging statements (non-blocking)

#### Security Scan
- **npm audit**: Checks for known vulnerabilities in dependencies
- **TruffleHog**: Scans for accidentally committed secrets
- **Fails on**: Critical or high severity vulnerabilities

#### Build & Test
- **Next.js build**: Ensures the application compiles successfully
- **Build artifacts**: Saved for 7 days for debugging
- **Build size analysis**: Monitors bundle size

#### Lighthouse Audit (PR only)
- **Performance**: Minimum score 80%
- **Accessibility**: Minimum score 90%
- **Best Practices**: Minimum score 90%
- **SEO**: Minimum score 90%

### 2. Deployment Pipeline (`deploy.yml`)

**Triggers:**
- Pull requests to `main` (preview deployment)
- Push to `main` (production deployment)

**Preview Deployment (PRs):**
1. Builds project with Vercel CLI
2. Deploys to Vercel preview environment
3. Comments on PR with preview URL
4. Allows testing before merging

**Production Deployment (main):**
1. Builds project with production configuration
2. Deploys to production on Vercel
3. Creates deployment tag (e.g., `deploy-20250102-143000`)
4. Runs post-deployment health checks
5. Verifies key pages are accessible

### 3. Security Scanning (`security.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- Daily at 2 AM UTC (scheduled)
- Manual trigger via GitHub UI

**Scans:**

#### Dependency Vulnerabilities
- Runs `npm audit`
- Fails on critical or high severity issues
- Provides detailed vulnerability breakdown

#### CodeQL Analysis
- Static code analysis
- Detects security vulnerabilities
- Checks for common coding errors

#### Secret Scanning
- **TruffleHog**: Detects verified secrets
- **GitGuardian**: Additional secret detection
- Prevents credentials from being committed

#### Environment File Check
- Ensures no `.env` files are in git
- Checks for hardcoded secrets patterns
- Warns about potential security issues

#### Security Headers
- Verifies presence of security headers
- Checks X-Frame-Options, X-Content-Type-Options, HSTS

### 4. Automated Dependency Updates (`dependabot.yml`)

**Schedule:** Weekly on Mondays at 9 AM

**Features:**
- Groups minor and patch updates together
- Separates production and development dependencies
- Ignores major version updates (manual review required)
- Auto-labels PRs for easy filtering
- Monitors GitHub Actions versions monthly

## Local Development Setup

### Initial Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Install Husky:**
```bash
npm run prepare
```

3. **Verify hooks are installed:**
```bash
ls -la .husky/
```

### Pre-commit Hooks

When you run `git commit`, the following happens automatically:

1. **lint-staged** runs:
   - ESLint fixes JavaScript/TypeScript files
   - Prettier formats JSON, Markdown, YAML files
   - Changes are automatically added to the commit

2. **Console.log check** (warning only):
   - Alerts you to debugging statements
   - Doesn't block the commit

3. **TODO/FIXME reminder**:
   - Shows any TODOs in your staged files

### Manual Commands

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check types without building
npm run type-check

# Run all pre-commit checks manually
npm run pre-commit
```

## GitHub Setup

### Required Secrets

Add these secrets in GitHub Settings → Secrets and variables → Actions:

#### Vercel Integration
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**How to get these:**
1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token with deployment permissions
3. Project settings show ORG_ID and PROJECT_ID

#### Shopify (for builds)
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
```

#### Optional: GitGuardian
```
GITGUARDIAN_API_KEY=your_api_key
```

Sign up at https://www.gitguardian.com/ for free secret scanning.

### Branch Protection Rules

Recommended settings for `main` branch:

1. **Require pull request before merging**
   - Require 1 approval (or 0 for solo development)
   - Dismiss stale reviews

2. **Require status checks to pass**
   - Quality Gates
   - Security Scan
   - Build & Test

3. **Require conversation resolution**

4. **Do not allow bypassing the above settings**

5. **Allow force pushes** (disabled)

6. **Allow deletions** (disabled)

**To set up:**
1. Go to GitHub repository → Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `main`
4. Configure settings above

## Deployment Workflow

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes
# ... develop your feature ...

# 3. Commit (pre-commit hooks run automatically)
git add .
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/your-feature

# 5. Create Pull Request
# - CI pipeline runs automatically
# - Preview deployment created
# - Review results in PR comments

# 6. Merge to main (after approval)
# - Production deployment triggers automatically
# - Health checks verify deployment
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/critical-fix

# 2. Fix the issue
# ... make changes ...

# 3. Commit and push
git commit -m "fix: critical security patch"
git push origin hotfix/critical-fix

# 4. Create PR and merge quickly
# - CI runs (faster than full test suite)
# - Deploy immediately after merge

# 5. Verify deployment
# - Check health check results
# - Monitor production site
```

### Rolling Back

If a deployment causes issues:

```bash
# 1. Via Vercel Dashboard (fastest)
# - Go to Deployments
# - Find previous working deployment
# - Click "Promote to Production"

# 2. Via Git (creates new deployment)
git revert HEAD
git push origin main

# 3. Via deployment tag
git checkout deploy-YYYYMMDD-HHMMSS
git push origin main --force  # Use with caution
```

## Monitoring & Alerts

### GitHub Actions

- **CI/CD results**: Check the Actions tab in GitHub
- **Failed builds**: You'll get email notifications
- **Security alerts**: Dependabot and security scanning create issues

### Vercel Dashboard

- **Deployment status**: https://vercel.com/dashboard
- **Build logs**: Click on any deployment for detailed logs
- **Analytics**: Monitor performance and errors

### Daily Security Scans

- Runs at 2 AM UTC daily
- Creates GitHub issues for security problems
- Review and address promptly

## Troubleshooting

### Build Fails on CI but Works Locally

**Issue**: Different environments

**Solution:**
```bash
# Use the same Node version as CI
nvm use 18

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Try building
npm run build
```

### Deployment Fails

**Check:**
1. Vercel token is valid
2. Environment variables are set in Vercel
3. Build logs in GitHub Actions
4. Vercel dashboard for specific errors

**Quick fix:**
```bash
# Redeploy from Vercel dashboard
# or trigger workflow manually:
# GitHub → Actions → Deploy to Vercel → Run workflow
```

### Pre-commit Hook Issues

**Issue**: Hooks not running

**Solution:**
```bash
# Reinstall hooks
rm -rf .husky
npm run prepare

# Make hooks executable
chmod +x .husky/*
```

### Security Scan False Positives

**Issue**: Known safe pattern flagged as secret

**Solution:**
Add to `.gitignore` patterns or update the security workflow to exclude specific patterns.

## Performance Optimization

### Build Time Optimization

- **Caching**: npm dependencies are cached between runs
- **Parallel jobs**: CI runs multiple checks simultaneously
- **Incremental builds**: Vercel only rebuilds changed files

### Cost Optimization

- **Concurrent runs**: Limited to 1 per PR to save minutes
- **Preview deployments**: Automatically cleaned up when PR closes
- **Scheduled scans**: Run during off-peak hours

## Best Practices

### Commits

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Keep commits small and focused
- Write clear commit messages

### Pull Requests

- Keep PRs small (<500 lines changed)
- Write clear descriptions
- Link to issues when applicable
- Test preview deployment before merging

### Security

- Never commit `.env` files
- Use GitHub secrets for sensitive data
- Review Dependabot PRs weekly
- Address security alerts immediately

### Deployment

- Deploy during low-traffic periods
- Monitor deployment for 15 minutes after
- Keep deployment tags for easy rollback
- Test preview deployments thoroughly

## Maintenance

### Weekly Tasks

- Review Dependabot PRs
- Check security scan results
- Update dependencies if needed

### Monthly Tasks

- Review GitHub Actions usage
- Audit security practices
- Update documentation if workflows change

### Quarterly Tasks

- Review and update branch protection rules
- Audit team access (if team grows)
- Performance review of CI/CD pipeline

## Emergency Procedures

### Critical Bug in Production

1. **Immediate rollback** via Vercel dashboard
2. Create hotfix branch
3. Fix issue
4. Fast-track PR review
5. Deploy with monitoring

### Security Incident

1. **Rotate all secrets immediately**
2. Review git history for exposed credentials
3. Update GitHub secrets
4. Deploy new version
5. Monitor for suspicious activity

### Pipeline Failure

1. Check GitHub Actions status page
2. Verify Vercel is operational
3. Retry workflow manually
4. Contact support if infrastructure issue

## Support & Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Security Best Practices**: https://github.com/OWASP/CheatSheetSeries

## Questions?

For questions about the CI/CD pipeline:
1. Check this documentation first
2. Review GitHub Actions workflow files
3. Check Vercel deployment logs
4. Consult the troubleshooting section

