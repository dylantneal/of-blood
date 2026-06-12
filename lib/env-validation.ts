/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 */

import { MERCH_ENABLED } from "@/lib/site-config";

export interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

const SHOPIFY_ENV_VARS = [
  "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
  "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
] as const;

const EMAIL_ENV_VARS = ["RESEND_API_KEY"] as const;

const ADMIN_ENV_VARS = ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"] as const;

/**
 * Optional but recommended environment variables
 */
const RECOMMENDED_ENV_VARS = [
  "RESEND_AUDIENCE_ID",
  "CONTACT_EMAIL",
  "FROM_EMAIL_DOMAIN",
  "NEXT_PUBLIC_SITE_URL",
];

function getRequiredEnvVars(): Record<string, readonly string[]> {
  const required: Record<string, readonly string[]> = {};

  if (MERCH_ENABLED) {
    required.shopify = SHOPIFY_ENV_VARS;
  }

  // Contact, newsletter, and admin can be configured later in local dev.
  if (process.env.NODE_ENV === "production") {
    required.email = EMAIL_ENV_VARS;
    required.admin = ADMIN_ENV_VARS;
  }

  return required;
}

function getDevelopmentWarnings(): string[] {
  const warnings: string[] = [];

  if (process.env.NODE_ENV === "development") {
    for (const varName of EMAIL_ENV_VARS) {
      if (!process.env[varName]) {
        warnings.push(`${varName} (contact form and newsletter)`);
      }
    }

    for (const varName of ADMIN_ENV_VARS) {
      if (!process.env[varName]) {
        warnings.push(`${varName} (admin panel)`);
      }
    }
  }

  return warnings;
}

/**
 * Validate environment variables
 * @param strict - If true, throws error on missing required vars. If false, logs warnings.
 */
export function validateEnv(strict = false): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = getDevelopmentWarnings();

  // Check required variables
  Object.entries(getRequiredEnvVars()).forEach(([category, vars]) => {
    vars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName);
        console.error(`❌ Missing required env var: ${varName} (${category})`);
      }
    });
  });

  // Check recommended variables
  RECOMMENDED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  const isValid = missing.length === 0;

  if (!isValid) {
    const errorMessage = [
      "",
      "═══════════════════════════════════════════════════════",
      "❌ ENVIRONMENT CONFIGURATION ERROR",
      "═══════════════════════════════════════════════════════",
      "",
      "Missing required environment variables:",
      ...missing.map((v) => `  - ${v}`),
      "",
      "Please check your .env.local file and ensure all required",
      "variables are set. See env.example for reference.",
      "",
      "To fix:",
      "  1. Copy env.example to .env.local",
      "  2. Fill in the required values",
      "  3. Restart the development server",
      "",
      "═══════════════════════════════════════════════════════",
      "",
    ].join("\n");

    if (strict) {
      throw new Error(errorMessage);
    }
  }

  if (warnings.length > 0 && process.env.NODE_ENV === "development") {
    console.warn("\n📋 Optional environment variables not set:");
    warnings.forEach((v) => console.warn(`  - ${v}`));
    console.warn("");
  }

  return {
    isValid,
    missing,
    warnings,
  };
}

/**
 * Validate specific environment variable with helpful error message
 */
export function requireEnv(varName: string, context?: string): string {
  const value = process.env[varName];
  
  if (!value) {
    const contextMsg = context ? ` (required for ${context})` : '';
    throw new Error(
      `Environment variable ${varName} is not set${contextMsg}. ` +
      `Please add it to your .env.local file.`
    );
  }
  
  return value;
}

/**
 * Get environment variable with fallback
 */
export function getEnv(varName: string, fallback: string): string {
  return process.env[varName] || fallback;
}

/**
 * Validate Shopify configuration specifically
 */
export function validateShopifyConfig(): { isValid: boolean; error?: string } {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return {
      isValid: false,
      error: 'Shopify is not configured. Please set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment variables.',
    };
  }

  // Validate domain format
  if (!domain.includes('.myshopify.com') && !domain.includes('.shopify.com')) {
    return {
      isValid: false,
      error: `Invalid Shopify domain format: ${domain}. Expected format: your-store.myshopify.com`,
    };
  }

  // Validate token format (Shopify Storefront tokens usually start with a specific pattern)
  if (token.length < 20) {
    return {
      isValid: false,
      error: 'Shopify Storefront Access Token appears to be invalid (too short).',
    };
  }

  return { isValid: true };
}

/**
 * Validate Resend configuration
 */
export function validateResendConfig(): { isValid: boolean; error?: string } {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      isValid: false,
      error: 'Resend is not configured. Please set RESEND_API_KEY in your environment variables.',
    };
  }

  // Validate API key format (Resend keys start with 're_')
  if (!apiKey.startsWith('re_')) {
    return {
      isValid: false,
      error: `Invalid Resend API key format. Keys should start with 're_'. Got: ${apiKey.substring(0, 5)}...`,
    };
  }

  return { isValid: true };
}

/**
 * Validate admin configuration
 */
export function validateAdminConfig(): { isValid: boolean; error?: string } {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password) {
    return {
      isValid: false,
      error: 'Admin password is not configured. Please set ADMIN_PASSWORD in your environment variables.',
    };
  }

  if (!secret) {
    return {
      isValid: false,
      error: 'Admin session secret is not configured. Please set ADMIN_SESSION_SECRET in your environment variables.',
    };
  }

  // Check password strength in development
  if (process.env.NODE_ENV === 'development' && password.length < 8) {
    console.warn('⚠️  ADMIN_PASSWORD is weak (less than 8 characters). Use a stronger password in production.');
  }

  // Check secret strength
  if (secret.length < 32) {
    console.warn('⚠️  ADMIN_SESSION_SECRET is weak (less than 32 characters). Generate a stronger secret for production.');
  }

  return { isValid: true };
}

/**
 * Run all validations on startup (development mode)
 */
export function runStartupValidation() {
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔍 Validating environment configuration...\n");

    const result = validateEnv(false); // Don't throw in development

    if (result.isValid) {
      console.log("✅ All required environment variables are set\n");
    } else {
      console.warn(
        "⚠️  Some required environment variables are missing. Related features may not work.\n"
      );
    }

    if (MERCH_ENABLED) {
      const shopifyResult = validateShopifyConfig();
      if (!shopifyResult.isValid) {
        console.warn(`⚠️  Shopify: ${shopifyResult.error}`);
      }
    }

    const resendResult = validateResendConfig();
    if (!resendResult.isValid) {
      console.warn(`⚠️  Resend: ${resendResult.error}`);
    }

    const adminResult = validateAdminConfig();
    if (!adminResult.isValid) {
      console.warn(`⚠️  Admin: ${adminResult.error}`);
    }
  }
}



