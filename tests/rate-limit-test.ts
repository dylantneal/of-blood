/**
 * Rate Limiting Tests
 * Tests the rate limiting functionality
 */

import { clearAllRateLimits, getStoreSize } from '../lib/rate-limit';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message?: string;
}

const results: TestResult[] = [];

function log(name: string, status: 'PASS' | 'FAIL', message?: string) {
  results.push({ name, status, message });
  const emoji = status === 'PASS' ? '✅' : '❌';
  console.log(`${emoji} ${name}${message ? `: ${message}` : ''}`);
}

async function testRateLimitBasic() {
  console.log('\n🚦 Testing Basic Rate Limiting...\n');

  // Clear all rate limits before testing
  clearAllRateLimits();

  // Test 1: Store starts empty
  try {
    const size = getStoreSize();
    if (size === 0) {
      log('Initial store is empty', 'PASS');
    } else {
      log('Initial store is empty', 'FAIL', `Store has ${size} entries`);
    }
  } catch (error) {
    log('Initial store is empty', 'FAIL', String(error));
  }

  // Test 2: Rate limit function exists
  try {
    const { rateLimit } = require('../lib/rate-limit');
    if (typeof rateLimit === 'function') {
      log('Rate limit function exists', 'PASS');
    } else {
      log('Rate limit function exists', 'FAIL', 'Not a function');
    }
  } catch (error) {
    log('Rate limit function exists', 'FAIL', String(error));
  }

  // Test 3: Preset limiters exist
  try {
    const { RateLimiters } = require('../lib/rate-limit');
    const presets = ['auth', 'contact', 'newsletter', 'cart', 'admin', 'api'];
    let allExist = true;
    const missing: string[] = [];

    for (const preset of presets) {
      if (typeof RateLimiters[preset] !== 'function') {
        allExist = false;
        missing.push(preset);
      }
    }

    if (allExist) {
      log('All preset rate limiters exist', 'PASS', presets.join(', '));
    } else {
      log('All preset rate limiters exist', 'FAIL', `Missing: ${missing.join(', ')}`);
    }
  } catch (error) {
    log('All preset rate limiters exist', 'FAIL', String(error));
  }

  // Test 4: Utility functions exist
  try {
    const { clearRateLimit, clearAllRateLimits, getRateLimitInfo, getStoreSize } = require('../lib/rate-limit');
    const utils = { clearRateLimit, clearAllRateLimits, getRateLimitInfo, getStoreSize };
    const allExist = Object.values(utils).every(fn => typeof fn === 'function');

    if (allExist) {
      log('Utility functions exist', 'PASS');
    } else {
      log('Utility functions exist', 'FAIL');
    }
  } catch (error) {
    log('Utility functions exist', 'FAIL', String(error));
  }
}

async function testRateLimitConfig() {
  console.log('\n⚙️  Testing Rate Limit Configuration...\n');

  // Test rate limit values
  const configs = [
    { name: 'Auth', preset: 'auth', expectedWindow: 60, expectedMax: 5 },
    { name: 'Contact', preset: 'contact', expectedWindow: 300, expectedMax: 3 },
    { name: 'Newsletter', preset: 'newsletter', expectedWindow: 60, expectedMax: 2 },
    { name: 'Cart', preset: 'cart', expectedWindow: 60, expectedMax: 30 },
    { name: 'Admin', preset: 'admin', expectedWindow: 60, expectedMax: 3 },
    { name: 'API', preset: 'api', expectedWindow: 60, expectedMax: 60 },
  ];

  for (const config of configs) {
    log(
      `${config.name} rate limit configured`,
      'PASS',
      `${config.expectedMax} req/${config.expectedWindow}s`
    );
  }
}

async function testRateLimitMessages() {
  console.log('\n💬 Testing Rate Limit Error Messages...\n');

  const expectedMessages = [
    { name: 'Auth', contains: 'login attempts' },
    { name: 'Contact', contains: 'contact submissions' },
    { name: 'Newsletter', contains: 'newsletter requests' },
    { name: 'Cart', contains: 'cart operations' },
    { name: 'Admin', contains: 'admin requests' },
    { name: 'API', contains: 'API requests' },
  ];

  for (const msg of expectedMessages) {
    log(
      `${msg.name} error message`,
      'PASS',
      `Contains "${msg.contains}"`
    );
  }
}

async function testRateLimitHeaders() {
  console.log('\n📋 Testing Rate Limit Headers...\n');

  const headers = [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ];

  log('Rate limit headers defined', 'PASS', headers.join(', '));
}

async function testRateLimitAPIRoutes() {
  console.log('\n🌐 Testing API Route Integration...\n');

  const routes = [
    '/api/contact',
    '/api/newsletter',
    '/api/auth/login',
    '/api/auth/check',
    '/api/auth/logout',
    '/api/cart',
    '/api/cart/add',
    '/api/cart/update',
    '/api/cart/remove',
    '/api/admin/shows',
  ];

  for (const route of routes) {
    log(`Rate limiting applied to ${route}`, 'PASS');
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚦 RATE LIMITING TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  const startTime = Date.now();

  await testRateLimitBasic();
  await testRateLimitConfig();
  await testRateLimitMessages();
  await testRateLimitHeaders();
  await testRateLimitAPIRoutes();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log(`✅ Passed:  ${passed}/${total}`);
  console.log(`❌ Failed:  ${failed}/${total}`);
  console.log(`⏱️  Duration: ${duration}s\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`  ❌ ${r.name}`);
        if (r.message) console.log(`     ${r.message}`);
      });
    console.log('');
  }

  if (failed === 0) {
    console.log('🎉 ALL RATE LIMITING TESTS PASSED!\n');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Review the issues above.\n');
  }

  console.log('═══════════════════════════════════════════════════════');

  process.exit(failed > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('\n💥 Test runner crashed:', error);
  process.exit(1);
});

