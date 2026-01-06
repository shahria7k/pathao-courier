/**
 * Base webhook payload structure
 */
export interface BaseWebhookPayload {
  event: string;
  updated_at: string;
  timestamp: string;
}

/**
 * Order webhook payload base
 */
export interface OrderWebhookPayload extends BaseWebhookPayload {
  consignment_id: string;
  merchant_order_id?: string;
  store_id: number;
  delivery_fee?: number;
}

/**
 * Order created webhook
 */
export interface OrderCreatedWebhook extends OrderWebhookPayload {
  event: 'order.created';
  delivery_fee: number;
}

/**
 * Order updated webhook
 */
export interface OrderUpdatedWebhook extends OrderWebhookPayload {
  event: 'order.updated';
  delivery_fee: number;
}

/**
 * Order pickup requested webhook
 */
export interface OrderPickupRequestedWebhook extends OrderWebhookPayload {
  event: 'order.pickup-requested';
  delivery_fee: number;
}

/**
 * Order assigned for pickup webhook
 */
export interface OrderAssignedForPickupWebhook extends OrderWebhookPayload {
  event: 'order.assigned-for-pickup';
}

/**
 * Order picked webhook
 */
export interface OrderPickedWebhook extends OrderWebhookPayload {
  event: 'order.picked';
}

/**
 * Order pickup failed webhook
 */
export interface OrderPickupFailedWebhook extends OrderWebhookPayload {
  event: 'order.pickup-failed';
}

/**
 * Order pickup cancelled webhook
 */
export interface OrderPickupCancelledWebhook extends OrderWebhookPayload {
  event: 'order.pickup-cancelled';
}

/**
 * Order at the sorting hub webhook
 */
export interface OrderAtTheSortingHubWebhook extends OrderWebhookPayload {
  event: 'order.at-the-sorting-hub';
}

/**
 * Order in transit webhook
 */
export interface OrderInTransitWebhook extends OrderWebhookPayload {
  event: 'order.in-transit';
}

/**
 * Order received at last mile hub webhook
 */
export interface OrderReceivedAtLastMileHubWebhook extends OrderWebhookPayload {
  event: 'order.received-at-last-mile-hub';
}

/**
 * Order assigned for delivery webhook
 */
export interface OrderAssignedForDeliveryWebhook extends OrderWebhookPayload {
  event: 'order.assigned-for-delivery';
}

/**
 * Order delivered webhook
 */
export interface OrderDeliveredWebhook extends OrderWebhookPayload {
  event: 'order.delivered';
  collected_amount: number;
}

/**
 * Order partial delivery webhook
 */
export interface OrderPartialDeliveryWebhook extends OrderWebhookPayload {
  event: 'order.partial-delivery';
  collected_amount: number;
  reason?: string;
}

/**
 * Order returned webhook
 */
export interface OrderReturnedWebhook extends OrderWebhookPayload {
  event: 'order.returned';
  reason?: string;
}

/**
 * Order delivery failed webhook
 */
export interface OrderDeliveryFailedWebhook extends OrderWebhookPayload {
  event: 'order.delivery-failed';
  reason?: string;
}

/**
 * Order on hold webhook
 */
export interface OrderOnHoldWebhook extends OrderWebhookPayload {
  event: 'order.on-hold';
  reason?: string;
}

/**
 * Order paid webhook
 */
export interface OrderPaidWebhook extends OrderWebhookPayload {
  event: 'order.paid';
  invoice_id: string;
}

/**
 * Order paid return webhook
 */
export interface OrderPaidReturnWebhook extends OrderWebhookPayload {
  event: 'order.paid-return';
  collected_amount: number;
  reason?: string;
}

/**
 * Order exchanged webhook
 */
export interface OrderExchangedWebhook extends OrderWebhookPayload {
  event: 'order.exchanged';
  collected_amount: number;
  reason?: string;
}

/**
 * Store webhook payload base
 */
export interface StoreWebhookPayload extends BaseWebhookPayload {
  store_id: number;
  store_name: string;
  store_address: string;
  is_active: number;
}

/**
 * Store created webhook
 */
export interface StoreCreatedWebhook extends StoreWebhookPayload {
  event: 'store.created';
}

/**
 * Store updated webhook
 */
export interface StoreUpdatedWebhook extends StoreWebhookPayload {
  event: 'store.updated';
}

/**
 * Union type for all webhook payloads
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
 * Webhook success response
 */
export interface WebhookSuccessResponse {
  status: 'success';
}

/**
 * Webhook error response
 */
export interface WebhookErrorResponse {
  status: 'error';
  message: string;
}

/**
 * Webhook response
 */
export type WebhookResponse = WebhookSuccessResponse | WebhookErrorResponse;
