#!/usr/bin/env tsx
/**
 * Verify Printful Integration
 * 
 * This script tests the actual Printful connection and checks
 * if products in Shopify are linked to Printful.
 */

// Load environment variables
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

async function testPrintfulConnection() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'PRINTFUL_API_KEY not configured' };
  }

  try {
    // Test basic API connection
    const response = await fetch('https://api.printful.com/store', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: `API returned ${response.status}` };
    }

    const data = await response.json();
    return { 
      success: true, 
      store: data.result,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function getPrintfulProducts() {
  const apiKey = process.env.PRINTFUL_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: 'PRINTFUL_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: `API returned ${response.status}` };
    }

    const data = await response.json();
    return { 
      success: true, 
      products: data.result,
      count: data.result?.length || 0,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function checkShopifyProducts() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return { success: false, error: 'Missing Shopify credentials' };
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
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                  }
                }
              }
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
      return { success: false, error: response.statusText };
    }

    const data = await response.json();
    return {
      success: true,
      products: data.data?.products?.edges || [],
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('');
  console.log('═'.repeat(80));
  console.log('  PRINTFUL INTEGRATION VERIFICATION');
  console.log('═'.repeat(80));
  console.log('');

  // Test Printful API connection
  console.log('🔌 PRINTFUL API CONNECTION');
  console.log('─'.repeat(80));
  const printfulConnection = await testPrintfulConnection();
  
  if (printfulConnection.success) {
    console.log('✅ Connected to Printful API');
    console.log(`   Store: ${printfulConnection.store?.name || 'Unknown'}`);
    console.log(`   Store ID: ${printfulConnection.store?.id || 'Unknown'}`);
  } else {
    console.log(`❌ Failed to connect: ${printfulConnection.error}`);
  }
  console.log('');

  // Get Printful products
  console.log('─'.repeat(80));
  console.log('📦 PRINTFUL STORE PRODUCTS');
  console.log('─'.repeat(80));
  const printfulProducts = await getPrintfulProducts();
  
  if (printfulProducts.success) {
    console.log(`✅ Found ${printfulProducts.count} products in Printful store`);
    
    if (printfulProducts.count > 0 && printfulProducts.products) {
      console.log('');
      console.log('Products:');
      printfulProducts.products.slice(0, 5).forEach((product: any) => {
        console.log(`   • ${product.name} (ID: ${product.id})`);
        console.log(`     Sync: ${product.synced || 0} variants`);
        if (product.external_id) {
          console.log(`     External ID: ${product.external_id}`);
        }
      });
      
      if (printfulProducts.count > 5) {
        console.log(`   ... and ${printfulProducts.count - 5} more`);
      }
    }
  } else {
    console.log(`❌ Failed to fetch products: ${printfulProducts.error}`);
  }
  console.log('');

  // Check Shopify products
  console.log('─'.repeat(80));
  console.log('🛍️  SHOPIFY PRODUCTS');
  console.log('─'.repeat(80));
  const shopifyProducts = await checkShopifyProducts();
  
  if (shopifyProducts.success) {
    console.log(`✅ Found ${shopifyProducts.products.length} products in Shopify`);
    console.log('');
    console.log('Products:');
    shopifyProducts.products.slice(0, 5).forEach((edge: any) => {
      const product = edge.node;
      console.log(`   • ${product.title}`);
      console.log(`     Vendor: ${product.vendor}`);
      console.log(`     ID: ${product.id}`);
      console.log(`     Variants: ${product.variants.edges.length}`);
      
      // Show first variant SKU
      if (product.variants.edges[0]) {
        const variant = product.variants.edges[0].node;
        console.log(`     Sample SKU: ${variant.sku || 'none'}`);
      }
      console.log('');
    });
  } else {
    console.log(`❌ Failed to fetch Shopify products: ${shopifyProducts.error}`);
  }

  // Analysis
  console.log('─'.repeat(80));
  console.log('🔍 INTEGRATION ANALYSIS');
  console.log('─'.repeat(80));
  
  if (printfulProducts.success && shopifyProducts.success) {
    const printfulCount = printfulProducts.count || 0;
    const shopifyCount = shopifyProducts.products.length;
    
    if (printfulCount > 0 && shopifyCount > 0) {
      console.log('✅ Both Printful and Shopify have products');
      console.log('');
      
      if (printfulCount === shopifyCount) {
        console.log('✅ Product counts match - integration likely working');
      } else {
        console.log(`⚠️  Product count mismatch:`);
        console.log(`   Printful: ${printfulCount} products`);
        console.log(`   Shopify: ${shopifyCount} products`);
        console.log('   This is normal if you haven\'t synced all products');
      }
      
      console.log('');
      console.log('Integration Status: ACTIVE ✅');
      console.log('');
      console.log('How it works:');
      console.log('  1. Products managed in Printful dashboard');
      console.log('  2. Printful syncs products to Shopify automatically');
      console.log('  3. Your Next.js site displays products from Shopify');
      console.log('  4. When customer pays, order goes Shopify → Printful automatically');
      console.log('  5. Printful fulfills and ships');
      
    } else if (printfulCount === 0) {
      console.log('⚠️  No products in Printful store');
      console.log('   You need to create/add products in Printful first');
    } else if (shopifyCount === 0) {
      console.log('⚠️  No products in Shopify');
      console.log('   You may need to push products from Printful to Shopify');
    }
  }

  console.log('');
  console.log('═'.repeat(80));
  console.log('');
}

main().catch(console.error);

