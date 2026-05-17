/**
 * useDataLoader
 *
 * Simulates an async data fetch with a configurable delay.
 * Drives the skeleton → content transition on every screen.
 *
 * Usage:
 *   const { isLoading, data } = useDataLoader(mockPros, 1400);
 */
import { useState, useEffect } from 'react';

interface DataLoaderResult<T> {
  isLoading: boolean;
  data: T;
}

export function useDataLoader<T>(
  mockData: T,
  delayMs: number = 1200,
): DataLoaderResult<T> {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return { isLoading, data: mockData };
}
