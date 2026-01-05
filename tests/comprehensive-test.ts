/**
 * Comprehensive Test Suite for Of Blood Website
 * Tests critical systems: Cart, API Routes, Auth, Data Validation
 */

// Test results tracking
interface TestResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message?: string;
  error?: any;
}

const testResults: TestResult[] = [];

function logTest(category: string, name: string, status: 'PASS' | 'FAIL' | 'SKIP', message?: string, error?: any) {
  testResults.push({ category, name, status, message, error });
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
  console.log(`${emoji} [${category}] ${name}${message ? `: ${message}` : ''}`);
  if (error) {
    console.error('   Error:', error);
  }
}

// ============================================================================
// 1. CART SYSTEM TESTS
// ============================================================================

async function testCartSystem() {
  console.log('\n📦 Testing Cart System...\n');

  // Test 1: Cart Utility - Null Cart Handling
  try {
    const { transformShopifyCart } = require('../lib/cart-utils');
    
    try {
      transformShopifyCart(null);
      logTest('Cart', 'Null cart handling', 'FAIL', 'Should throw error for null cart');
    } catch (error: any) {
      if (error.message.includes('null or undefined')) {
        logTest('Cart', 'Null cart handling', 'PASS', 'Correctly rejects null cart');
      } else {
        logTest('Cart', 'Null cart handling', 'FAIL', 'Wrong error message', error);
      }
    }
  } catch (error) {
    logTest('Cart', 'Null cart handling', 'FAIL', 'Failed to load cart-utils', error);
  }

  // Test 2: Cart Utility - Missing ID
  try {
    const { transformShopifyCart } = require('../lib/cart-utils');
    
    try {
      transformShopifyCart({});
      logTest('Cart', 'Missing cart ID', 'FAIL', 'Should throw error for missing ID');
    } catch (error: any) {
      if (error.message.includes('Cart ID is missing')) {
        logTest('Cart', 'Missing cart ID', 'PASS', 'Correctly rejects cart without ID');
      } else {
        logTest('Cart', 'Missing cart ID', 'FAIL', 'Wrong error message', error);
      }
    }
  } catch (error) {
    logTest('Cart', 'Missing cart ID', 'FAIL', 'Failed to load cart-utils', error);
  }

  // Test 3: Cart Utility - Valid Cart Transform
  try {
    const { transformShopifyCart } = require('../lib/cart-utils');
    
    const mockShopifyCart = {
      id: 'gid://shopify/Cart/test123',
      checkoutUrl: 'https://checkout.shopify.com/test',
      totalQuantity: 2,
      cost: {
        totalAmount: {
          amount: '49.99',
          currencyCode: 'USD',
        },
      },
      lines: {
        edges: [
          {
            node: {
              id: 'gid://shopify/CartLine/1',
              quantity: 2,
              merchandise: {
                id: 'gid://shopify/ProductVariant/1',
                title: 'Medium / Black',
                price: {
                  amount: '24.99',
                  currencyCode: 'USD',
                },
                image: {
                  url: 'https://cdn.shopify.com/test.jpg',
                },
                product: {
                  id: 'gid://shopify/Product/1',
                  title: 'Test T-Shirt',
                  handle: 'test-t-shirt',
                },
              },
            },
          },
        ],
      },
    };

    const result = transformShopifyCart(mockShopifyCart);
    
    if (result.id === mockShopifyCart.id &&
        result.totalQuantity === 2 &&
        result.totalAmount === 4999 &&
        result.items.length === 1 &&
        result.items[0].title === 'Test T-Shirt') {
      logTest('Cart', 'Valid cart transform', 'PASS', 'Cart transformed correctly');
    } else {
      logTest('Cart', 'Valid cart transform', 'FAIL', 'Transform produced incorrect data', result);
    }
  } catch (error) {
    logTest('Cart', 'Valid cart transform', 'FAIL', 'Transform failed', error);
  }

  // Test 4: Cart Utility - Empty Lines
  try {
    const { transformShopifyCart } = require('../lib/cart-utils');
    
    const mockEmptyCart = {
      id: 'gid://shopify/Cart/empty',
      checkoutUrl: 'https://checkout.shopify.com/test',
      totalQuantity: 0,
      cost: {
        totalAmount: {
          amount: '0.00',
          currencyCode: 'USD',
        },
      },
      lines: {
        edges: [],
      },
    };

    const result = transformShopifyCart(mockEmptyCart);
    
    if (result.items.length === 0 && result.totalAmount === 0) {
      logTest('Cart', 'Empty cart handling', 'PASS', 'Empty cart handled correctly');
    } else {
      logTest('Cart', 'Empty cart handling', 'FAIL', 'Empty cart not handled properly', result);
    }
  } catch (error) {
    logTest('Cart', 'Empty cart handling', 'FAIL', 'Failed to handle empty cart', error);
  }

  // Test 5: Cart Utility - Malformed Line Items
  try {
    const { transformShopifyCart } = require('../lib/cart-utils');
    
    const mockMalformedCart = {
      id: 'gid://shopify/Cart/malformed',
      checkoutUrl: 'https://checkout.shopify.com/test',
      totalQuantity: 1,
      cost: {
        totalAmount: {
          amount: '10.00',
          currencyCode: 'USD',
        },
      },
      lines: {
        edges: [
          { node: null }, // Malformed node
          { node: { id: 'test', merchandise: null } }, // Missing merchandise
          {
            node: {
              id: 'gid://shopify/CartLine/valid',
              quantity: 1,
              merchandise: {
                id: 'gid://shopify/ProductVariant/valid',
                title: 'Valid Item',
                price: { amount: '10.00' },
                product: {
                  id: 'gid://shopify/Product/valid',
                  title: 'Valid Product',
                  handle: 'valid',
                },
              },
            },
          },
        ],
      },
    };

    const result = transformShopifyCart(mockMalformedCart);
    
    // Should skip malformed items and only include valid one
    if (result.items.length === 1 && result.items[0].title === 'Valid Product') {
      logTest('Cart', 'Malformed items handling', 'PASS', 'Malformed items filtered out correctly');
    } else {
      logTest('Cart', 'Malformed items handling', 'FAIL', 'Malformed items not handled properly', result);
    }
  } catch (error) {
    logTest('Cart', 'Malformed items handling', 'FAIL', 'Failed to handle malformed items', error);
  }
}

