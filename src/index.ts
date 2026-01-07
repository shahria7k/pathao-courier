/**
 * @packageDocumentation
 * @module pathao-courier
 *
 * # Pathao Courier SDK
 *
 * A modern, type-safe TypeScript SDK for the Pathao Courier Merchant API with comprehensive webhook support.
 *
 * ## Features
 *
 * - Full TypeScript Support - Complete type definitions for all API endpoints
 * - OAuth 2.0 Authentication - Automatic token management and refresh
 * - Webhook Handling - Built-in webhook handlers for Express, Fastify, and generic frameworks
 * - Input Validation - Automatic validation of request parameters
 * - Error Handling - Custom error classes with detailed error messages
 * - Framework Agnostic - Works with any Node.js framework
 *
 * ## Quick Start
 *
 * ```typescript
 * import { PathaoClient } from 'pathao-courier';
 *
 * const client = new PathaoClient({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   username: 'your-email@example.com',
 *   password: 'your-password',
 *   environment: 'sandbox',
 * });
 *
 * const store = await client.stores.create({ ... });
 * ```
 *
 * ## Package Structure
 *
 * This package exports:
 * - **PathaoClient** - Main client class for API interactions
 * - **Services** - Individual service classes (StoreService, OrderService, etc.)
 * - **Types** - Complete TypeScript type definitions
 * - **Constants** - API endpoints, enums, and configuration constants
 * - **Webhooks** - Webhook handling utilities and handlers
 * - **Errors** - Custom error classes
 * - **Validation** - Input validation utilities
 *
 * ## Webhook Support
 *
 * For webhook handling, import from the 'pathao-courier/webhooks' subpath:
 *
 * ```typescript
 * import { PathaoWebhookHandler } from 'pathao-courier/webhooks';
 * ```
 *
 * @public
 */

// Export main client
export { PathaoClient, type PathaoClientConfig } from './client';

// Export all types
export * from './types';

// Export all services (for advanced usage)
export { StoreService } from './services/store.service';
export { OrderService } from './services/order.service';
export { LocationService } from './services/location.service';
export { PricingService } from './services/pricing.service';
export { AuthService, type AuthServiceConfig } from './services/auth.service';

// Export constants and enums
export {
  BASE_URLS,
  ENDPOINTS,
  DeliveryType,
  ItemType,
  PathaoWebhookEvent,
  WEBHOOK_EVENT_TYPES,
  WEBHOOK_HEADERS,
  DEFAULT_WEBHOOK_INTEGRATION_SECRET,
} from './constants';

// Export webhook utilities
export * from './webhooks';

// Export error classes
export {
  PathaoError,
  PathaoApiError,
  PathaoValidationError,
  PathaoAuthError,
  PathaoWebhookError,
} from './utils/errors';

// Export validation utilities
export {
  validateStoreName,
  validateContactName,
  validatePhoneNumber,
  validateRecipientName,
  validateStoreAddress,
  validateRecipientAddress,
  validateItemWeight,
  validateItemQuantity,
  validateAmountToCollect,
  validateCityId,
  validateZoneId,
  validateAreaId,
  validateStoreId,
} from './utils/validation';
