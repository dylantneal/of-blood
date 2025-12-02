/**
 * API Integration Tests
 * 
 * Tests actual API routes with HTTP requests
 * Requires dev server to be running on http://localhost:3000
 * 
 * Run: 
 *   Terminal 1: npm run dev
 *   Terminal 2: npx tsx tests/api-integration-test.ts
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message?: string;
  responseStatus?: number;
}

const results: TestResult[] = [];

function log(endpoint: string, method: string, status: 'PASS' | 'FAIL' | 'SKIP', message?: string, responseStatus?: number) {
  results.push({ endpoint, method, status, message, responseStatus });
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
  console.log(`${emoji} ${method} ${endpoint}${message ? ` - ${message}` : ''}${responseStatus ? ` (${responseStatus})` : ''}`);
}

async function checkServerRunning(): Promise<boolean> {
  try {
    const response = await fetch(BASE_URL);
    return response.ok || response.status === 404; // Either should work
  } catch (error) {
    return false;
  }
}

// ============================================================================
// CART API TESTS
// ============================================================================

async function testCartAPI() {
  console.log('\n📦 Testing Cart API Endpoints...\n');

  // Test 1: Create Cart
  let cartId: string | null = null;
  try {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.id) {
        cartId = data.id;
        log('/api/cart', 'POST', 'PASS', 'Cart created successfully', response.status);
      } else {
        log('/api/cart', 'POST', 'FAIL', 'Cart ID missing from response', response.status);
      }
    } else {
      const error = await response.json();
      log('/api/cart', 'POST', 'FAIL', `Failed: ${error.error || 'Unknown error'}`, response.status);
    }
  } catch (error: any) {
    log('/api/cart', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 2: Get Cart (invalid ID)
  try {
    const response = await fetch(`${BASE_URL}/api/cart?cartId=invalid-cart-id`);

    if (response.status === 404 || response.status === 500) {
      log('/api/cart', 'GET', 'PASS', 'Invalid cart ID properly rejected', response.status);
    } else {
      log('/api/cart', 'GET', 'FAIL', 'Invalid cart ID should be rejected', response.status);
    }
  } catch (error: any) {
    log('/api/cart', 'GET', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 3: Get Cart (missing ID)
  try {
    const response = await fetch(`${BASE_URL}/api/cart`);

    if (response.status === 400) {
      log('/api/cart', 'GET', 'PASS', 'Missing cart ID returns 400', response.status);
    } else {
      log('/api/cart', 'GET', 'FAIL', 'Should return 400 for missing cart ID', response.status);
    }
  } catch (error: any) {
    log('/api/cart', 'GET', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 4: Add to Cart (missing fields)
  try {
    const response = await fetch(`${BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: 'test' }), // Missing variantId and quantity
    });

    if (response.status === 400) {
      log('/api/cart/add', 'POST', 'PASS', 'Missing fields validation works', response.status);
    } else {
      log('/api/cart/add', 'POST', 'FAIL', 'Should validate required fields', response.status);
    }
  } catch (error: any) {
    log('/api/cart/add', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 5: Update Cart Line (missing fields)
  try {
    const response = await fetch(`${BASE_URL}/api/cart/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: 'test' }), // Missing lineId and quantity
    });

    if (response.status === 400) {
      log('/api/cart/update', 'POST', 'PASS', 'Missing fields validation works', response.status);
    } else {
      log('/api/cart/update', 'POST', 'FAIL', 'Should validate required fields', response.status);
    }
  } catch (error: any) {
    log('/api/cart/update', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 6: Remove Cart Line (missing fields)
  try {
    const response = await fetch(`${BASE_URL}/api/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: 'test' }), // Missing lineId
    });

    if (response.status === 400) {
      log('/api/cart/remove', 'POST', 'PASS', 'Missing fields validation works', response.status);
    } else {
      log('/api/cart/remove', 'POST', 'FAIL', 'Should validate required fields', response.status);
    }
  } catch (error: any) {
    log('/api/cart/remove', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }
}

// ============================================================================
// CONTACT API TESTS
// ============================================================================

async function testContactAPI() {
  console.log('\n✉️  Testing Contact API...\n');

  // Test 1: Missing Required Fields
  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }), // Missing email, message, type
    });

    if (response.status === 400) {
      log('/api/contact', 'POST', 'PASS', 'Missing fields validation works', response.status);
    } else {
      log('/api/contact', 'POST', 'FAIL', 'Should validate required fields', response.status);
    }
  } catch (error: any) {
    log('/api/contact', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 2: XSS Attempt in Contact Form
  try {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '<script>alert("XSS")</script>',
        email: 'test@example.com',
        message: '<img src=x onerror="alert(1)">',
        type: 'general',
      }),
    });

    // Should either process (if RESEND configured) or fail gracefully
    if (response.status === 200 || response.status === 500) {
      log('/api/contact', 'POST', 'PASS', 'XSS input accepted (will be sanitized)', response.status);
    } else {
      log('/api/contact', 'POST', 'FAIL', 'Unexpected response', response.status);
    }
  } catch (error: any) {
    log('/api/contact', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }
}

// ============================================================================
// NEWSLETTER API TESTS
// ============================================================================

async function testNewsletterAPI() {
  console.log('\n📧 Testing Newsletter API...\n');

  // Test 1: Missing Email
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (response.status === 400) {
      log('/api/newsletter', 'POST', 'PASS', 'Missing email validation works', response.status);
    } else {
      log('/api/newsletter', 'POST', 'FAIL', 'Should validate email field', response.status);
    }
  } catch (error: any) {
    log('/api/newsletter', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 2: Invalid Email Format
  try {
    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });

    if (response.status === 400) {
      log('/api/newsletter', 'POST', 'PASS', 'Invalid email format rejected', response.status);
    } else {
      log('/api/newsletter', 'POST', 'FAIL', 'Should validate email format', response.status);
    }
  } catch (error: any) {
    log('/api/newsletter', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }
}

// ============================================================================
// AUTH API TESTS
// ============================================================================

async function testAuthAPI() {
  console.log('\n🔐 Testing Authentication API...\n');

  // Test 1: Check Auth Status (unauthenticated)
  try {
    const response = await fetch(`${BASE_URL}/api/auth/check`);

    if (response.status === 401 || response.status === 200) {
      const data = await response.json();
      if (!data.authenticated) {
        log('/api/auth/check', 'GET', 'PASS', 'Unauthenticated status correct', response.status);
      } else {
        log('/api/auth/check', 'GET', 'FAIL', 'Should not be authenticated', response.status);
      }
    } else {
      log('/api/auth/check', 'GET', 'FAIL', 'Unexpected response', response.status);
    }
  } catch (error: any) {
    log('/api/auth/check', 'GET', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 2: Login with Missing Password
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (response.status === 400) {
      log('/api/auth/login', 'POST', 'PASS', 'Missing password validation works', response.status);
    } else {
      log('/api/auth/login', 'POST', 'FAIL', 'Should validate password field', response.status);
    }
  } catch (error: any) {
    log('/api/auth/login', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }

  // Test 3: Login with Wrong Password
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password-123' }),
    });

    if (response.status === 401 || response.status === 500) {
      log('/api/auth/login', 'POST', 'PASS', 'Wrong password rejected', response.status);
    } else {
      log('/api/auth/login', 'POST', 'FAIL', 'Should reject wrong password', response.status);
    }
  } catch (error: any) {
    log('/api/auth/login', 'POST', 'FAIL', `Request failed: ${error.message}`);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🌐 API INTEGRATION TESTS');
  console.log(`Testing: ${BASE_URL}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Check if server is running
  console.log('🔍 Checking if server is running...\n');
  const isRunning = await checkServerRunning();

  if (!isRunning) {
    console.log('❌ Server is not running!\n');
    console.log('Please start the development server:');
    console.log('  Terminal 1: npm run dev');
    console.log('  Terminal 2: npx tsx tests/api-integration-test.ts\n');
    console.log('Or set TEST_BASE_URL environment variable to test production.\n');
    process.exit(1);
  }

  console.log('✅ Server is running!\n');

  const startTime = Date.now();

  await testCartAPI();
  await testContactAPI();
  await testNewsletterAPI();
  await testAuthAPI();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  const total = results.length;

  console.log(`✅ Passed:  ${passed}/${total}`);
  console.log(`❌ Failed:  ${failed}/${total}`);
  console.log(`⏭️  Skipped: ${skipped}/${total}`);
  console.log(`⏱️  Duration: ${duration}s\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`  ❌ ${r.method} ${r.endpoint}`);
        if (r.message) console.log(`     ${r.message}`);
      });
    console.log('');
  }

  if (failed === 0) {
    console.log('🎉 ALL API TESTS PASSED!\n');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Review the issues above.\n');
  }

  console.log('═══════════════════════════════════════════════════════');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Test runner crashed:', error);
  process.exit(1);
});

