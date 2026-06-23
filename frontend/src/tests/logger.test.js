/**
 * logger.test.js
 *
 * Unit tests for the logger utility.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to test the logic in logger.js which relies on import.meta.env.MODE or process.env.NODE_ENV
// Since it's evaluated at import time, we might need to isolate modules if we want to test different environments.
// For now, we'll just test that it exports a log object with the expected methods.

import log from '../utils/logger';

describe('logger', () => {
  it('exports an object with log level methods', () => {
    expect(typeof log.trace).toBe('function');
    expect(typeof log.debug).toBe('function');
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.setLevel).toBe('function');
  });

  it('can be called without throwing errors', () => {
    // Temporarily mock console to prevent actual output during test
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Default level in test environment (which is not 'production') should be 'debug'
    expect(() => log.info('Test info message')).not.toThrow();
    expect(() => log.warn('Test warning message')).not.toThrow();
    expect(() => log.error('Test error message')).not.toThrow();
    
    consoleSpy.mockRestore();
  });
});
