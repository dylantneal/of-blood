/**
 * XSS Protection Test
 * Tests that the escapeHtml function properly sanitizes malicious input
 */

// Copy of the escapeHtml function from app/api/contact/route.ts
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

// Test cases with malicious payloads
const testCases = [
  {
    name: "Script tag injection",
    input: '<script>alert("XSS")</script>',
    expected: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;',
    dangerous: true,
  },
  {
    name: "Image onerror injection",
    input: '<img src=x onerror="alert(\'XSS\')">',
    expected: '&lt;img src=x onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;',
    dangerous: true,
  },
  {
    name: "Iframe injection",
    input: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    expected: '&lt;iframe src=&quot;javascript:alert(&#39;XSS&#39;)&quot;&gt;&lt;&#x2F;iframe&gt;',
    dangerous: true,
  },
  {
    name: "Event handler injection",
    input: '<div onload="alert(\'XSS\')">',
    expected: '&lt;div onload=&quot;alert(&#39;XSS&#39;)&quot;&gt;',
    dangerous: true,
  },
  {
    name: "Anchor with javascript protocol",
    input: '<a href="javascript:alert(\'XSS\')">Click</a>',
    expected: '&lt;a href=&quot;javascript:alert(&#39;XSS&#39;)&quot;&gt;Click&lt;&#x2F;a&gt;',
    dangerous: true,
  },
  {
    name: "Mixed malicious code",
    input: '<svg/onload=alert("XSS")>',
    expected: '&lt;svg&#x2F;onload=alert(&quot;XSS&quot;)&gt;',
    dangerous: true,
  },
  {
    name: "HTML entity bypass attempt",
    input: '&lt;script&gt;alert("XSS")&lt;/script&gt;',
    expected: '&amp;lt;script&amp;gt;alert(&quot;XSS&quot;)&amp;lt;&#x2F;script&amp;gt;',
    dangerous: false, // Already encoded, but should double-encode
  },
  {
    name: "Normal text with special chars",
    input: 'Hello & goodbye, "friends"!',
    expected: 'Hello &amp; goodbye, &quot;friends&quot;!',
    dangerous: false,
  },
  {
    name: "Safe text",
    input: 'Just a normal message about booking a show',
    expected: 'Just a normal message about booking a show',
    dangerous: false,
  },
  {
    name: "Newlines (should not be escaped)",
    input: 'Line 1\nLine 2\nLine 3',
    expected: 'Line 1\nLine 2\nLine 3',
    dangerous: false,
  },
];

// Run tests
console.log('🧪 Testing XSS Protection\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = escapeHtml(testCase.input);
  const success = result === testCase.expected;
  
  if (success) {
    passed++;
    console.log(`\n✅ Test ${index + 1}: ${testCase.name}`);
    console.log(`   Status: PASSED`);
  } else {
    failed++;
    console.log(`\n❌ Test ${index + 1}: ${testCase.name}`);
    console.log(`   Status: FAILED`);
    console.log(`   Input:    "${testCase.input}"`);
    console.log(`   Expected: "${testCase.expected}"`);
    console.log(`   Got:      "${result}"`);
  }
  
  if (testCase.dangerous && success) {
    console.log(`   🛡️  Dangerous payload successfully neutralized`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! XSS protection is working correctly.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.\n');
  process.exit(1);
}

