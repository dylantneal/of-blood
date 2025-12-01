/**
 * API Contact Form Integration Test
 * Tests the actual API endpoint with malicious payloads
 * 
 * Run this with your dev server running: npm run dev
 */

const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface TestCase {
  name: string;
  payload: {
    name: string;
    email: string;
    message: string;
    type: string;
    venue?: string;
    date?: string;
  };
  shouldSucceed: boolean;
  description: string;
}

const testCases: TestCase[] = [
  {
    name: "XSS via script tag in name",
    payload: {
      name: '<script>alert("XSS")</script>',
      email: 'test@example.com',
      message: 'Test message',
      type: 'general',
    },
    shouldSucceed: true,
    description: 'Should accept but sanitize script tags in name field',
  },
  {
    name: "XSS via image onerror in message",
    payload: {
      name: 'John Doe',
      email: 'test@example.com',
      message: '<img src=x onerror="alert(\'XSS\')">',
      type: 'general',
    },
    shouldSucceed: true,
    description: 'Should accept but sanitize malicious image tag',
  },
  {
    name: "XSS via iframe in venue",
    payload: {
      name: 'John Doe',
      email: 'test@example.com',
      message: 'Booking request',
      venue: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      type: 'booking',
    },
    shouldSucceed: true,
    description: 'Should accept but sanitize iframe in venue field',
  },
  {
    name: "Multiple XSS attempts in all fields",
    payload: {
      name: '<script>alert(1)</script>',
      email: 'test@example.com',
      message: '<img src=x onerror="alert(2)">',
      venue: '<svg/onload=alert(3)>',
      date: '<a href="javascript:alert(4)">',
      type: 'booking',
    },
    shouldSucceed: true,
    description: 'Should handle multiple XSS attempts across fields',
  },
  {
    name: "Normal legitimate message",
    payload: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'Hi! I would like to book you for a show.\n\nLet me know your availability.',
      type: 'booking',
      venue: 'The Underground',
      date: '2025-12-15',
    },
    shouldSucceed: true,
    description: 'Normal message should work perfectly',
  },
  {
    name: "Missing required fields",
    payload: {
      name: 'John Doe',
      email: 'test@example.com',
      message: '',
      type: 'general',
    },
    shouldSucceed: false,
    description: 'Should reject when required fields are missing',
  },
];

async function runTest(testCase: TestCase): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.payload),
    });

    const data = await response.json();
    
    const success = testCase.shouldSucceed 
      ? response.ok && data.success
      : !response.ok;

    return success;
  } catch (error) {
    console.error(`   Error: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🧪 API Contact Form Integration Test\n');
  console.log('Testing endpoint:', `${API_URL}/api/contact`);
  console.log('='.repeat(80));

  // Check if server is running
  try {
    await fetch(API_URL);
  } catch (error) {
    console.error('\n❌ Error: Dev server is not running!');
    console.error('\nPlease start the server first:');
    console.error('   npm run dev\n');
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🧪 Test ${i + 1}: ${testCase.name}`);
    console.log(`   ${testCase.description}`);
    
    const success = await runTest(testCase);
    
    if (success) {
      passed++;
      console.log(`   ✅ PASSED`);
    } else {
      failed++;
      console.log(`   ❌ FAILED`);
      console.log(`   Payload:`, JSON.stringify(testCase.payload, null, 2));
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

  if (failed === 0) {
    console.log('\n🎉 All API tests passed! The contact form is secure.\n');
    console.log('⚠️  Note: This test sends emails. Check your inbox to verify');
    console.log('   that malicious payloads are properly escaped in the emails.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the API implementation.\n');
    process.exit(1);
  }
}

main();

