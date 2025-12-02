#!/usr/bin/env npx tsx
/**
 * Comprehensive Merch System Test Suite
 * 
 * This script performs thorough testing of all critical paths:
 * - Shopify API connectivity
 * - Product data integrity
 * - Cart operations (create, add, update, remove)
 * - Checkout flow
 * - Webhook endpoints
 * - Error handling
 * - Edge cases
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
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
  console.warn('⚠️  Could not load .env.local file');
}

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration?: number;
  error?: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, message: string, error?: string) {
  results.push({ name, passed, message, error });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (message) console.log(`   ${message}`);
  if (error) console.log(`   Error: ${error}`);
  console.log('');
}

async function testShopifyConnection() {
  console.log('━'.repeat(80));
  console.log('TEST SUITE 1: SHOPIFY CONNECTIVITY');
  console.log('━'.repeat(80));
  console.log('');

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  // Test 1: Environment Variables
  if (!domain || !token) {
    logTest('Environment Variables', false, 'Missing Shopify credentials');
    return false;
  }
  logTest('Environment Variables', true, 'Shopify credentials configured');

  // Test 2: API Connectivity
  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: '{ shop { name } }',
      }),
    });

    if (!response.ok) {
      logTest('API Connectivity', false, `HTTP ${response.status}`, response.statusText);
      return false;
    }

    const data = await response.json();
    logTest('API Connectivity', true, `Connected to shop: ${data.data?.shop?.name || 'Unknown'}`);
  } catch (error: any) {
    logTest('API Connectivity', false, 'Failed to connect', error.message);
    return false;
  }

  return true;
}

async function testProductDataIntegrity() {
  console.log('━'.repeat(80));
  console.log('TEST SUITE 2: PRODUCT DATA INTEGRITY');
  console.log('━'.repeat(80));
  console.log('');

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token!,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    const products = data.data?.products?.edges || [];

    // Test 1: Product Count
    if (products.length === 0) {
      logTest('Product Count', false, 'No products found');
      return false;
    }
    logTest('Product Count', true, `Found ${products.length} products`);

    // Test 2: Product Data Completeness
    let hasIncompleteProducts = false;
    let incompleteCount = 0;
    
    for (const edge of products) {
      const product = edge.node;
      if (!product.title || !product.handle || !product.priceRange) {
        hasIncompleteProducts = true;
        incompleteCount++;
      }
    }

    if (hasIncompleteProducts) {
      logTest('Product Data Completeness', false, `${incompleteCount} products have incomplete data`);
    } else {
      logTest('Product Data Completeness', true, 'All products have required fields');
    }

    // Test 3: Variant Availability
    let totalVariants = 0;
    let availableVariants = 0;

    for (const edge of products) {
      const variants = edge.node.variants.edges;
      totalVariants += variants.length;
      availableVariants += variants.filter((v: any) => v.node.availableForSale).length;
    }

    logTest('Variant Availability', true, `${availableVariants}/${totalVariants} variants available for sale`);

    // Test 4: Image Availability
    let productsWithImages = 0;
    for (const edge of products) {
      if (edge.node.images.edges.length > 0) {
        productsWithImages++;
      }
    }

    const imagePercentage = Math.round((productsWithImages / products.length) * 100);
    logTest('Product Images', imagePercentage === 100, `${productsWithImages}/${products.length} products (${imagePercentage}%) have images`);

    // Test 5: SKU Format (Printful check)
    let printfulSkuCount = 0;
    for (const edge of products) {
      const variants = edge.node.variants.edges;
      for (const variant of variants) {
        if (variant.node.sku && /^\d+_\d+$/.test(variant.node.sku)) {
          printfulSkuCount++;
        }
      }
    }

    const skuPercentage = Math.round((printfulSkuCount / totalVariants) * 100);
    logTest('Printful SKU Format', skuPercentage > 80, `${printfulSkuCount}/${totalVariants} variants (${skuPercentage}%) have Printful-style SKUs`);

    // Test 6: Price Validation
    let invalidPrices = 0;
    for (const edge of products) {
      const price = parseFloat(edge.node.priceRange.minVariantPrice.amount);
      if (isNaN(price) || price <= 0) {
        invalidPrices++;
      }
    }

    if (invalidPrices > 0) {
      logTest('Price Validation', false, `${invalidPrices} products have invalid prices`);
    } else {
      logTest('Price Validation', true, 'All products have valid prices');
    }

    return true;
  } catch (error: any) {
    logTest('Product Data Fetch', false, 'Failed to fetch product data', error.message);
    return false;
  }
}

async function testCartOperations() {
  console.log('━'.repeat(80));
  console.log('TEST SUITE 3: CART OPERATIONS');
  console.log('━'.repeat(80));
  console.log('');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Get a test product variant ID
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  let testVariantId: string;
  let cartId: string;
  let lineId: string;

  try {
    // Get a product variant for testing
    const productResponse = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token!,
      },
      body: JSON.stringify({
        query: `{
          products(first: 1) {
            edges {
              node {
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                    }
                  }
                }
              }
            }
          }
        }`,
      }),
    });

    const productData = await productResponse.json();
    testVariantId = productData.data.products.edges[0].node.variants.edges[0].node.id;

    if (!testVariantId) {
      logTest('Test Setup', false, 'Could not find test product variant');
      return false;
    }
    logTest('Test Setup', true, `Using test variant: ${testVariantId.split('/').pop()}`);

  } catch (error: any) {
    logTest('Test Setup', false, 'Failed to get test product', error.message);
    return false;
  }

  // Test 1: Create Cart
  try {
    const createResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      logTest('Create Cart', false, `HTTP ${createResponse.status}`, errorText);
      return false;
    }

    const cartData = await createResponse.json();
    cartId = cartData.id;

    if (!cartId) {
      logTest('Create Cart', false, 'No cart ID returned');
      return false;
    }

    logTest('Create Cart', true, `Cart created: ${cartId.substring(0, 30)}...`);
  } catch (error: any) {
    logTest('Create Cart', false, 'Failed to create cart', error.message);
    return false;
  }

  // Test 2: Add Item to Cart
  try {
    const addResponse = await fetch(`${baseUrl}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId,
        variantId: testVariantId,
        quantity: 2,
      }),
    });

    if (!addResponse.ok) {
      const errorText = await addResponse.text();
      logTest('Add to Cart', false, `HTTP ${addResponse.status}`, errorText);
      return false;
    }

    const addData = await addResponse.json();
    
    if (!addData.items || addData.items.length === 0) {
      logTest('Add to Cart', false, 'Item not added to cart');
      return false;
    }

    lineId = addData.items[0].id;
    logTest('Add to Cart', true, `Added item (qty: ${addData.items[0].quantity}), total items: ${addData.totalQuantity}`);
  } catch (error: any) {
    logTest('Add to Cart', false, 'Failed to add item', error.message);
    return false;
  }

  // Test 3: Get Cart
  try {
    const getResponse = await fetch(`${baseUrl}/api/cart?cartId=${encodeURIComponent(cartId)}`);

    if (!getResponse.ok) {
      logTest('Get Cart', false, `HTTP ${getResponse.status}`);
      return false;
    }

    const getData = await getResponse.json();
    
    if (getData.totalQuantity !== 2) {
      logTest('Get Cart', false, `Expected 2 items, got ${getData.totalQuantity}`);
      return false;
    }

    logTest('Get Cart', true, `Retrieved cart with ${getData.items.length} line items (${getData.totalQuantity} total items)`);
  } catch (error: any) {
    logTest('Get Cart', false, 'Failed to get cart', error.message);
    return false;
  }

  // Test 4: Update Cart Item
  try {
    const updateResponse = await fetch(`${baseUrl}/api/cart/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId,
        lineId,
        quantity: 3,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      logTest('Update Cart', false, `HTTP ${updateResponse.status}`, errorText);
      return false;
    }

    const updateData = await updateResponse.json();
    
    if (updateData.totalQuantity !== 3) {
      logTest('Update Cart', false, `Expected 3 items, got ${updateData.totalQuantity}`);
      return false;
    }

    logTest('Update Cart', true, `Updated quantity to 3, total: ${updateData.totalQuantity}`);
  } catch (error: any) {
    logTest('Update Cart', false, 'Failed to update cart', error.message);
    return false;
  }

  // Test 5: Remove from Cart
  try {
    const removeResponse = await fetch(`${baseUrl}/api/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId,
        lineId,
      }),
    });

    if (!removeResponse.ok) {
      const errorText = await removeResponse.text();
      logTest('Remove from Cart', false, `HTTP ${removeResponse.status}`, errorText);
      return false;
    }

    const removeData = await removeResponse.json();
    
    if (removeData.totalQuantity !== 0) {
      logTest('Remove from Cart', false, `Expected 0 items, got ${removeData.totalQuantity}`);
      return false;
    }

    logTest('Remove from Cart', true, `Removed item, cart now empty`);
  } catch (error: any) {
    logTest('Remove from Cart', false, 'Failed to remove item', error.message);
    return false;
  }

  // Test 6: Checkout URL Generation
  try {
    // Add item back for checkout test
    await fetch(`${baseUrl}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId,
        variantId: testVariantId,
        quantity: 1,
      }),
    });

    const checkoutResponse = await fetch(`${baseUrl}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId }),
    });

    if (!checkoutResponse.ok) {
      logTest('Checkout URL', false, `HTTP ${checkoutResponse.status}`);
      return false;
    }

    const checkoutData = await checkoutResponse.json();
    
    if (!checkoutData.checkoutUrl) {
      logTest('Checkout URL', false, 'No checkout URL returned');
      return false;
    }

    const isValidUrl = checkoutData.checkoutUrl.startsWith('https://') && 
                       checkoutData.checkoutUrl.includes('myshopify.com');
    
    if (!isValidUrl) {
      logTest('Checkout URL', false, 'Invalid checkout URL format');
      return false;
    }

    logTest('Checkout URL', true, `Valid Shopify checkout URL generated`);
  } catch (error: any) {
    logTest('Checkout URL', false, 'Failed to generate checkout URL', error.message);
    return false;
  }

  return true;
}

async function testErrorHandling() {
  console.log('━'.repeat(80));
  console.log('TEST SUITE 4: ERROR HANDLING');
  console.log('━'.repeat(80));
  console.log('');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Test 1: Invalid Cart ID
  try {
    const response = await fetch(`${baseUrl}/api/cart?cartId=invalid_cart_id`);
    
    if (response.status === 404 || response.status === 400) {
      logTest('Invalid Cart ID Handling', true, 'Properly returns error for invalid cart');
    } else {
      logTest('Invalid Cart ID Handling', false, `Expected 404/400, got ${response.status}`);
    }
  } catch (error: any) {
    logTest('Invalid Cart ID Handling', false, 'Failed to test', error.message);
  }

  // Test 2: Missing Required Parameters
  try {
    const response = await fetch(`${baseUrl}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: 'test' }), // Missing variantId and quantity
    });

    if (response.status === 400) {
      logTest('Missing Parameters', true, 'Properly validates required parameters');
    } else {
      logTest('Missing Parameters', false, `Expected 400, got ${response.status}`);
    }
  } catch (error: any) {
    logTest('Missing Parameters', false, 'Failed to test', error.message);
  }

  // Test 3: Invalid Variant ID
  try {
    // First create a cart
    const createResponse = await fetch(`${baseUrl}/api/cart`, { method: 'POST' });
    const cartData = await createResponse.json();

    const response = await fetch(`${baseUrl}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId: cartData.id,
        variantId: 'gid://shopify/ProductVariant/99999999999',
        quantity: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        logTest('Invalid Variant ID', true, 'Properly handles invalid variant ID');
      } else {
        logTest('Invalid Variant ID', false, 'Error message not returned');
      }
    } else {
      logTest('Invalid Variant ID', false, 'Should have returned error');
    }
  } catch (error: any) {
    logTest('Invalid Variant ID', false, 'Failed to test', error.message);
  }

  return true;
}

async function testPrintfulConnection() {
  console.log('━'.repeat(80));
  console.log('TEST SUITE 5: PRINTFUL INTEGRATION');
  console.log('━'.repeat(80));
  console.log('');

  const apiKey = process.env.PRINTFUL_API_KEY;

  if (!apiKey) {
    logTest('Printful API Key', false, 'PRINTFUL_API_KEY not configured');
    return false;
  }
  logTest('Printful API Key', true, 'API key configured');

  // Test API Connection
  try {
    const response = await fetch('https://api.printful.com/oauth/scopes', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      logTest('Printful API Connection', false, `HTTP ${response.status}`);
      return false;
    }

    const data = await response.json();
    const scopes = data.result?.scopes || [];
    
    const requiredScopes = ['orders', 'sync_products', 'webhooks'];
    const hasAllScopes = requiredScopes.every(required => 
      scopes.some((s: any) => s.scope === required || s.scope.startsWith(required))
    );

    if (!hasAllScopes) {
      logTest('Printful API Scopes', false, 'Missing required API scopes');
    } else {
      logTest('Printful API Scopes', true, `All required scopes present (${scopes.length} total)`);
    }
  } catch (error: any) {
    logTest('Printful API Connection', false, 'Failed to connect', error.message);
    return false;
  }

  return true;
}

async function testWebhookEndpoints() {
  console.log('━'.repeat(80));
  console.log('TEST SUITE 6: WEBHOOK ENDPOINTS');
  console.log('━'.repeat(80));
  console.log('');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Test 1: Printful Webhook Endpoint Exists
  try {
    const response = await fetch(`${baseUrl}/api/webhooks/printful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });

    // Webhook should respond (even if signature fails)
    if (response.status === 401 || response.status === 400 || response.status === 200) {
      logTest('Printful Webhook Endpoint', true, `Endpoint responding (${response.status})`);
    } else {
      logTest('Printful Webhook Endpoint', false, `Unexpected status: ${response.status}`);
    }
  } catch (error: any) {
    logTest('Printful Webhook Endpoint', false, 'Endpoint not accessible', error.message);
  }

  // Test 2: Shopify Webhook Endpoint Exists
  try {
    const response = await fetch(`${baseUrl}/api/webhooks/shopify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });

    if (response.status === 401 || response.status === 400 || response.status === 200) {
      logTest('Shopify Webhook Endpoint', true, `Endpoint responding (${response.status})`);
    } else {
      logTest('Shopify Webhook Endpoint', false, `Unexpected status: ${response.status}`);
    }
  } catch (error: any) {
    logTest('Shopify Webhook Endpoint', false, 'Endpoint not accessible', error.message);
  }

  return true;
}

async function main() {
  console.log('');
  console.log('═'.repeat(80));
  console.log('  OF BLOOD - COMPREHENSIVE MERCH SYSTEM TEST SUITE');
  console.log('═'.repeat(80));
  console.log('');
  console.log('🧪 Running complete system validation...');
  console.log('');

  const startTime = Date.now();

  // Run all test suites
  await testShopifyConnection();
  await testProductDataIntegrity();
  await testCartOperations();
  await testErrorHandling();
  await testPrintfulConnection();
  await testWebhookEndpoints();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Summary
  console.log('═'.repeat(80));
  console.log('  TEST SUMMARY');
  console.log('═'.repeat(80));
  console.log('');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  const passRate = Math.round((passed / total) * 100);

  console.log(`Tests Run: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log(`Duration: ${duration}s`);
  console.log('');

  if (failed > 0) {
    console.log('━'.repeat(80));
    console.log('FAILED TESTS:');
    console.log('━'.repeat(80));
    results.filter(r => !r.passed).forEach(r => {
      console.log(`❌ ${r.name}`);
      console.log(`   ${r.message}`);
      if (r.error) console.log(`   Error: ${r.error}`);
      console.log('');
    });
  }

  console.log('═'.repeat(80));
  
  if (passRate === 100) {
    console.log('🎉 ALL TESTS PASSED! Your merch system is ready for production.');
  } else if (passRate >= 90) {
    console.log('⚠️  MOSTLY PASSING - Review failed tests before deploying.');
  } else if (passRate >= 75) {
    console.log('⚠️  SOME ISSUES DETECTED - Fix critical failures before deploying.');
  } else {
    console.log('❌ MULTIPLE FAILURES - System needs attention before going live.');
  }
  
  console.log('═'.repeat(80));
  console.log('');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);

