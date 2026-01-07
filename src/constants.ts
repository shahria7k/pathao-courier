/**
 * Base URLs for different Pathao Courier API environments
 *
 * @public
 */
export const BASE_URLS = {
  /** Sandbox environment URL for testing */
  sandbox: 'https://courier-api-sandbox.pathao.com',
  /** Production environment URL */
  production: 'https://api-hermes.pathao.com',
} as const;

/**
 * API endpoint paths for Pathao Courier Merchant API
 *
 * All endpoints are relative to the base URL. Some endpoints are functions
 * that accept parameters to build the full path.
 *
 * @public
 */
export const ENDPOINTS = {
  /** OAuth 2.0 token issuance endpoint */
  issueToken: '/aladdin/api/v1/issue-token',
  /** Stores management endpoint (GET list, POST create) */
  stores: '/aladdin/api/v1/stores',
  /** Orders management endpoint (POST create) */
  orders: '/aladdin/api/v1/orders',
  /** Bulk orders creation endpoint */
  bulkOrders: '/aladdin/api/v1/orders/bulk',
  /**
   * Order information endpoint
   *
   * @param consignmentId - The consignment ID of the order
   * @returns The endpoint path for the specific order
   */
  orderInfo: (consignmentId: string) => `/aladdin/api/v1/orders/${consignmentId}/info`,
  /** Cities list endpoint */
  cityList: '/aladdin/api/v1/city-list',
  /**
   * Zones list endpoint for a specific city
   *
   * @param cityId - The ID of the city
   * @returns The endpoint path for zones in the specified city
   */
  zoneList: (cityId: number) => `/aladdin/api/v1/cities/${cityId}/zone-list`,
  /**
   * Areas list endpoint for a specific zone
   *
   * @param zoneId - The ID of the zone
   * @returns The endpoint path for areas in the specified zone
   */
  areaList: (zoneId: number) => `/aladdin/api/v1/zones/${zoneId}/area-list`,
  /** Price calculation endpoint */
  pricePlan: '/aladdin/api/v1/merchant/price-plan',
} as const;

/**
 * Delivery type options for orders
 *
 * @public
 */
export enum DeliveryType {
  /** Normal delivery (48 hours) */
  Normal = 48,
  /** On-demand delivery (12 hours) */
  OnDemand = 12,
}

/**
 * Item type options for orders
 *
 * @public
 */
export enum ItemType {
  /** Document type (letters, papers, etc.) */
  Document = 1,
  /** Parcel type (packages, boxes, etc.) */
  Parcel = 2,
}

/**
 * Webhook event type enum for PathaoWebhookHandler
 *
 * These are the event names used when subscribing to webhook events via the
 * EventEmitter pattern. They correspond to the string event types received from Pathao.
 *
 * @public
 */
export enum PathaoWebhookEvent {
  /** Generic webhook event (emitted for all webhooks) */
  WEBHOOK = 'WEBHOOK',
  /** Order created event */
  ORDER_CREATED = 'ORDER_CREATED',
  /** Order updated event */
  ORDER_UPDATED = 'ORDER_UPDATED',
  /** Pickup requested event */
  ORDER_PICKUP_REQUESTED = 'ORDER_PICKUP_REQUESTED',
  /** Rider assigned for pickup event */
  ORDER_ASSIGNED_FOR_PICKUP = 'ORDER_ASSIGNED_FOR_PICKUP',
  /** Order picked up event */
  ORDER_PICKED = 'ORDER_PICKED',
  /** Pickup failed event */
  ORDER_PICKUP_FAILED = 'ORDER_PICKUP_FAILED',
  /** Pickup cancelled event */
  ORDER_PICKUP_CANCELLED = 'ORDER_PICKUP_CANCELLED',
  /** Order at sorting hub event */
  ORDER_AT_THE_SORTING_HUB = 'ORDER_AT_THE_SORTING_HUB',
  /** Order in transit event */
  ORDER_IN_TRANSIT = 'ORDER_IN_TRANSIT',
  /** Order received at last mile hub event */
  ORDER_RECEIVED_AT_LAST_MILE_HUB = 'ORDER_RECEIVED_AT_LAST_MILE_HUB',
  /** Rider assigned for delivery event */
  ORDER_ASSIGNED_FOR_DELIVERY = 'ORDER_ASSIGNED_FOR_DELIVERY',
  /** Order delivered event */
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  /** Partial delivery event */
  ORDER_PARTIAL_DELIVERY = 'ORDER_PARTIAL_DELIVERY',
  /** Order returned event */
  ORDER_RETURNED = 'ORDER_RETURNED',
  /** Delivery failed event */
  ORDER_DELIVERY_FAILED = 'ORDER_DELIVERY_FAILED',
  /** Order on hold event */
  ORDER_ON_HOLD = 'ORDER_ON_HOLD',
  /** Order paid event */
  ORDER_PAID = 'ORDER_PAID',
  /** Paid return event */
  ORDER_PAID_RETURN = 'ORDER_PAID_RETURN',
  /** Order exchanged event */
  ORDER_EXCHANGED = 'ORDER_EXCHANGED',
  /** Store created event */
  STORE_CREATED = 'STORE_CREATED',
  /** Store updated event */
  STORE_UPDATED = 'STORE_UPDATED',
  /** Error event (emitted when webhook processing fails) */
  ERROR = 'ERROR',
}

