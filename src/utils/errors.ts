/**
 * Base error class for all Pathao SDK errors
 *
 * All SDK-specific errors extend this class. It provides a consistent error interface
 * with status codes and error codes for programmatic error handling.
 *
 * @public
 */
export class PathaoError extends Error {
  /** HTTP status code associated with the error (if applicable) */
  public readonly statusCode: number | undefined;
  /** Error code for programmatic error handling */
  public readonly code: string | undefined;

  /**
   * Creates a new PathaoError instance
   *
   * @param message - Human-readable error message
   * @param statusCode - Optional HTTP status code
   * @param code - Optional error code for programmatic handling
   */
  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.name = 'PathaoError';
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, PathaoError.prototype);
  }
}

/**
 * Error thrown when API requests to Pathao Courier API fail
 *
 * This error is thrown when:
 * - The API returns a non-2xx status code
 * - Network requests timeout
 * - Request fails due to network issues
 *
 * The error includes the HTTP status code and the raw API response for debugging.
 *
 * @example
 * ```typescript
 * try {
 *   await client.stores.create(storeData);
 * } catch (error) {
 *   if (error instanceof PathaoApiError) {
 *     console.error('API Error:', error.message);
 *     console.error('Status:', error.statusCode);
 *     console.error('Response:', error.response);
 *   }
 * }
 * ```
 *
 * @public
 */
export class PathaoApiError extends PathaoError {
  /** Raw API response data (if available) */
  public readonly response?: unknown;

  /**
   * Creates a new PathaoApiError instance
   *
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code from the API response
   * @param response - Optional raw API response data
   */
  constructor(message: string, statusCode: number, response?: unknown) {
    super(message, statusCode, 'API_ERROR');
    this.name = 'PathaoApiError';
    this.response = response;
    Object.setPrototypeOf(this, PathaoApiError.prototype);
  }
}

/**
 * Error thrown when input validation fails
 *
 * This error is thrown by validation functions when:
 * - Required fields are missing
 * - Field values don't meet format requirements
 * - Field values are outside allowed ranges
 *
 * The error includes the field name to help identify which input is invalid.
 *
 * @example
 * ```typescript
 * try {
 *   validateStoreName('AB'); // Too short
 * } catch (error) {
 *   if (error instanceof PathaoValidationError) {
 *     console.error('Validation failed:', error.message);
 *     console.error('Field:', error.field); // 'name'
 *   }
 * }
 * ```
 *
 * @public
 */
export class PathaoValidationError extends PathaoError {
  /** Name of the field that failed validation */
  public readonly field: string | undefined;

  /**
   * Creates a new PathaoValidationError instance
   *
   * @param message - Human-readable validation error message
   * @param field - Optional name of the field that failed validation
   */
  constructor(message: string, field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'PathaoValidationError';
    this.field = field;
    Object.setPrototypeOf(this, PathaoValidationError.prototype);
  }
}

/**
 * Error thrown when authentication or authorization fails
 *
 * This error is thrown when:
 * - Access token retrieval fails
 * - Token refresh fails
 * - Invalid credentials are provided
 * - Token has expired and cannot be refreshed
 *
 * Error code: `AUTH_ERROR`
 * Status code: `401` (Unauthorized)
 *
 * @example
 * ```typescript
 * try {
 *   await client.stores.list();
 * } catch (error) {
 *   if (error instanceof PathaoAuthError) {
 *     console.error('Authentication failed:', error.message);
 *     // Handle re-authentication
 *   }
 * }
 * ```
 *
 * @public
 */
export class PathaoAuthError extends PathaoError {
  /**
   * Creates a new PathaoAuthError instance
   *
   * @param message - Human-readable authentication error message
   */
  constructor(message: string) {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'PathaoAuthError';
    Object.setPrototypeOf(this, PathaoAuthError.prototype);
  }
}

/**
 * Error thrown when webhook processing fails
 *
 * This error is thrown when:
 * - Webhook signature verification fails
 * - Webhook payload is invalid or malformed
 * - Required webhook headers are missing
 * - Unknown webhook event type is received
 *
 * Error code: `WEBHOOK_ERROR`
 * Status code: `400` (Bad Request)
 *
 * @example
 * ```typescript
 * try {
 *   handler.handle(req.body, req.headers['x-pathao-signature']);
 * } catch (error) {
 *   if (error instanceof PathaoWebhookError) {
 *     console.error('Webhook processing failed:', error.message);
 *     // Reject the webhook request
 *   }
 * }
 * ```
 *
 * @public
 */
export class PathaoWebhookError extends PathaoError {
  /**
   * Creates a new PathaoWebhookError instance
   *
   * @param message - Human-readable webhook error message
   */
  constructor(message: string) {
    super(message, 400, 'WEBHOOK_ERROR');
    this.name = 'PathaoWebhookError';
    Object.setPrototypeOf(this, PathaoWebhookError.prototype);
  }
}
