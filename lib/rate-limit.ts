/**
 * Rate Limiting Middleware for API Routes
 * Prevents abuse and protects against DoS attacks
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
  /**
   * Time window in seconds
   * @default 60 (1 minute)
   */
  windowMs?: number;
  
  /**
   * Maximum number of requests per window
   * @default 10
   */
  maxRequests?: number;
  
  /**
   * Custom error message
   */
  message?: string;
  
  /**
   * Whether to include rate limit headers in response
   * @default true
   */
  includeHeaders?: boolean;
  
  /**
   * Custom identifier function (defaults to IP address)
   */
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (simple solution, can be upgraded to Redis for production scaling)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: NextRequest, keyGenerator?: (req: NextRequest) => string): string {
  if (keyGenerator) {
    return keyGenerator(request);
  }

  // Try to get IP from various headers (for reverse proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = forwardedFor?.split(',')[0].trim() || 
             realIp || 
             cfConnectingIp || 
             'unknown';
  
  return ip;
}

/**
 * Check if request should be rate limited
 */
function checkRateLimit(
  identifier: string,
  config: Required<RateLimitConfig>
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = config.windowMs * 1000;
  
  let entry = store.get(identifier);
  
  // Create new entry if doesn't exist or window expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    store.set(identifier, entry);
  }
  
  // Increment count
  entry.count++;
  
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit middleware
 * 
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimit(request, {
 *     windowMs: 60,
 *     maxRequests: 5,
 *   });
 *   
 *   if (rateLimitResult) return rateLimitResult; // Rate limited
 *   
 *   // Process request...
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = {}
): Promise<NextResponse | null> {
  const fullConfig: Required<RateLimitConfig> = {
    windowMs: config.windowMs ?? 60,
    maxRequests: config.maxRequests ?? 10,
    message: config.message ?? 'Too many requests. Please try again later.',
    includeHeaders: config.includeHeaders ?? true,
    keyGenerator: config.keyGenerator ?? getClientIdentifier,
  };

  const identifier = fullConfig.keyGenerator(request);
  const result = checkRateLimit(identifier, fullConfig);

  // Add rate limit headers to response
  const headers: Record<string, string> = {};
  
  if (fullConfig.includeHeaders) {
    headers['X-RateLimit-Limit'] = String(fullConfig.maxRequests);
    headers['X-RateLimit-Remaining'] = String(result.remaining);
    headers['X-RateLimit-Reset'] = String(Math.floor(result.resetTime / 1000));
  }

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    console.warn(
      `[Rate Limit] Client ${identifier} exceeded limit (${fullConfig.maxRequests} req/${fullConfig.windowMs}s)`
    );

    return NextResponse.json(
      {
        error: fullConfig.message,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  // Request allowed, but we need to add headers to the actual response
  // Return null to indicate "not rate limited"
  return null;
}

/**
 * Create a rate limiter with preset configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (request: NextRequest) => rateLimit(request, config);
}

/**
 * Preset rate limiters for common use cases
 */
export const RateLimiters = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per minute
   */
  auth: createRateLimiter({
    windowMs: 60,
    maxRequests: 5,
    message: 'Too many login attempts. Please try again in a minute.',
  }),

  /**
   * Moderate rate limit for contact form
   * 3 requests per 5 minutes
   */
  contact: createRateLimiter({
    windowMs: 300,
    maxRequests: 3,
    message: 'Too many contact submissions. Please wait before submitting again.',
  }),

  /**
   * Moderate rate limit for newsletter
   * 2 requests per minute
   */
  newsletter: createRateLimiter({
    windowMs: 60,
    maxRequests: 2,
    message: 'Too many newsletter requests. Please try again in a minute.',
  }),

  /**
   * Lenient rate limit for cart operations
   * 30 requests per minute
   */
  cart: createRateLimiter({
    windowMs: 60,
    maxRequests: 30,
    message: 'Too many cart operations. Please slow down.',
  }),

  /**
   * Very strict rate limit for admin operations
   * 3 requests per minute
   */
  admin: createRateLimiter({
    windowMs: 60,
    maxRequests: 3,
    message: 'Too many admin requests. Please wait before trying again.',
  }),

  /**
   * General API rate limit
   * 60 requests per minute
   */
  api: createRateLimiter({
    windowMs: 60,
    maxRequests: 60,
    message: 'Too many API requests. Please slow down.',
  }),
};

/**
 * Get rate limit info for a client (for debugging)
 */
export function getRateLimitInfo(identifier: string): RateLimitEntry | null {
  return store.get(identifier) || null;
}

/**
 * Clear rate limit for a client (for testing/admin)
 */
export function clearRateLimit(identifier: string): void {
  store.delete(identifier);
}

/**
 * Clear all rate limits (for testing)
 */
export function clearAllRateLimits(): void {
  store.clear();
}

/**
 * Get current store size (for monitoring)
 */
export function getStoreSize(): number {
  return store.size;
}