/**
 * Webhook event type strings as received from Pathao API
 *
 * These are the actual event string values in webhook payloads. Use these
 * constants when checking the `event` field in webhook payloads.
 *
 * @public
 */
export const WEBHOOK_EVENT_TYPES = {
  /** Order created event string */
  ORDER_CREATED: 'order.created',
  /** Order updated event string */
  ORDER_UPDATED: 'order.updated',
  /** Pickup requested event string */
  ORDER_PICKUP_REQUESTED: 'order.pickup-requested',
  /** Assigned for pickup event string */
  ORDER_ASSIGNED_FOR_PICKUP: 'order.assigned-for-pickup',
  /** Order picked event string */
  ORDER_PICKED: 'order.picked',
  /** Pickup failed event string */
  ORDER_PICKUP_FAILED: 'order.pickup-failed',
  /** Pickup cancelled event string */
  ORDER_PICKUP_CANCELLED: 'order.pickup-cancelled',
  /** At sorting hub event string */
  ORDER_AT_THE_SORTING_HUB: 'order.at-the-sorting-hub',
  /** In transit event string */
  ORDER_IN_TRANSIT: 'order.in-transit',
  /** Received at last mile hub event string */
  ORDER_RECEIVED_AT_LAST_MILE_HUB: 'order.received-at-last-mile-hub',
  /** Assigned for delivery event string */
  ORDER_ASSIGNED_FOR_DELIVERY: 'order.assigned-for-delivery',
  /** Order delivered event string */
  ORDER_DELIVERED: 'order.delivered',
  /** Partial delivery event string */
  ORDER_PARTIAL_DELIVERY: 'order.partial-delivery',
  /** Order returned event string */
  ORDER_RETURNED: 'order.returned',
  /** Delivery failed event string */
  ORDER_DELIVERY_FAILED: 'order.delivery-failed',
  /** Order on hold event string */
  ORDER_ON_HOLD: 'order.on-hold',
  /** Order paid event string */
  ORDER_PAID: 'order.paid',
  /** Paid return event string */
  ORDER_PAID_RETURN: 'order.paid-return',
  /** Order exchanged event string */
  ORDER_EXCHANGED: 'order.exchanged',
  /** Store created event string */
  STORE_CREATED: 'store.created',
  /** Store updated event string */
  STORE_UPDATED: 'store.updated',
} as const;

/**
 * Webhook HTTP header names used by Pathao
 *
 * @public
 */
export const WEBHOOK_HEADERS = {
  /** Header name for webhook signature verification */
  SIGNATURE: 'X-PATHAO-Signature',
  /** Header name for integration secret (must be returned in response) */
  INTEGRATION_SECRET: 'X-Pathao-Merchant-Webhook-Integration-Secret',
} as const;

/**
 * Default webhook integration secret for test responses
 *
 * This is the standard integration secret that should be returned in the
 * X-Pathao-Merchant-Webhook-Integration-Secret header for all webhook responses.
 *
 * @public
 */
export const DEFAULT_WEBHOOK_INTEGRATION_SECRET = 'f3992ecc-59da-4cbe-a049-a13da2018d51';
