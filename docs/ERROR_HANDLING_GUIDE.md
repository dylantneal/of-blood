# 🛡️ Error Handling Guide

## Quick Reference

### Error Boundaries
```typescript
import { ErrorBoundary } from "@/components/error-boundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Cart Errors
```typescript
const { error, clearError } = useCart();

{error && <div className="error">{error} <button onClick={clearError}>×</button></div>}
```

### Audio Errors
```typescript
const { error, clearError } = useAudio();

{error && <Alert onClose={clearError}>{error}</Alert>}
```

### Retry Failed Operations
```typescript
import { retryWithBackoff } from "@/lib/retry-utils";

const data = await retryWithBackoff(() => fetchData());
```

---

## Common Error Scenarios

### 1. Network Failure
**Symptom:** API calls fail with "fetch failed"  
**Handled By:** Retry logic (automatic)  
**User Sees:** "Please check your connection"  
**Recovery:** Auto-retries up to 3 times with exponential backoff

### 2. Cart Expired
**Symptom:** Cart ID invalid (404)  
**Handled By:** Cart context  
**User Sees:** "Your cart has expired. Please add items again."  
**Recovery:** Cart cleared, user can start fresh

### 3. Out of Stock Item
**Symptom:** Product variant not available  
**Handled By:** Shopify API  
**User Sees:** "Item not found. It may be out of stock."  
**Recovery:** User can browse other items

### 4. Missing Audio File
**Symptom:** Track has no audioUrl  
**Handled By:** Audio context  
**User Sees:** "Unable to play [Track Name] - audio file not available"  
**Recovery:** User can try other tracks

### 5. Environment Configuration Error
**Symptom:** Missing env vars  
**Handled By:** Startup validation  
**Developer Sees:** Detailed error message with fix instructions  
**Recovery:** Set env vars and restart server

---

## Error Message Standards

### Good Error Messages:
- ✅ "Your cart has expired. Please add items again."
- ✅ "Unable to connect. Please check your internet connection."
- ✅ "Item not found. It may be out of stock."

### Bad Error Messages:
- ❌ "Error 404"
- ❌ "Failed to fetch"
- ❌ "Something went wrong"

### Guidelines:
1. **Be Specific:** Explain what went wrong
2. **Be Actionable:** Tell user what to do next
3. **Be Friendly:** Use conversational tone
4. **Be Honest:** Don't hide problems

---

## Adding Error Handling to New Features

### Step 1: Wrap in Error Boundary
```typescript
<ErrorBoundary>
  <NewFeature />
</ErrorBoundary>
```

### Step 2: Add Try/Catch
```typescript
async function handleAction() {
  try {
    await performAction();
  } catch (error) {
    setError(error.message);
    console.error('Action failed:', error);
  }
}
```

### Step 3: Display Errors
```typescript
{error && (
  <div className="p-4 bg-primary/10 border border-primary/30 rounded">
    <p className="text-primary">{error}</p>
    <button onClick={clearError}>Dismiss</button>
  </div>
)}
```

### Step 4: Add Retry Logic (if appropriate)
```typescript
import { retryWithBackoff } from "@/lib/retry-utils";

const result = await retryWithBackoff(() => apiCall());
```

---

## Testing Error Handling

### Manual Testing Checklist:
- [ ] Disconnect internet, try cart operations
- [ ] Invalid cart ID → should clear and show message
- [ ] Missing audio file → should show error
- [ ] Remove env vars → should show startup error
- [ ] Force API error → should retry automatically
- [ ] Throw error in component → should show error boundary

### Automated Testing:
See `tests/comprehensive-test.ts` for error handling tests.

---

## Monitoring Errors in Production

### Setup Sentry (Recommended):
```bash
npm install @sentry/nextjs
```

```typescript
// In error-boundary.tsx
import * as Sentry from "@sentry/nextjs";

componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack
      }
    }
  });
}
```

### Track Errors:
- Cart failures
- Audio playback errors
- Network failures
- Environment issues

---

## Best Practices

1. **Always Use Error Boundaries:** Wrap major features
2. **Validate Early:** Check inputs before API calls
3. **Retry Transient Failures:** Use retry logic for network errors
4. **Clear Error State:** Provide way to dismiss errors
5. **Log for Debugging:** Console.error in development
6. **Monitor in Production:** Use Sentry or similar
7. **Test Error Paths:** Don't just test happy path

---

## Resources

- **Error Handling Improvements:** `ERROR_HANDLING_IMPROVEMENTS.md`
- **Retry Utils:** `lib/retry-utils.ts`
- **Env Validation:** `lib/env-validation.ts`
- **Error Boundary:** `components/error-boundary.tsx`

