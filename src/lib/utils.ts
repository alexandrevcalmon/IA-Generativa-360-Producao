
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class TimeoutError extends Error {
  constructor(message = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

// Type to handle both Promises and Supabase PostgrestBuilders
type PromiseOrPostgrestBuilder<T> = Promise<T> | { then: (onfulfilled?: (value: T) => any) => any };

export function withTimeout<T>(
  promiseOrBuilder: PromiseOrPostgrestBuilder<T>,
  ms: number,
  errorMessage = "Operation timed out"
): Promise<T> {
  // Convert PostgrestBuilder to Promise if needed
  const promise = typeof promiseOrBuilder.then === 'function' 
    ? Promise.resolve(promiseOrBuilder)
    : promiseOrBuilder as Promise<T>;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(`${errorMessage} (timeout: ${ms}ms)`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        // Improve error handling and prevent cascading issues
        if (error?.code === 'PGRST301' || error?.message?.includes('403')) {
          console.warn(`403/PGRST301 error caught in withTimeout: ${error.message}`);
          reject(new Error(`Access denied: ${error.message || 'Insufficient permissions'}`));
        } else if (error?.status === 400 || error?.message?.includes('400')) {
          console.warn(`400 error caught in withTimeout: ${error.message}`);
          reject(new Error(`Bad Request: ${error.message || 'Invalid query or parameters'}`));
        } else if (error instanceof TimeoutError) {
          // Re-throw timeout errors without modification
          reject(error);
        } else {
          // Log other errors for debugging
          console.warn(`Error caught in withTimeout: ${error?.message || error}`);
          reject(error);
        }
      });
  });
}
