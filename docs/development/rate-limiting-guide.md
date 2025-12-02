# 🚦 Rate Limiting - Quick Reference

## Quick Start

### Apply to API Route:
```typescript
import { RateLimiters } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Add this line at the start
  const rateLimitResult = await RateLimiters.contact(request);
  if (rateLimitResult) return rateLimitResult;

  // Your code...
}
```

---

## Available Rate Limiters

| Limiter | Limit | Use For |
|---------|-------|---------|
| `RateLimiters.auth` | 5/min | Login, password resets |
| `RateLimiters.contact` | 3/5min | Contact forms |
| `RateLimiters.newsletter` | 2/min | Email subscriptions |
| `RateLimiters.cart` | 30/min | Shopping cart operations |
| `RateLimiters.admin` | 3/min | Admin panel actions |
| `RateLimiters.api` | 60/min | General API endpoints |

---

## Custom Rate Limit

```typescript
import { rateLimit } from "@/lib/rate-limit";

const rateLimitResult = await rateLimit(request, {
  windowMs: 60,        // 60 seconds
  maxRequests: 10,     // 10 requests max
  message: "Slow down!", // Custom message
});
```

---

## Rate Limit Response

**Status:** 429 Too Many Requests

**Body:**
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

**Headers:**
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1733097600
Retry-After: 45
```

---

## Testing

```bash
# Run rate limit tests
npx tsx tests/rate-limit-test.ts

# Test manually
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hi","type":"general"}'
```

---

## Monitoring

```typescript
import { getStoreSize, getRateLimitInfo } from "@/lib/rate-limit";

// Check how many IPs are being tracked
console.log(`Active rate limits: ${getStoreSize()}`);

// Check specific IP
const info = getRateLimitInfo('192.168.1.1');
console.log(info); // { count: 3, resetTime: 1733097600 }
```

---

## Debugging

```typescript
import { clearRateLimit, clearAllRateLimits } from "@/lib/rate-limit";

// Clear specific IP (for testing)
clearRateLimit('192.168.1.1');

// Clear all (for testing)
clearAllRateLimits();
```

---

## Protected Endpoints

- ✅ `/api/contact` - 3 per 5 minutes
- ✅ `/api/newsletter` - 2 per minute
- ✅ `/api/auth/login` - 5 per minute
- ✅ `/api/auth/check` - 60 per minute
- ✅ `/api/auth/logout` - 60 per minute
- ✅ `/api/cart/*` - 30 per minute
- ✅ `/api/admin/*` - 3 per minute

---

## Common Issues

### Issue: Rate limit too strict
**Solution:** Increase `maxRequests` or `windowMs`

### Issue: Rate limit too lenient
**Solution:** Decrease `maxRequests` or increase `windowMs`

### Issue: Legitimate users getting blocked
**Solution:** Review logs, adjust limits, or implement user-based rate limiting

### Issue: Rate limits not working in tests
**Solution:** Call `clearAllRateLimits()` before tests

---

## Best Practices

1. **Start conservative** - You can always loosen limits later
2. **Monitor logs** - Watch for rate limit violations
3. **Test with real patterns** - Simulate actual user behavior
4. **Provide feedback** - Show clear error messages to users
5. **Document limits** - Let API consumers know the limits

---

## More Information

- **Full Documentation:** `RATE_LIMITING_COMPLETE.md`
- **Implementation:** `lib/rate-limit.ts`
- **Tests:** `tests/rate-limit-test.ts`

