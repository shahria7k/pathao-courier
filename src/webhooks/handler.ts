import { EventEmitter } from 'events';
import {
  PathaoWebhookEvent,
  WEBHOOK_HEADERS,
  DEFAULT_WEBHOOK_INTEGRATION_SECRET,
} from '../constants';
import { verifySignature } from './verifier';
import { parseWebhookPayload } from './parser';
import type {
  ExpressRequest,
  ExpressResponse,
  ExpressNext,
  FastifyRequest,
  FastifyReply,
  GenericRequest,
  GenericResponse,
} from './types';
import type {
  WebhookPayload,
  WebhookResponse,
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
 * Configuration for the PathaoWebhookHandler
 *
 * @public
 */
export interface PathaoWebhookHandlerConfig {
  /** Webhook secret for signature verification */
  webhookSecret: string;
  /** Integration secret to return in response header. Defaults to a standard value */
  integrationSecret?: string;
}

/**
 * Webhook handler for Pathao Courier webhooks with signature verification and event emission
 *
 * This handler verifies webhook signatures, parses payloads, and emits typed events
 * for easy integration. Supports Express, Fastify, and generic frameworks.
 *
 * @example
 * ```typescript
 * const handler = new PathaoWebhookHandler({
 *   webhookSecret: 'your-webhook-secret'
 * });
 *
 * handler.onOrderDelivered((payload) => {
 *   console.log('Order delivered:', payload.consignment_id);
 * });
 *
 * // Express.js
 * app.post('/webhook', handler.express());
 * ```
 *
 * @public
 */
export class PathaoWebhookHandler extends EventEmitter {
  private readonly webhookSecret: string;
  private readonly integrationSecret: string;

  constructor(config: PathaoWebhookHandlerConfig) {
    super();
    if (!config.webhookSecret) {
      throw new Error('webhookSecret is required');
    }
    this.webhookSecret = config.webhookSecret;
    this.integrationSecret = config.integrationSecret || DEFAULT_WEBHOOK_INTEGRATION_SECRET;
  }

  /**
   * Handles a webhook payload manually with signature verification
   *
   * @param body - The webhook payload (parsed JSON object or raw string)
   * @param signatureHeader - The X-PATHAO-Signature header value
   * @returns Response object indicating success or error
   * @throws {PathaoWebhookError} If signature verification fails
   *
   * @example
   * ```typescript
   * const result = handler.handle(req.body, req.headers['x-pathao-signature']);
   * if (result.status === 'success') {
   *   // Webhook processed successfully
   * }
   * ```
   */
  handle(body: unknown, signatureHeader?: string | null): WebhookResponse {
    try {
      // Verify signature
      verifySignature(signatureHeader, this.webhookSecret, body);

      // Parse payload
      const payload = parseWebhookPayload(body);

      // Emit generic webhook event
      this.emit(PathaoWebhookEvent.WEBHOOK, payload);

      // Emit specific event based on type
      this.emitSpecificEvent(payload);

      return { status: 'success' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emit(PathaoWebhookEvent.ERROR, error);
      return { status: 'error', message: errorMessage };
    }
  }

  /**
   * Emits a specific typed event based on the webhook payload event type
   *
   * This private method is called after parsing a webhook payload to emit
   * the appropriate typed event. It maps the event string to the corresponding
   * PathaoWebhookEvent enum value and emits the event with the typed payload.
   *
   * @param payload - The parsed webhook payload
   *
   * @internal
   */
  private emitSpecificEvent(payload: WebhookPayload): void {
    switch (payload.event) {
      case 'order.created':
        this.emit(PathaoWebhookEvent.ORDER_CREATED, payload);
        break;
      case 'order.updated':
        this.emit(PathaoWebhookEvent.ORDER_UPDATED, payload);
        break;
      case 'order.pickup-requested':
        this.emit(PathaoWebhookEvent.ORDER_PICKUP_REQUESTED, payload);
        break;
      case 'order.assigned-for-pickup':
        this.emit(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_PICKUP, payload);
        break;
      case 'order.picked':
        this.emit(PathaoWebhookEvent.ORDER_PICKED, payload);
        break;
      case 'order.pickup-failed':
        this.emit(PathaoWebhookEvent.ORDER_PICKUP_FAILED, payload);
        break;
      case 'order.pickup-cancelled':
        this.emit(PathaoWebhookEvent.ORDER_PICKUP_CANCELLED, payload);
        break;
      case 'order.at-the-sorting-hub':
        this.emit(PathaoWebhookEvent.ORDER_AT_THE_SORTING_HUB, payload);
        break;
      case 'order.in-transit':
        this.emit(PathaoWebhookEvent.ORDER_IN_TRANSIT, payload);
        break;
      case 'order.received-at-last-mile-hub':
        this.emit(PathaoWebhookEvent.ORDER_RECEIVED_AT_LAST_MILE_HUB, payload);
        break;
      case 'order.assigned-for-delivery':
        this.emit(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_DELIVERY, payload);
        break;
      case 'order.delivered':
        this.emit(PathaoWebhookEvent.ORDER_DELIVERED, payload);
        break;
      case 'order.partial-delivery':
        this.emit(PathaoWebhookEvent.ORDER_PARTIAL_DELIVERY, payload);
        break;
      case 'order.returned':
        this.emit(PathaoWebhookEvent.ORDER_RETURNED, payload);
        break;
      case 'order.delivery-failed':
        this.emit(PathaoWebhookEvent.ORDER_DELIVERY_FAILED, payload);
        break;
      case 'order.on-hold':
        this.emit(PathaoWebhookEvent.ORDER_ON_HOLD, payload);
        break;
      case 'order.paid':
        this.emit(PathaoWebhookEvent.ORDER_PAID, payload);
        break;
      case 'order.paid-return':
        this.emit(PathaoWebhookEvent.ORDER_PAID_RETURN, payload);
        break;
      case 'order.exchanged':
        this.emit(PathaoWebhookEvent.ORDER_EXCHANGED, payload);
        break;
      case 'store.created':
        this.emit(PathaoWebhookEvent.STORE_CREATED, payload);
        break;
      case 'store.updated':
        this.emit(PathaoWebhookEvent.STORE_UPDATED, payload);
        break;
    }
  }

  // Convenience methods for each event type

  /**
   * Registers a handler for the 'order.created' webhook event
   *
   * This event is triggered when a new order is created in the Pathao system.
   *
   * @param handler - Function to handle the order created event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderCreated(async (payload) => {
   *   console.log('New order created:', payload.consignment_id);
   *   await updateDatabase(payload);
   * });
   * ```
   */
  onOrderCreated(handler: (payload: OrderCreatedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_CREATED, (payload: unknown) => {
      const result = handler(payload as OrderCreatedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.updated' webhook event
   *
   * This event is triggered when an order's details are updated.
   *
   * @param handler - Function to handle the order updated event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderUpdated((payload) => {
   *   console.log('Order updated:', payload.consignment_id);
   * });
   * ```
   */
  onOrderUpdated(handler: (payload: OrderUpdatedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_UPDATED, (payload: unknown) => {
      const result = handler(payload as OrderUpdatedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.pickup-requested' webhook event
   *
   * This event is triggered when a pickup is requested for an order.
   *
   * @param handler - Function to handle the pickup requested event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPickupRequested((payload) => {
   *   console.log('Pickup requested for:', payload.consignment_id);
   * });
   * ```
   */
  onOrderPickupRequested(
    handler: (payload: OrderPickupRequestedWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_PICKUP_REQUESTED, (payload: unknown) => {
      const result = handler(payload as OrderPickupRequestedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.assigned-for-pickup' webhook event
   *
   * This event is triggered when a rider is assigned to pick up an order.
   *
   * @param handler - Function to handle the assigned for pickup event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderAssignedForPickup((payload) => {
   *   console.log('Rider assigned for pickup:', payload.consignment_id);
   * });
   * ```
   */
  onOrderAssignedForPickup(
    handler: (payload: OrderAssignedForPickupWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_PICKUP, (payload: unknown) => {
      const result = handler(payload as OrderAssignedForPickupWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.picked' webhook event
   *
   * This event is triggered when an order is successfully picked up by the rider.
   *
   * @param handler - Function to handle the order picked event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPicked((payload) => {
   *   console.log('Order picked:', payload.consignment_id);
   * });
   * ```
   */
  onOrderPicked(handler: (payload: OrderPickedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_PICKED, (payload: unknown) => {
      const result = handler(payload as OrderPickedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.pickup-failed' webhook event
   *
   * This event is triggered when a pickup attempt fails.
   *
   * @param handler - Function to handle the pickup failed event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPickupFailed((payload) => {
   *   console.log('Pickup failed for:', payload.consignment_id);
   * });
   * ```
   */
  onOrderPickupFailed(handler: (payload: OrderPickupFailedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_PICKUP_FAILED, (payload: unknown) => {
      const result = handler(payload as OrderPickupFailedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.pickup-cancelled' webhook event
   *
   * This event is triggered when a pickup is cancelled.
   *
   * @param handler - Function to handle the pickup cancelled event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPickupCancelled((payload) => {
   *   console.log('Pickup cancelled for:', payload.consignment_id);
   * });
   * ```
   */
  onOrderPickupCancelled(
    handler: (payload: OrderPickupCancelledWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_PICKUP_CANCELLED, (payload: unknown) => {
      const result = handler(payload as OrderPickupCancelledWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.at-the-sorting-hub' webhook event
   *
   * This event is triggered when an order arrives at the sorting hub.
   *
   * @param handler - Function to handle the at sorting hub event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderAtTheSortingHub((payload) => {
   *   console.log('Order at sorting hub:', payload.consignment_id);
   * });
   * ```
   */
  onOrderAtTheSortingHub(
    handler: (payload: OrderAtTheSortingHubWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_AT_THE_SORTING_HUB, (payload: unknown) => {
      const result = handler(payload as OrderAtTheSortingHubWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.in-transit' webhook event
   *
   * This event is triggered when an order is in transit to the destination.
   *
   * @param handler - Function to handle the in transit event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderInTransit((payload) => {
   *   console.log('Order in transit:', payload.consignment_id);
   * });
   * ```
   */
  onOrderInTransit(handler: (payload: OrderInTransitWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_IN_TRANSIT, (payload: unknown) => {
      const result = handler(payload as OrderInTransitWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.received-at-last-mile-hub' webhook event
   *
   * This event is triggered when an order is received at the last mile hub (near destination).
   *
   * @param handler - Function to handle the received at last mile hub event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderReceivedAtLastMileHub((payload) => {
   *   console.log('Order at last mile hub:', payload.consignment_id);
   * });
   * ```
   */
  onOrderReceivedAtLastMileHub(
    handler: (payload: OrderReceivedAtLastMileHubWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_RECEIVED_AT_LAST_MILE_HUB, (payload: unknown) => {
      const result = handler(payload as OrderReceivedAtLastMileHubWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.assigned-for-delivery' webhook event
   *
   * This event is triggered when a rider is assigned to deliver an order.
   *
   * @param handler - Function to handle the assigned for delivery event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderAssignedForDelivery((payload) => {
   *   console.log('Rider assigned for delivery:', payload.consignment_id);
   * });
   * ```
   */
  onOrderAssignedForDelivery(
    handler: (payload: OrderAssignedForDeliveryWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_DELIVERY, (payload: unknown) => {
      const result = handler(payload as OrderAssignedForDeliveryWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.delivered' webhook event
   *
   * This event is triggered when an order is successfully delivered to the recipient.
   * The payload includes the collected amount if COD.
   *
   * @param handler - Function to handle the order delivered event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderDelivered(async (payload) => {
   *   console.log('Order delivered:', payload.consignment_id);
   *   console.log('Collected amount:', payload.collected_amount);
   *   await markOrderAsDelivered(payload.consignment_id);
   * });
   * ```
   */
  onOrderDelivered(handler: (payload: OrderDeliveredWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_DELIVERED, (payload: unknown) => {
      const result = handler(payload as OrderDeliveredWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.partial-delivery' webhook event
   *
   * This event is triggered when an order is partially delivered (some items delivered, some not).
   *
   * @param handler - Function to handle the partial delivery event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPartialDelivery((payload) => {
   *   console.log('Partial delivery:', payload.consignment_id);
   *   console.log('Collected amount:', payload.collected_amount);
   * });
   * ```
   */
  onOrderPartialDelivery(
    handler: (payload: OrderPartialDeliveryWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_PARTIAL_DELIVERY, (payload: unknown) => {
      const result = handler(payload as OrderPartialDeliveryWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.returned' webhook event
   *
   * This event is triggered when an order is returned to the sender.
   *
   * @param handler - Function to handle the order returned event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderReturned((payload) => {
   *   console.log('Order returned:', payload.consignment_id);
   * });
   * ```
   */
  onOrderReturned(handler: (payload: OrderReturnedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_RETURNED, (payload: unknown) => {
      const result = handler(payload as OrderReturnedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.delivery-failed' webhook event
   *
   * This event is triggered when a delivery attempt fails.
   *
   * @param handler - Function to handle the delivery failed event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderDeliveryFailed((payload) => {
   *   console.log('Delivery failed for:', payload.consignment_id);
   * });
   * ```
   */
  onOrderDeliveryFailed(
    handler: (payload: OrderDeliveryFailedWebhook) => void | Promise<void>
  ): this {
    this.on(PathaoWebhookEvent.ORDER_DELIVERY_FAILED, (payload: unknown) => {
      const result = handler(payload as OrderDeliveryFailedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.on-hold' webhook event
   *
   * This event is triggered when an order is put on hold.
   *
   * @param handler - Function to handle the order on hold event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderOnHold((payload) => {
   *   console.log('Order on hold:', payload.consignment_id);
   * });
   * ```
   */
  onOrderOnHold(handler: (payload: OrderOnHoldWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_ON_HOLD, (payload: unknown) => {
      const result = handler(payload as OrderOnHoldWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.paid' webhook event
   *
   * This event is triggered when an order payment is processed.
   * The payload includes invoice information.
   *
   * @param handler - Function to handle the order paid event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPaid((payload) => {
   *   console.log('Order paid:', payload.consignment_id);
   *   console.log('Invoice ID:', payload.invoice_id);
   * });
   * ```
   */
  onOrderPaid(handler: (payload: OrderPaidWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_PAID, (payload: unknown) => {
      const result = handler(payload as OrderPaidWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.paid-return' webhook event
   *
   * This event is triggered when a returned order payment is processed.
   *
   * @param handler - Function to handle the paid return event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderPaidReturn((payload) => {
   *   console.log('Paid return:', payload.consignment_id);
   *   console.log('Collected amount:', payload.collected_amount);
   * });
   * ```
   */
  onOrderPaidReturn(handler: (payload: OrderPaidReturnWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_PAID_RETURN, (payload: unknown) => {
      const result = handler(payload as OrderPaidReturnWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'order.exchanged' webhook event
   *
   * This event is triggered when an order is exchanged (replaced with another item).
   *
   * @param handler - Function to handle the order exchanged event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onOrderExchanged((payload) => {
   *   console.log('Order exchanged:', payload.consignment_id);
   *   console.log('Collected amount:', payload.collected_amount);
   * });
   * ```
   */
  onOrderExchanged(handler: (payload: OrderExchangedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.ORDER_EXCHANGED, (payload: unknown) => {
      const result = handler(payload as OrderExchangedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'store.created' webhook event
   *
   * This event is triggered when a new store is created in the Pathao system.
   *
   * @param handler - Function to handle the store created event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onStoreCreated((payload) => {
   *   console.log('Store created:', payload.store_id);
   *   console.log('Store name:', payload.store_name);
   * });
   * ```
   */
  onStoreCreated(handler: (payload: StoreCreatedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.STORE_CREATED, (payload: unknown) => {
      const result = handler(payload as StoreCreatedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Registers a handler for the 'store.updated' webhook event
   *
   * This event is triggered when a store's details are updated.
   *
   * @param handler - Function to handle the store updated event. Can be async.
   * @returns The handler instance for method chaining
   *
   * @example
   * ```typescript
   * handler.onStoreUpdated((payload) => {
   *   console.log('Store updated:', payload.store_id);
   *   console.log('New store name:', payload.store_name);
   * });
   * ```
   */
  onStoreUpdated(handler: (payload: StoreUpdatedWebhook) => void | Promise<void>): this {
    this.on(PathaoWebhookEvent.STORE_UPDATED, (payload: unknown) => {
      const result = handler(payload as StoreUpdatedWebhook);
      if (result instanceof Promise) {
        void result.catch((error) => {
          this.emit(PathaoWebhookEvent.ERROR, error);
        });
      }
    });
    return this;
  }

  /**
   * Returns an Express.js middleware function for handling webhooks
   *
   * @returns Express middleware function that handles webhook requests
   *
   * @example
   * ```typescript
   * app.post('/webhook', handler.express());
   * ```
   */
  express(): (req: ExpressRequest, res: ExpressResponse, next?: ExpressNext) => Promise<void> {
    return (req: ExpressRequest, res: ExpressResponse, _next?: ExpressNext): Promise<void> => {
      try {
        const signatureHeader = req.headers[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()];
        const signature = Array.isArray(signatureHeader)
          ? signatureHeader[0]
          : typeof signatureHeader === 'string'
            ? signatureHeader
            : undefined;
        const result = this.handle(req.body, signature);

        // Set required response header
        res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);

        if (result.status === 'success') {
          res.status(200).json(result);
        } else {
          res.status(400).json(result);
        }
        return Promise.resolve();
      } catch (error) {
        res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
        res.status(500).json({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        return Promise.resolve();
      }
    };
  }

  /**
   * Returns a Fastify route handler function for handling webhooks
   *
   * @returns Fastify route handler function
   *
   * @example
   * ```typescript
   * fastify.post('/webhook', handler.fastify());
   * ```
   */
  fastify(): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
    return (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        const signatureHeader = req.headers[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()];
        const signature = Array.isArray(signatureHeader)
          ? signatureHeader[0]
          : typeof signatureHeader === 'string'
            ? signatureHeader
            : undefined;
        const result = this.handle(req.body, signature);

        // Set required response header
        reply.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);

        if (result.status === 'success') {
          reply.status(200).send(result);
        } else {
          reply.status(400).send(result);
        }
        return Promise.resolve();
      } catch (error) {
        reply.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
        reply.status(500).send({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        return Promise.resolve();
      }
    };
  }

  /**
   * Returns a generic framework-agnostic handler function
   *
   * Useful for frameworks not directly supported (Koa, Hapi, etc.)
   *
   * @returns Generic handler function that works with any framework
   *
   * @example
   * ```typescript
   * router.post('/webhook', async (req, res) => {
   *   await handler.generic()(req, res);
   * });
   * ```
   */
  generic(): (req: GenericRequest, res: GenericResponse) => Promise<void> {
    return (req: GenericRequest, res: GenericResponse): Promise<void> => {
      try {
        const signatureHeader =
          req.headers?.[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()] ||
          req.headers?.[WEBHOOK_HEADERS.SIGNATURE];
        const signature = Array.isArray(signatureHeader)
          ? signatureHeader[0]
          : typeof signatureHeader === 'string'
            ? signatureHeader
            : undefined;
        const body = req.body || req.rawBody || req;
        const result = this.handle(body, signature);

        // Set required response header
        if (res.setHeader) {
          res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
        }
        if (res.header) {
          res.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
        }

        const statusCode = result.status === 'success' ? 200 : 400;
        if (res.status && res.json) {
          const statusRes = res.status(statusCode);
          if (statusRes && typeof statusRes === 'object' && 'json' in statusRes) {
            const jsonMethod = (statusRes as { json: (body: unknown) => void }).json;
            jsonMethod(result);
          }
        }
        if (res.send) {
          res.send(result);
        }
        return Promise.resolve();
      } catch (error) {
        const errorResponse = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        };

        if (res.setHeader) {
          res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
        }
        if (res.header) {
          res.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
        }

        if (res.status && res.json) {
          const statusRes = res.status(500);
          if (statusRes && typeof statusRes === 'object' && 'json' in statusRes) {
            const jsonMethod = (statusRes as { json: (body: unknown) => void }).json;
            jsonMethod(errorResponse);
          }
        }
        if (res.send) {
          res.send(errorResponse);
        }
        return Promise.resolve();
      }
    };
  }
}
