
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
type PromiseOrPostgrestBuilder<T> = Promise<T> | { then: (onfulfilled?: ((value: T) => any) => any) => any };

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
      reject(new TimeoutError(errorMessage));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
