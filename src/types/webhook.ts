/**
 * Base webhook payload structure common to all webhook events
 *
 * @public
 */
export interface BaseWebhookPayload {
  /** Event type string (e.g., 'order.created', 'store.updated') */
  event: string;
  /** Last update timestamp (ISO 8601 format) */
  updated_at: string;
  /** Event timestamp (ISO 8601 format) */
  timestamp: string;
}

/**
 * Base structure for all order-related webhook payloads
 *
 * @public
 */
export interface OrderWebhookPayload extends BaseWebhookPayload {
  /** Pathao consignment ID (tracking number) */
  consignment_id: string;
  /** Merchant's internal order ID (if provided during order creation) */
  merchant_order_id?: string;
  /** Store ID where the order originates from */
  store_id: number;
  /** Delivery fee in smallest currency unit (present in some events) */
  delivery_fee?: number;
}

/**
 * Webhook payload for 'order.created' event
 *
 * Triggered when a new order is created in the Pathao system.
 *
 * @public
 */
export interface OrderCreatedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.created' */
  event: 'order.created';
  /** Delivery fee in smallest currency unit */
  delivery_fee: number;
}

/**
 * Webhook payload for 'order.updated' event
 *
 * Triggered when an order's details are updated.
 *
 * @public
 */
export interface OrderUpdatedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.updated' */
  event: 'order.updated';
  /** Delivery fee in smallest currency unit */
  delivery_fee: number;
}

/**
 * Webhook payload for 'order.pickup-requested' event
 *
 * Triggered when a pickup is requested for an order.
 *
 * @public
 */
export interface OrderPickupRequestedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.pickup-requested' */
  event: 'order.pickup-requested';
  /** Delivery fee in smallest currency unit */
  delivery_fee: number;
}

/**
 * Webhook payload for 'order.assigned-for-pickup' event
 *
 * Triggered when a rider is assigned to pick up an order.
 *
 * @public
 */
export interface OrderAssignedForPickupWebhook extends OrderWebhookPayload {
  /** Event type: 'order.assigned-for-pickup' */
  event: 'order.assigned-for-pickup';
}

/**
 * Webhook payload for 'order.picked' event
 *
 * Triggered when an order is successfully picked up by the rider.
 *
 * @public
 */
export interface OrderPickedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.picked' */
  event: 'order.picked';
}

/**
 * Webhook payload for 'order.pickup-failed' event
 *
 * Triggered when a pickup attempt fails.
 *
 * @public
 */
export interface OrderPickupFailedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.pickup-failed' */
  event: 'order.pickup-failed';
}

/**
 * Webhook payload for 'order.pickup-cancelled' event
 *
 * Triggered when a pickup is cancelled.
 *
 * @public
 */
export interface OrderPickupCancelledWebhook extends OrderWebhookPayload {
  /** Event type: 'order.pickup-cancelled' */
  event: 'order.pickup-cancelled';
}

/**
 * Webhook payload for 'order.at-the-sorting-hub' event
 *
 * Triggered when an order arrives at the sorting hub.
 *
 * @public
 */
export interface OrderAtTheSortingHubWebhook extends OrderWebhookPayload {
  /** Event type: 'order.at-the-sorting-hub' */
  event: 'order.at-the-sorting-hub';
}

/**
 * Webhook payload for 'order.in-transit' event
 *
 * Triggered when an order is in transit to the destination.
 *
 * @public
 */
export interface OrderInTransitWebhook extends OrderWebhookPayload {
  /** Event type: 'order.in-transit' */
  event: 'order.in-transit';
}

/**
 * Webhook payload for 'order.received-at-last-mile-hub' event
 *
 * Triggered when an order is received at the last mile hub (near destination).
 *
 * @public
 */
export interface OrderReceivedAtLastMileHubWebhook extends OrderWebhookPayload {
  /** Event type: 'order.received-at-last-mile-hub' */
  event: 'order.received-at-last-mile-hub';
}

/**
 * Webhook payload for 'order.assigned-for-delivery' event
 *
 * Triggered when a rider is assigned to deliver an order.
 *
 * @public
 */
export interface OrderAssignedForDeliveryWebhook extends OrderWebhookPayload {
  /** Event type: 'order.assigned-for-delivery' */
  event: 'order.assigned-for-delivery';
}

/**
 * Webhook payload for 'order.delivered' event
 *
 * Triggered when an order is successfully delivered to the recipient.
 *
 * @public
 */
export interface OrderDeliveredWebhook extends OrderWebhookPayload {
  /** Event type: 'order.delivered' */
  event: 'order.delivered';
  /** Amount collected from recipient (COD) in smallest currency unit */
  collected_amount: number;
}

/**
 * Webhook payload for 'order.partial-delivery' event
 *
 * Triggered when an order is partially delivered (some items delivered, some not).
 *
 * @public
 */