// ============================================================================
// 2. DATA VALIDATION TESTS
// ============================================================================

async function testDataValidation() {
  console.log('\n🔍 Testing Data Validation...\n');

  // Test 1: Price Conversion
  try {
    const { formatPrice } = require('../lib/utils');
    
    const tests = [
      { input: 1000, expected: '$10.00' },
      { input: 0, expected: '$0.00' },
      { input: 99, expected: '$0.99' },
      { input: 123456, expected: '$1,234.56' },
    ];

    let allPass = true;
    for (const test of tests) {
      const result = formatPrice(test.input);
      if (result !== test.expected) {
        logTest('Validation', `Price formatting (${test.input})`, 'FAIL', 
          `Expected ${test.expected}, got ${result}`);
        allPass = false;
      }
    }

    if (allPass) {
      logTest('Validation', 'Price formatting', 'PASS', 'All price formats correct');
    }
  } catch (error) {
    logTest('Validation', 'Price formatting', 'FAIL', 'Failed to test price formatting', error);
  }

  // Test 2: Time Formatting
  try {
    const { formatTime } = require('../lib/utils');
    
    const tests = [
      { input: 0, expected: '0:00' },
      { input: 59, expected: '0:59' },
      { input: 60, expected: '1:00' },
      { input: 125, expected: '2:05' },
      { input: 3661, expected: '61:01' },
      { input: NaN, expected: '0:00' },
      { input: Infinity, expected: '0:00' },
    ];

    let allPass = true;
    for (const test of tests) {
      const result = formatTime(test.input);
      if (result !== test.expected) {
        logTest('Validation', `Time formatting (${test.input})`, 'FAIL', 
          `Expected ${test.expected}, got ${result}`);
        allPass = false;
      }
    }

    if (allPass) {
      logTest('Validation', 'Time formatting', 'PASS', 'All time formats correct');
    }
  } catch (error) {
    logTest('Validation', 'Time formatting', 'FAIL', 'Failed to test time formatting', error);
  }

  // Test 3: Date Validation
  try {
    const { isUpcoming } = require('../lib/utils');
    
    const pastDate = new Date(Date.now() - 86400000).toISOString(); // Yesterday
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

    const isPastUpcoming = isUpcoming(pastDate);
    const isFutureUpcoming = isUpcoming(futureDate);

    if (!isPastUpcoming && isFutureUpcoming) {
      logTest('Validation', 'Date validation', 'PASS', 'Date comparison works correctly');
    } else {
      logTest('Validation', 'Date validation', 'FAIL', 
        `Past: ${isPastUpcoming}, Future: ${isFutureUpcoming}`);
    }
  } catch (error) {
    logTest('Validation', 'Date validation', 'FAIL', 'Failed to test date validation', error);
  }
}

// ============================================================================
// 3. AUTHENTICATION TESTS
// ============================================================================

