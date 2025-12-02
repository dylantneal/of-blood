#!/usr/bin/env tsx
/**
 * Integration Setup Diagnostic Tool
 * 
 * This script checks your current Shopify + Printful integration setup
 * and tells you exactly what you have and what you need.
 */

// Load environment variables manually
import { readFileSync } from 'fs';
import { join } from 'path';

try {
  const envPath = join(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} catch (error) {
  console.warn('Could not load .env.local file');
}

interface EnvCheck {
  name: string;
  key: string;
  required: boolean;
  purpose: string;
  hasValue: boolean;
}

interface IntegrationMode {
  name: string;
  description: string;
  indicators: string[];
  detected: boolean;
}

async function checkEnvironmentVariables(): Promise<EnvCheck[]> {
  const checks: Omit<EnvCheck, 'hasValue'>[] = [
    {
      name: 'Shopify Store Domain',
      key: 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
      required: true,
      purpose: 'Connect to your Shopify store',
    },
    {
      name: 'Shopify Storefront Token',
      key: 'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
      required: true,
      purpose: 'Read products and create carts',
    },
    {
      name: 'Shopify Admin Token',
      key: 'SHOPIFY_ADMIN_ACCESS_TOKEN',
      required: false,
      purpose: 'Read product metafields (only for custom integration)',
    },
    {
      name: 'Shopify Webhook Secret',
      key: 'SHOPIFY_WEBHOOK_SECRET',
      required: false,
      purpose: 'Verify order webhooks (only for custom integration)',
    },
    {
      name: 'Printful API Key',
      key: 'PRINTFUL_API_KEY',
      required: true,
      purpose: 'Access Printful API',
    },
    {
      name: 'Printful Webhook Secret',
      key: 'PRINTFUL_WEBHOOK_SECRET',
      required: false,
      purpose: 'Verify shipping webhooks (recommended)',
    },
    {
      name: 'Resend API Key',
      key: 'RESEND_API_KEY',
      required: true,
      purpose: 'Send customer emails',
    },
  ];

  return checks.map(check => ({
    ...check,
    hasValue: !!process.env[check.key] && process.env[check.key]!.length > 0,
  }));
}

async function detectIntegrationMode(): Promise<IntegrationMode[]> {
  const modes: IntegrationMode[] = [
    {
      name: 'Printful Native Integration',
      description: 'Using Printful\'s built-in Shopify app',
      indicators: [
        'Products created in Printful and synced to Shopify',
        'Orders automatically flow from Shopify to Printful',
        'No custom webhooks needed',
      ],
      detected: false,
    },
    {
      name: 'Custom API Integration',
      description: 'Using custom webhooks and API calls',
      indicators: [
        'Products created in Shopify first',
        'Custom webhook handler for order processing',
        'Manual variant mapping via metafields',
      ],
      detected: false,
    },
  ];

  // Detect based on environment variables
  const hasAdminToken = !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const hasWebhookSecret = !!process.env.SHOPIFY_WEBHOOK_SECRET;

  if (hasAdminToken && hasWebhookSecret) {
    modes[1].detected = true; // Custom integration
  } else {
    modes[0].detected = true; // Likely native integration
  }

  return modes;
}

async function checkShopifyProducts() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return { success: false, count: 0, error: 'Missing credentials' };
  }

  try {
    const query = `
      query {
        products(first: 50) {
          edges {
            node {
              id
              title
              vendor
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return { success: false, count: 0, error: response.statusText };
    }

    const data = await response.json();
    const products = data.data?.products?.edges || [];
    const printfulProducts = products.filter((p: any) => 
      p.node.vendor?.toLowerCase() === 'printful'
    );

    return {
      success: true,
      count: products.length,
      printfulCount: printfulProducts.length,
      hasPrintfulProducts: printfulProducts.length > 0,
    };
  } catch (error: any) {
    return { success: false, count: 0, error: error.message };
  }
}

async function main() {
  console.log('');
  console.log('═'.repeat(80));
  console.log('  SHOPIFY + PRINTFUL INTEGRATION DIAGNOSTIC');
  console.log('═'.repeat(80));
  console.log('');

  // Check environment variables
  console.log('📋 ENVIRONMENT VARIABLES');
  console.log('─'.repeat(80));
  const envChecks = await checkEnvironmentVariables();
  
  for (const check of envChecks) {
    const status = check.hasValue ? '✅' : (check.required ? '❌' : '⚪');
    const label = check.required ? 'REQUIRED' : 'OPTIONAL';
    console.log(`${status} ${check.name} (${label})`);
    console.log(`   Purpose: ${check.purpose}`);
    console.log(`   Status: ${check.hasValue ? 'Configured' : 'Not configured'}`);
    console.log('');
  }

  // Check for products
  console.log('─'.repeat(80));
  console.log('🛍️  SHOPIFY PRODUCTS');
  console.log('─'.repeat(80));
  const productCheck = await checkShopifyProducts();
  
  if (productCheck.success) {
    console.log(`✅ Found ${productCheck.count} products in Shopify`);
    if (productCheck.hasPrintfulProducts) {
      console.log(`✅ ${productCheck.printfulCount} products have vendor "Printful"`);
      console.log('   → This indicates Printful\'s native integration is likely active');
    } else {
      console.log('⚪ No products have vendor "Printful"');
      console.log('   → Products may be created manually or via custom integration');
    }
  } else {
    console.log(`❌ Could not fetch products: ${productCheck.error}`);
  }
  console.log('');

  // Detect integration mode
  console.log('─'.repeat(80));
  console.log('🔍 INTEGRATION MODE DETECTION');
  console.log('─'.repeat(80));
  const modes = await detectIntegrationMode();
  
  for (const mode of modes) {
    if (mode.detected) {
      console.log(`✅ ${mode.name}`);
      console.log(`   ${mode.description}`);
      console.log('');
      console.log('   Characteristics:');
      mode.indicators.forEach(indicator => {
        console.log(`   • ${indicator}`);
      });
    }
  }
  console.log('');

  // Recommendations
  console.log('─'.repeat(80));
  console.log('💡 RECOMMENDATIONS');
  console.log('─'.repeat(80));
  console.log('');

  const hasNativeIntegration = modes[0].detected;
  const hasCustomIntegration = modes[1].detected;

  if (hasNativeIntegration && !hasCustomIntegration) {
    console.log('✨ You appear to be using Printful\'s NATIVE Shopify integration.');
    console.log('');
    console.log('What this means:');
    console.log('  ✅ Orders automatically sync from Shopify → Printful (via Printful app)');
    console.log('  ✅ No custom order webhook needed');
    console.log('  ✅ No variant mapping needed');
    console.log('');
    console.log('What you should do:');
    console.log('  1. Keep using your current setup (it\'s simpler!)');
    console.log('  2. Optionally: Set up Printful webhook for shipping notifications');
    console.log('  3. Remove the incomplete custom webhook handler at:');
    console.log('     app/api/webhooks/shopify/orders-paid/route.ts');
    console.log('');
    console.log('Your .env.local should have:');
    console.log('  • NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ✅');
    console.log('  • NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ✅');
    console.log('  • PRINTFUL_API_KEY ✅');
    console.log('  • PRINTFUL_WEBHOOK_SECRET (optional)');
    console.log('  • RESEND_API_KEY ✅');
  } else if (hasCustomIntegration) {
    console.log('🔧 You appear to be setting up a CUSTOM API integration.');
    console.log('');
    console.log('What you still need:');
    console.log('  1. Complete the webhook handler at:');
    console.log('     app/api/webhooks/shopify/orders-paid/route.ts');
    console.log('  2. Add variant metafields for all products');
    console.log('  3. Set up Shopify webhook in admin');
    console.log('  4. Test the complete order flow');
  }

  console.log('');
  console.log('═'.repeat(80));
  console.log('');
}

main().catch(console.error);

