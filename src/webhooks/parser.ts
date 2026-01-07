import { PathaoWebhookError } from '../utils/errors';
import { WEBHOOK_EVENT_TYPES } from '../constants';
import type {
  WebhookPayload,
  OrderCreatedWebhook,
  OrderUpdatedWebhook,
  OrderPickupRequestedWebhook,
  OrderAssignedForPickupWebhook,
  OrderPickedWebhook,
  OrderPickupFailedWebhook,
  OrderPickupCancelledWebhook,
  OrderAtTheSortingHubWebhook,
  OrderInTransitWebhook,
  OrderReceivedAtLastMileHubWebhook,
  OrderAssignedForDeliveryWebhook,
  OrderDeliveredWebhook,
  OrderPartialDeliveryWebhook,
  OrderReturnedWebhook,
  OrderDeliveryFailedWebhook,
  OrderOnHoldWebhook,
  OrderPaidWebhook,
  OrderPaidReturnWebhook,
  OrderExchangedWebhook,
  StoreCreatedWebhook,
  StoreUpdatedWebhook,
} from '../types/webhook';

/**
 * Parses and validates a webhook payload, returning a typed webhook object
 *
 * This function validates the webhook payload structure and returns a type-safe
 * webhook object based on the event type. It supports all 21 webhook event types
 * from Pathao Courier API.
 *
 * @param data - The raw webhook payload (typically from request body)
 * @returns A typed webhook payload object matching the event type
 * @throws {PathaoWebhookError} If payload is invalid, missing event field, or event type is unknown
 *
 * @example
 * ```typescript
 * const payload = parseWebhookPayload(req.body);
 * // payload is now typed as OrderCreatedWebhook, OrderDeliveredWebhook, etc.
 *
 * if (payload.event === 'order.created') {
 *   // TypeScript knows payload is OrderCreatedWebhook
 *   console.log(payload.consignment_id);
 * }
 * ```
 *
 * @public
 */
export function parseWebhookPayload(data: unknown): WebhookPayload {
  if (!data || typeof data !== 'object') {
    throw new PathaoWebhookError('Invalid webhook payload: must be an object');
  }

  const payload = data as Record<string, unknown>;

  if (!payload.event || typeof payload.event !== 'string') {
    throw new PathaoWebhookError('Invalid webhook payload: missing or invalid event field');
  }

  // Parse based on event type
  switch (payload.event) {
    case WEBHOOK_EVENT_TYPES.ORDER_CREATED:
      return payload as unknown as OrderCreatedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_UPDATED:
      return payload as unknown as OrderUpdatedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PICKUP_REQUESTED:
      return payload as unknown as OrderPickupRequestedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_ASSIGNED_FOR_PICKUP:
      return payload as unknown as OrderAssignedForPickupWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PICKED:
      return payload as unknown as OrderPickedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PICKUP_FAILED:
      return payload as unknown as OrderPickupFailedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PICKUP_CANCELLED:
      return payload as unknown as OrderPickupCancelledWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_AT_THE_SORTING_HUB:
      return payload as unknown as OrderAtTheSortingHubWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_IN_TRANSIT:
      return payload as unknown as OrderInTransitWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_RECEIVED_AT_LAST_MILE_HUB:
      return payload as unknown as OrderReceivedAtLastMileHubWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_ASSIGNED_FOR_DELIVERY:
      return payload as unknown as OrderAssignedForDeliveryWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_DELIVERED:
      return payload as unknown as OrderDeliveredWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PARTIAL_DELIVERY:
      return payload as unknown as OrderPartialDeliveryWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_RETURNED:
      return payload as unknown as OrderReturnedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_DELIVERY_FAILED:
      return payload as unknown as OrderDeliveryFailedWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_ON_HOLD:
      return payload as unknown as OrderOnHoldWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PAID:
      return payload as unknown as OrderPaidWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_PAID_RETURN:
      return payload as unknown as OrderPaidReturnWebhook;
    case WEBHOOK_EVENT_TYPES.ORDER_EXCHANGED:
      return payload as unknown as OrderExchangedWebhook;
    case WEBHOOK_EVENT_TYPES.STORE_CREATED:
      return payload as unknown as StoreCreatedWebhook;
    case WEBHOOK_EVENT_TYPES.STORE_UPDATED:
      return payload as unknown as StoreUpdatedWebhook;
    default:
      throw new PathaoWebhookError(`Unknown webhook event type: ${payload.event}`);
  }
}

/**
 * Type guard to check if a webhook payload is an order-related webhook
 *
 * This function narrows the type of a WebhookPayload to one of the 19 order webhook types.
 * Useful for type-safe handling of order events.
 *
 * @param payload - The webhook payload to check
 * @returns True if the payload is an order webhook, false otherwise
 *
 * @example
 * ```typescript
 * const payload = parseWebhookPayload(req.body);
 *
 * if (isOrderWebhook(payload)) {
 *   // TypeScript knows payload is one of the order webhook types
 *   console.log('Order event:', payload.consignment_id);
 * }
 * ```
 *
 * @public
 */
export function isOrderWebhook(
  payload: WebhookPayload
): payload is
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
  | OrderExchangedWebhook {
  return payload.event.startsWith('order.');
}

/**
 * Type guard to check if a webhook payload is a store-related webhook
 *
 * This function narrows the type of a WebhookPayload to one of the 2 store webhook types.
 * Useful for type-safe handling of store events.
 *
 * @param payload - The webhook payload to check
 * @returns True if the payload is a store webhook, false otherwise
 *
 * @example
 * ```typescript
 * const payload = parseWebhookPayload(req.body);
 *
 * if (isStoreWebhook(payload)) {
 *   // TypeScript knows payload is StoreCreatedWebhook or StoreUpdatedWebhook
 *   console.log('Store event:', payload.store_id);
 * }
 * ```
 *
 * @public
 */
export function isStoreWebhook(
  payload: WebhookPayload
): payload is StoreCreatedWebhook | StoreUpdatedWebhook {
  return payload.event.startsWith('store.');
}