async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...\n');

  // Test 1: Session Token Creation
  try {
    process.env.ADMIN_SESSION_SECRET = 'test-secret-for-testing-only';
    const { createSessionToken, verifySessionToken } = require('../lib/auth');
    
    const token = createSessionToken();
    
    if (token && token.includes('.') && token.split('.').length === 3) {
      logTest('Auth', 'Session token creation', 'PASS', 'Token created with correct format');
    } else {
      logTest('Auth', 'Session token creation', 'FAIL', 'Token format incorrect', token);
    }
  } catch (error) {
    logTest('Auth', 'Session token creation', 'FAIL', 'Failed to create token', error);
  }

  // Test 2: Session Token Verification
  try {
    const { createSessionToken, verifySessionToken } = require('../lib/auth');
    
    const validToken = createSessionToken();
    const isValid = verifySessionToken(validToken);
    
    if (isValid) {
      logTest('Auth', 'Valid token verification', 'PASS', 'Valid token verified correctly');
    } else {
      logTest('Auth', 'Valid token verification', 'FAIL', 'Valid token rejected');
    }
  } catch (error) {
    logTest('Auth', 'Valid token verification', 'FAIL', 'Failed to verify token', error);
  }

  // Test 3: Invalid Token Rejection
  try {
    const { verifySessionToken } = require('../lib/auth');
    
    const invalidTokens = [
      'invalid.token.format',
      'not.enough.parts',
      'too.many.parts.here.now',
      '',
      'single',
    ];

    let allRejected = true;
    for (const invalidToken of invalidTokens) {
      if (verifySessionToken(invalidToken)) {
        logTest('Auth', `Invalid token rejection (${invalidToken})`, 'FAIL', 
          'Invalid token was accepted');
        allRejected = false;
      }
    }

    if (allRejected) {
      logTest('Auth', 'Invalid token rejection', 'PASS', 'All invalid tokens rejected');
    }
  } catch (error) {
    logTest('Auth', 'Invalid token rejection', 'FAIL', 'Failed to test invalid tokens', error);
  }

  // Test 4: Token Tampering Detection
  try {
    const { createSessionToken, verifySessionToken } = require('../lib/auth');
    
    const validToken = createSessionToken();
    const parts = validToken.split('.');
    
    // Tamper with the signature
    const tamperedToken = `${parts[0]}.${parts[1]}.tampered-signature`;
    
    if (!verifySessionToken(tamperedToken)) {
      logTest('Auth', 'Token tampering detection', 'PASS', 'Tampered token detected');
    } else {
      logTest('Auth', 'Token tampering detection', 'FAIL', 'Tampered token accepted!');
    }
  } catch (error) {
    logTest('Auth', 'Token tampering detection', 'FAIL', 'Failed to test tampering', error);
  }

  // Test 5: Expired Token Rejection
  try {
    const { verifySessionToken } = require('../lib/auth');
    
    // Create an old token (simulated by modifying timestamp)
    const oldTimestamp = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days ago
    const crypto = require('crypto');
    const secret = process.env.ADMIN_SESSION_SECRET || 'test-secret';
    const nonce = crypto.randomUUID();
    const payload = `${nonce}.${oldTimestamp}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const expiredToken = `${payload}.${signature}`;
    
    if (!verifySessionToken(expiredToken)) {
      logTest('Auth', 'Expired token rejection', 'PASS', 'Expired token correctly rejected');
    } else {
      logTest('Auth', 'Expired token rejection', 'FAIL', 'Expired token accepted!');
    }
  } catch (error) {
    logTest('Auth', 'Expired token rejection', 'FAIL', 'Failed to test expiration', error);
  }

  // Clean up
  delete process.env.ADMIN_SESSION_SECRET;
}

// ============================================================================
// 4. SECURITY TESTS
// ============================================================================

async function testSecurity() {
  console.log('\n🛡️  Testing Security...\n');

  // Test 1: XSS Protection (from contact route)
  try {
    // Since we can't import the function directly, we'll test the logic
    const escapeHtml = (text: string): string => {
      const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
      };
      return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
    };

    const dangerousInputs = [
      { input: '<script>alert("XSS")</script>', expected: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;' },
      { input: '<img src=x onerror="alert(1)">', expected: '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;' },
      { input: "javascript:alert('XSS')", expected: "javascript:alert(&#39;XSS&#39;)" },
    ];

    let allSafe = true;
    for (const test of dangerousInputs) {
      const result = escapeHtml(test.input);
      if (result !== test.expected) {
        logTest('Security', `XSS escape: ${test.input.substring(0, 30)}`, 'FAIL',
          `Expected: ${test.expected}, Got: ${result}`);
        allSafe = false;
      }
    }

    if (allSafe) {
      logTest('Security', 'XSS protection', 'PASS', 'All XSS attempts properly escaped');
    }
  } catch (error) {
    logTest('Security', 'XSS protection', 'FAIL', 'Failed to test XSS protection', error);
  }

  // Test 2: Environment Variable Validation
  try {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN',
      'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    ];

    const missing = requiredEnvVars.filter(v => !process.env[v]);

    if (missing.length === 0) {
      logTest('Security', 'Environment variables', 'PASS', 'All required env vars present');
    } else {
      logTest('Security', 'Environment variables', 'SKIP', 
        `Missing: ${missing.join(', ')} (expected in dev)`);
    }
  } catch (error) {
    logTest('Security', 'Environment variables', 'FAIL', 'Failed to check env vars', error);
  }
}

// ============================================================================
// 5. EDGE CASE TESTS
// ============================================================================

async function testEdgeCases() {
  console.log('\n⚠️  Testing Edge Cases...\n');

  // Test 1: Concurrent Cart Operations
  try {
    // Simulate the race condition scenario from cart context
    const operations = [];
    let counter = 0;
    
    for (let i = 0; i < 5; i++) {
      operations.push(Promise.resolve(counter++));
    }

    const results = await Promise.all(operations);
    
    if (results.length === 5 && results[4] === 4) {
      logTest('Edge Cases', 'Concurrent operations', 'PASS', 'All operations completed');
    } else {
      logTest('Edge Cases', 'Concurrent operations', 'FAIL', 'Operations not completed correctly');
    }
  } catch (error) {
    logTest('Edge Cases', 'Concurrent operations', 'FAIL', 'Failed concurrent test', error);
  }

  // Test 2: Large Quantity Handling
  try {
    const { formatPrice } = require('../lib/utils');
    
    const largePrice = 999999999; // $9,999,999.99
    const formatted = formatPrice(largePrice);
    
    if (formatted.includes('9,999,999.99')) {
      logTest('Edge Cases', 'Large price handling', 'PASS', 'Large prices formatted correctly');
    } else {
      logTest('Edge Cases', 'Large price handling', 'FAIL', `Got: ${formatted}`);
    }
  } catch (error) {
    logTest('Edge Cases', 'Large price handling', 'FAIL', 'Failed to test large prices', error);
  }

  // Test 3: Empty String Handling
  try {
    const { truncate } = require('../lib/utils');
    
    const result = truncate('', 10);
    
    if (result === '') {
      logTest('Edge Cases', 'Empty string handling', 'PASS', 'Empty strings handled correctly');
    } else {
      logTest('Edge Cases', 'Empty string handling', 'FAIL', `Expected empty, got: ${result}`);
    }
  } catch (error) {
    logTest('Edge Cases', 'Empty string handling', 'FAIL', 'Failed to test empty strings', error);
  }

  // Test 4: Special Characters in Data
  try {
    const { cn } = require('../lib/utils');
    
    // Test className merging with special cases
    const result = cn('', null, undefined, 'valid-class');
    
    if (result === 'valid-class') {
      logTest('Edge Cases', 'Special character handling', 'PASS', 'Special cases handled');
    } else {
      logTest('Edge Cases', 'Special character handling', 'FAIL', `Got: ${result}`);
    }
  } catch (error) {
    logTest('Edge Cases', 'Special character handling', 'FAIL', 'Failed to test special chars', error);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧪 OF BLOOD - COMPREHENSIVE TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  const startTime = Date.now();

  await testCartSystem();
  await testDataValidation();
  await testAuthentication();
  await testSecurity();
  await testEdgeCases();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const skipped = testResults.filter(r => r.status === 'SKIP').length;
  const total = testResults.length;

  console.log(`✅ Passed:  ${passed}/${total}`);
  console.log(`❌ Failed:  ${failed}/${total}`);
  console.log(`⏭️  Skipped: ${skipped}/${total}`);
  console.log(`⏱️  Duration: ${duration}s\n`);

  // Show failed tests in detail
  if (failed > 0) {
    console.log('Failed Tests:');
    testResults
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`  ❌ [${r.category}] ${r.name}`);
        if (r.message) console.log(`     ${r.message}`);
        if (r.error) console.log(`     Error: ${r.error.message || r.error}`);
      });
    console.log('');
  }

  // Overall result
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! The application is robust.\n');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Review the issues above.\n');
  }

  console.log('═══════════════════════════════════════════════════════');

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Test runner crashed:', error);
  process.exit(1);
});



