import { describe, expect, it } from 'vitest';
import { getErrorMessage, getValidationErrors, normalizeApiError } from '../errors';

describe('API error normalisation', () => {
  it('reads the backend error DTO', () => {
    const error = {
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          validationErrors: { name: 'Label name is required' },
        },
      },
    };

    expect(normalizeApiError(error)).toEqual({
      status: 400,
      message: 'Validation failed',
      validationErrors: { name: 'Label name is required' },
    });
    expect(getValidationErrors(error)).toEqual({ name: 'Label name is required' });
  });

  it('uses a fallback when the response has no message', () => {
    expect(getErrorMessage(new Error('Network Error'), 'Custom fallback')).toBe('Custom fallback');
    expect(getErrorMessage({ response: { status: 401 } })).toBe(
      'Your session has expired. Please log in again.',
    );
  });
});