export interface OrderPartialDeliveryWebhook extends OrderWebhookPayload {
  /** Event type: 'order.partial-delivery' */
  event: 'order.partial-delivery';
  /** Amount collected from recipient in smallest currency unit */
  collected_amount: number;
  /** Reason for partial delivery (optional) */
  reason?: string;
}

/**
 * Webhook payload for 'order.returned' event
 *
 * Triggered when an order is returned to the sender.
 *
 * @public
 */
export interface OrderReturnedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.returned' */
  event: 'order.returned';
  /** Reason for return (optional) */
  reason?: string;
}

/**
 * Webhook payload for 'order.delivery-failed' event
 *
 * Triggered when a delivery attempt fails.
 *
 * @public
 */
export interface OrderDeliveryFailedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.delivery-failed' */
  event: 'order.delivery-failed';
  /** Reason for delivery failure (optional) */
  reason?: string;
}

/**
 * Webhook payload for 'order.on-hold' event
 *
 * Triggered when an order is put on hold.
 *
 * @public
 */
export interface OrderOnHoldWebhook extends OrderWebhookPayload {
  /** Event type: 'order.on-hold' */
  event: 'order.on-hold';
  /** Reason for putting order on hold (optional) */
  reason?: string;
}

/**
 * Webhook payload for 'order.paid' event
 *
 * Triggered when an order payment is processed.
 *
 * @public
 */
export interface OrderPaidWebhook extends OrderWebhookPayload {
  /** Event type: 'order.paid' */
  event: 'order.paid';
  /** Invoice ID for the payment */
  invoice_id: string;
}

/**
 * Webhook payload for 'order.paid-return' event
 *
 * Triggered when a returned order payment is processed.
 *
 * @public
 */
export interface OrderPaidReturnWebhook extends OrderWebhookPayload {
  /** Event type: 'order.paid-return' */
  event: 'order.paid-return';
  /** Amount collected/returned in smallest currency unit */
  collected_amount: number;
  /** Reason for paid return (optional) */
  reason?: string;
}

/**
 * Webhook payload for 'order.exchanged' event
 *
 * Triggered when an order is exchanged (replaced with another item).
 *
 * @public
 */
export interface OrderExchangedWebhook extends OrderWebhookPayload {
  /** Event type: 'order.exchanged' */
  event: 'order.exchanged';
  /** Amount collected in smallest currency unit */
  collected_amount: number;
  /** Reason for exchange (optional) */
  reason?: string;
}

/**
 * Base structure for all store-related webhook payloads
 *
 * @public
 */
export interface StoreWebhookPayload extends BaseWebhookPayload {
  /** Store ID */
  store_id: number;
  /** Store name */
  store_name: string;
  /** Store address */
  store_address: string;
  /** Whether the store is active (1 = active, 0 = inactive) */
  is_active: number;
}

/**
 * Webhook payload for 'store.created' event
 *
 * Triggered when a new store is created in the Pathao system.
 *
 * @public
 */
export interface StoreCreatedWebhook extends StoreWebhookPayload {
  /** Event type: 'store.created' */
  event: 'store.created';
}

/**
 * Webhook payload for 'store.updated' event
 *
 * Triggered when a store's details are updated.
 *
 * @public
 */
export interface StoreUpdatedWebhook extends StoreWebhookPayload {
  /** Event type: 'store.updated' */
  event: 'store.updated';
}

/**
 * Union type representing all possible webhook payload types
 *
 * Use this type when handling webhooks generically. For type-safe handling,
 * use the specific webhook interfaces or type guards.
 *
 * @public
 */
export type WebhookPayload =
  | OrderCreatedWebhook
  | OrderUpdatedWebhook
  | OrderPickupRequestedWebhook
  | OrderAssignedForPickupWebhook
  | OrderPickedWebhook
  | OrderPickupFailedWebhook
  | OrderPickupCancelledWebhook
  | OrderAtTheSortingHubWebhook
  | OrderInTransitWebhook
  | OrderReceivedAtLastMileHubWebhook
  | OrderAssignedForDeliveryWebhook
  | OrderDeliveredWebhook
  | OrderPartialDeliveryWebhook
  | OrderReturnedWebhook
  | OrderDeliveryFailedWebhook
  | OrderOnHoldWebhook
  | OrderPaidWebhook
  | OrderPaidReturnWebhook
  | OrderExchangedWebhook
  | StoreCreatedWebhook
  | StoreUpdatedWebhook;

/**
 * Success response to send back to Pathao webhook endpoint
 *
 * @public
 */
export interface WebhookSuccessResponse {
  /** Response status: 'success' */
  status: 'success';
}

/**
 * Error response to send back to Pathao webhook endpoint
 *
 * @public
 */
export interface WebhookErrorResponse {
  /** Response status: 'error' */
  status: 'error';
  /** Error message describing what went wrong */
  message: string;
}

/**
 * Union type for webhook response (success or error)
 *
 * @public
 */
export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;
