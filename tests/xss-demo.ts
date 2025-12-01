/**
 * XSS Protection Visual Demo
 * Shows exactly how malicious payloads are neutralized
 */

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

console.log('🛡️  XSS Protection Demo - Visual Comparison\n');
console.log('='.repeat(80));

const attacks = [
  {
    type: 'Script Injection',
    payload: '<script>alert("XSS")</script>',
    description: 'Basic script tag attack'
  },
  {
    type: 'Image Event Handler',
    payload: '<img src=x onerror="alert(\'XSS\')">',
    description: 'Image with malicious onerror handler'
  },
  {
    type: 'Iframe JavaScript',
    payload: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    description: 'Iframe with javascript protocol'
  },
  {
    type: 'SVG Attack',
    payload: '<svg/onload=alert("XSS")>',
    description: 'SVG element with onload handler'
  }
];

attacks.forEach((attack, index) => {
  console.log(`\n\n${index + 1}. ${attack.type}`);
  console.log('-'.repeat(80));
  console.log(`Description: ${attack.description}\n`);
  
  console.log('❌ BEFORE FIX (Dangerous):');
  console.log(`   ${attack.payload}`);
  console.log('   ⚠️  This would execute in browser/email client!\n');
  
  console.log('✅ AFTER FIX (Safe):');
  const safe = escapeHtml(attack.payload);
  console.log(`   ${safe}`);
  console.log('   🛡️  This is rendered as plain text, not executed\n');
  
  console.log('📧 In Email HTML:');
  console.log(`   <p>${safe}</p>`);
  console.log('   ✅ Email client displays text, not code');
});

console.log('\n' + '='.repeat(80));
console.log('\n🎯 Key Takeaway:\n');
console.log('   Dangerous characters are converted to HTML entities:');
console.log('   • <  becomes  &lt;');
console.log('   • >  becomes  &gt;');
console.log('   • "  becomes  &quot;');
console.log('   • \'  becomes  &#39;');
console.log('   • &  becomes  &amp;');
console.log('   • /  becomes  &#x2F;');
console.log('\n   This makes code render as text instead of executing! 🛡️\n');

