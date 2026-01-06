// Export main client
export { PathaoClient, type PathaoClientConfig } from "./client";

// Export all types
export * from "./types";

// Export all services (for advanced usage)
export { StoreService } from "./services/store.service";
export { OrderService } from "./services/order.service";
export { LocationService } from "./services/location.service";
export { PricingService } from "./services/pricing.service";
export { AuthService, type AuthServiceConfig } from "./services/auth.service";

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
} from "./constants";

// Export webhook utilities
export * from "./webhooks";

// Export error classes
export {
	PathaoError,
	PathaoApiError,
	PathaoValidationError,
	PathaoAuthError,
	PathaoWebhookError,
} from "./utils/errors";

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
} from "./utils/validation";
