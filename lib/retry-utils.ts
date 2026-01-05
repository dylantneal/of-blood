/**
 * Retry utility for failed API calls
 * Implements exponential backoff for transient failures
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
  shouldRetry: (error: any) => {
    // Retry on network errors and 5xx server errors
    if (error?.message?.includes('fetch failed')) return true;
    if (error?.message?.includes('network')) return true;
    if (error?.status >= 500 && error?.status < 600) return true;
    if (error?.status === 429) return true; // Rate limit
    return false;
  },
};

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffFactor: number
): number {
  const delay = initialDelay * Math.pow(backoffFactor, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function
 * @throws The last error if all retries fail
 * 
 * @example
 * ```typescript
 * const data = await retryWithBackoff(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry this error
      if (!opts.shouldRetry(error)) {
        throw error;
      }

      // Don't retry if this was the last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        opts.initialDelay,
        opts.maxDelay,
        opts.backoffFactor
      );

      console.warn(
        `[Retry] Attempt ${attempt}/${opts.maxRetries} failed. Retrying in ${delay}ms...`,
        error.message || error
      );

      await sleep(delay);
    }
  }

  console.error(
    `[Retry] All ${opts.maxRetries} attempts failed. Giving up.`,
    lastError
  );
  throw lastError;
}

/**
 * Retry fetch specifically with better error handling
 */
export async function retryFetch(
  url: string,
  init?: RequestInit,
  options?: RetryOptions
): Promise<Response> {
  return retryWithBackoff(
    async () => {
      const response = await fetch(url, init);
      
      // Throw error for non-ok responses so they can be retried
      if (!response.ok) {
        const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }
      
      return response;
    },
    {
      ...options,
      shouldRetry: (error: any) => {
        // Don't retry client errors (4xx except 429)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
          return false;
        }
        // Use default retry logic for other errors
        return DEFAULT_RETRY_OPTIONS.shouldRetry(error);
      },
    }
  );
}

/**
 * Create a retryable version of an async function
 */
export function makeRetryable<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return ((...args: any[]) => {
    return retryWithBackoff(() => fn(...args), options);
  }) as T;
}



