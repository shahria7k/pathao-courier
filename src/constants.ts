/**
 * Base URLs for different environments
 */
export const BASE_URLS = {
	sandbox: "https://courier-api-sandbox.pathao.com",
	production: "https://api-hermes.pathao.com",
} as const;

/**
 * API endpoints
 */
export const ENDPOINTS = {
	issueToken: "/aladdin/api/v1/issue-token",
	stores: "/aladdin/api/v1/stores",
	orders: "/aladdin/api/v1/orders",
	bulkOrders: "/aladdin/api/v1/orders/bulk",
	orderInfo: (consignmentId: string) => `/aladdin/api/v1/orders/${consignmentId}/info`,
	cityList: "/aladdin/api/v1/city-list",
	zoneList: (cityId: number) => `/aladdin/api/v1/cities/${cityId}/zone-list`,
	areaList: (zoneId: number) => `/aladdin/api/v1/zones/${zoneId}/area-list`,
	pricePlan: "/aladdin/api/v1/merchant/price-plan",
} as const;

/**
 * Delivery types
 */
export enum DeliveryType {
	Normal = 48,
	OnDemand = 12,
}

/**
 * Item types
 */
export enum ItemType {
	Document = 1,
	Parcel = 2,
}

/**
 * Webhook event types
 */
export enum PathaoWebhookEvent {
	WEBHOOK = "WEBHOOK",
	ORDER_CREATED = "ORDER_CREATED",
	ORDER_UPDATED = "ORDER_UPDATED",
	ORDER_PICKUP_REQUESTED = "ORDER_PICKUP_REQUESTED",
	ORDER_ASSIGNED_FOR_PICKUP = "ORDER_ASSIGNED_FOR_PICKUP",
	ORDER_PICKED = "ORDER_PICKED",
	ORDER_PICKUP_FAILED = "ORDER_PICKUP_FAILED",
	ORDER_PICKUP_CANCELLED = "ORDER_PICKUP_CANCELLED",
	ORDER_AT_THE_SORTING_HUB = "ORDER_AT_THE_SORTING_HUB",
	ORDER_IN_TRANSIT = "ORDER_IN_TRANSIT",
	ORDER_RECEIVED_AT_LAST_MILE_HUB = "ORDER_RECEIVED_AT_LAST_MILE_HUB",
	ORDER_ASSIGNED_FOR_DELIVERY = "ORDER_ASSIGNED_FOR_DELIVERY",
	ORDER_DELIVERED = "ORDER_DELIVERED",
	ORDER_PARTIAL_DELIVERY = "ORDER_PARTIAL_DELIVERY",
	ORDER_RETURNED = "ORDER_RETURNED",
	ORDER_DELIVERY_FAILED = "ORDER_DELIVERY_FAILED",
	ORDER_ON_HOLD = "ORDER_ON_HOLD",
	ORDER_PAID = "ORDER_PAID",
	ORDER_PAID_RETURN = "ORDER_PAID_RETURN",
	ORDER_EXCHANGED = "ORDER_EXCHANGED",
	STORE_CREATED = "STORE_CREATED",
	STORE_UPDATED = "STORE_UPDATED",
	ERROR = "ERROR",
}

/**
 * Webhook event type strings (as received from API)
 */
export const WEBHOOK_EVENT_TYPES = {
	ORDER_CREATED: "order.created",
	ORDER_UPDATED: "order.updated",
	ORDER_PICKUP_REQUESTED: "order.pickup-requested",
	ORDER_ASSIGNED_FOR_PICKUP: "order.assigned-for-pickup",
	ORDER_PICKED: "order.picked",
	ORDER_PICKUP_FAILED: "order.pickup-failed",
	ORDER_PICKUP_CANCELLED: "order.pickup-cancelled",
	ORDER_AT_THE_SORTING_HUB: "order.at-the-sorting-hub",
	ORDER_IN_TRANSIT: "order.in-transit",
	ORDER_RECEIVED_AT_LAST_MILE_HUB: "order.received-at-last-mile-hub",
	ORDER_ASSIGNED_FOR_DELIVERY: "order.assigned-for-delivery",
	ORDER_DELIVERED: "order.delivered",
	ORDER_PARTIAL_DELIVERY: "order.partial-delivery",
	ORDER_RETURNED: "order.returned",
	ORDER_DELIVERY_FAILED: "order.delivery-failed",
	ORDER_ON_HOLD: "order.on-hold",
	ORDER_PAID: "order.paid",
	ORDER_PAID_RETURN: "order.paid-return",
	ORDER_EXCHANGED: "order.exchanged",
	STORE_CREATED: "store.created",
	STORE_UPDATED: "store.updated",
} as const;

/**
 * Webhook header names
 */
export const WEBHOOK_HEADERS = {
	SIGNATURE: "X-PATHAO-Signature",
	INTEGRATION_SECRET: "X-Pathao-Merchant-Webhook-Integration-Secret",
} as const;

/**
 * Default webhook integration secret for test responses
 */
export const DEFAULT_WEBHOOK_INTEGRATION_SECRET =
	"f3992ecc-59da-4cbe-a049-a13da2018d51";
