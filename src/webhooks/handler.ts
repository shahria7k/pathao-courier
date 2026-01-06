import { EventEmitter } from "events";
import { PathaoWebhookEvent, WEBHOOK_HEADERS, DEFAULT_WEBHOOK_INTEGRATION_SECRET } from "../constants";
import { verifySignature } from "./verifier";
import { parseWebhookPayload } from "./parser";
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
} from "../types/webhook";

export interface PathaoWebhookHandlerConfig {
	webhookSecret: string;
	integrationSecret?: string;
}

/**
 * Webhook handler for Pathao Courier webhooks
 */
export class PathaoWebhookHandler extends EventEmitter {
	private readonly webhookSecret: string;
	private readonly integrationSecret: string;

	constructor(config: PathaoWebhookHandlerConfig) {
		super();
		if (!config.webhookSecret) {
			throw new Error("webhookSecret is required");
		}
		this.webhookSecret = config.webhookSecret;
		this.integrationSecret = config.integrationSecret || DEFAULT_WEBHOOK_INTEGRATION_SECRET;
	}

	/**
	 * Handle webhook payload manually
	 */
	async handle(body: unknown, signatureHeader?: string | null): Promise<WebhookResponse> {
		try {
			// Verify signature
			verifySignature(signatureHeader, this.webhookSecret, body);

			// Parse payload
			const payload = parseWebhookPayload(body);

			// Emit generic webhook event
			this.emit(PathaoWebhookEvent.WEBHOOK, payload);

			// Emit specific event based on type
			this.emitSpecificEvent(payload);

			return { status: "success" };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			this.emit(PathaoWebhookEvent.ERROR, error);
			return { status: "error", message: errorMessage };
		}
	}

	/**
	 * Emit specific event based on payload type
	 */
	private emitSpecificEvent(payload: WebhookPayload): void {
		switch (payload.event) {
			case "order.created":
				this.emit(PathaoWebhookEvent.ORDER_CREATED, payload as OrderCreatedWebhook);
				break;
			case "order.updated":
				this.emit(PathaoWebhookEvent.ORDER_UPDATED, payload as OrderUpdatedWebhook);
				break;
			case "order.pickup-requested":
				this.emit(PathaoWebhookEvent.ORDER_PICKUP_REQUESTED, payload as OrderPickupRequestedWebhook);
				break;
			case "order.assigned-for-pickup":
				this.emit(
					PathaoWebhookEvent.ORDER_ASSIGNED_FOR_PICKUP,
					payload as OrderAssignedForPickupWebhook
				);
				break;
			case "order.picked":
				this.emit(PathaoWebhookEvent.ORDER_PICKED, payload as OrderPickedWebhook);
				break;
			case "order.pickup-failed":
				this.emit(PathaoWebhookEvent.ORDER_PICKUP_FAILED, payload as OrderPickupFailedWebhook);
				break;
			case "order.pickup-cancelled":
				this.emit(
					PathaoWebhookEvent.ORDER_PICKUP_CANCELLED,
					payload as OrderPickupCancelledWebhook
				);
				break;
			case "order.at-the-sorting-hub":
				this.emit(
					PathaoWebhookEvent.ORDER_AT_THE_SORTING_HUB,
					payload as OrderAtTheSortingHubWebhook
				);
				break;
			case "order.in-transit":
				this.emit(PathaoWebhookEvent.ORDER_IN_TRANSIT, payload as OrderInTransitWebhook);
				break;
			case "order.received-at-last-mile-hub":
				this.emit(
					PathaoWebhookEvent.ORDER_RECEIVED_AT_LAST_MILE_HUB,
					payload as OrderReceivedAtLastMileHubWebhook
				);
				break;
			case "order.assigned-for-delivery":
				this.emit(
					PathaoWebhookEvent.ORDER_ASSIGNED_FOR_DELIVERY,
					payload as OrderAssignedForDeliveryWebhook
				);
				break;
			case "order.delivered":
				this.emit(PathaoWebhookEvent.ORDER_DELIVERED, payload as OrderDeliveredWebhook);
				break;
			case "order.partial-delivery":
				this.emit(PathaoWebhookEvent.ORDER_PARTIAL_DELIVERY, payload as OrderPartialDeliveryWebhook);
				break;
			case "order.returned":
				this.emit(PathaoWebhookEvent.ORDER_RETURNED, payload as OrderReturnedWebhook);
				break;
			case "order.delivery-failed":
				this.emit(PathaoWebhookEvent.ORDER_DELIVERY_FAILED, payload as OrderDeliveryFailedWebhook);
				break;
			case "order.on-hold":
				this.emit(PathaoWebhookEvent.ORDER_ON_HOLD, payload as OrderOnHoldWebhook);
				break;
			case "order.paid":
				this.emit(PathaoWebhookEvent.ORDER_PAID, payload as OrderPaidWebhook);
				break;
			case "order.paid-return":
				this.emit(PathaoWebhookEvent.ORDER_PAID_RETURN, payload as OrderPaidReturnWebhook);
				break;
			case "order.exchanged":
				this.emit(PathaoWebhookEvent.ORDER_EXCHANGED, payload as OrderExchangedWebhook);
				break;
			case "store.created":
				this.emit(PathaoWebhookEvent.STORE_CREATED, payload as StoreCreatedWebhook);
				break;
			case "store.updated":
				this.emit(PathaoWebhookEvent.STORE_UPDATED, payload as StoreUpdatedWebhook);
				break;
		}
	}

	// Convenience methods for each event type
	onOrderCreated(handler: (payload: OrderCreatedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_CREATED, handler);
		return this;
	}

	onOrderUpdated(handler: (payload: OrderUpdatedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_UPDATED, handler);
		return this;
	}

	onOrderPickupRequested(handler: (payload: OrderPickupRequestedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_PICKUP_REQUESTED, handler);
		return this;
	}

	onOrderAssignedForPickup(
		handler: (payload: OrderAssignedForPickupWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_PICKUP, handler);
		return this;
	}

	onOrderPicked(handler: (payload: OrderPickedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_PICKED, handler);
		return this;
	}

	onOrderPickupFailed(handler: (payload: OrderPickupFailedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_PICKUP_FAILED, handler);
		return this;
	}

	onOrderPickupCancelled(
		handler: (payload: OrderPickupCancelledWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_PICKUP_CANCELLED, handler);
		return this;
	}

	onOrderAtTheSortingHub(
		handler: (payload: OrderAtTheSortingHubWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_AT_THE_SORTING_HUB, handler);
		return this;
	}

	onOrderInTransit(handler: (payload: OrderInTransitWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_IN_TRANSIT, handler);
		return this;
	}

	onOrderReceivedAtLastMileHub(
		handler: (payload: OrderReceivedAtLastMileHubWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_RECEIVED_AT_LAST_MILE_HUB, handler);
		return this;
	}

	onOrderAssignedForDelivery(
		handler: (payload: OrderAssignedForDeliveryWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_DELIVERY, handler);
		return this;
	}

	onOrderDelivered(handler: (payload: OrderDeliveredWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_DELIVERED, handler);
		return this;
	}

	onOrderPartialDelivery(
		handler: (payload: OrderPartialDeliveryWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_PARTIAL_DELIVERY, handler);
		return this;
	}

	onOrderReturned(handler: (payload: OrderReturnedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_RETURNED, handler);
		return this;
	}

	onOrderDeliveryFailed(
		handler: (payload: OrderDeliveryFailedWebhook) => void | Promise<void>
	): this {
		this.on(PathaoWebhookEvent.ORDER_DELIVERY_FAILED, handler);
		return this;
	}

	onOrderOnHold(handler: (payload: OrderOnHoldWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_ON_HOLD, handler);
		return this;
	}

	onOrderPaid(handler: (payload: OrderPaidWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_PAID, handler);
		return this;
	}

	onOrderPaidReturn(handler: (payload: OrderPaidReturnWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_PAID_RETURN, handler);
		return this;
	}

	onOrderExchanged(handler: (payload: OrderExchangedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.ORDER_EXCHANGED, handler);
		return this;
	}

	onStoreCreated(handler: (payload: StoreCreatedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.STORE_CREATED, handler);
		return this;
	}

	onStoreUpdated(handler: (payload: StoreUpdatedWebhook) => void | Promise<void>): this {
		this.on(PathaoWebhookEvent.STORE_UPDATED, handler);
		return this;
	}

	/**
	 * Express.js middleware handler
	 */
	express(): (req: any, res: any, next?: any) => Promise<void> {
		return async (req: any, res: any, _next?: any) => {
			try {
				const signature = req.headers[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()];
				const result = await this.handle(req.body, signature);

				// Set required response header
				res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);

				if (result.status === "success") {
					res.status(200).json(result);
				} else {
					res.status(400).json(result);
				}
			} catch (error) {
				res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				res.status(500).json({
					status: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				});
			}
		};
	}

	/**
	 * Fastify route handler
	 */
	fastify(): (req: any, reply: any) => Promise<void> {
		return async (req: any, reply: any) => {
			try {
				const signature = req.headers[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()];
				const result = await this.handle(req.body, signature);

				// Set required response header
				reply.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);

				if (result.status === "success") {
					reply.status(200).send(result);
				} else {
					reply.status(400).send(result);
				}
			} catch (error) {
				reply.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				reply.status(500).send({
					status: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				});
			}
		};
	}

	/**
	 * Generic framework handler
	 */
	generic(): (req: any, res: any) => Promise<void> {
		return async (req: any, res: any) => {
			try {
				const signature =
					req.headers?.[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()] ||
					req.headers?.[WEBHOOK_HEADERS.SIGNATURE];
				const body = req.body || req.rawBody || req;
				const result = await this.handle(body, signature);

				// Set required response header
				if (res.setHeader) {
					res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				} else if (res.header) {
					res.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				}

				if (result.status === "success") {
					if (res.status) {
						res.status(200).json(result);
					} else if (res.send) {
						res.status(200).send(result);
					}
				} else {
					if (res.status) {
						res.status(400).json(result);
					} else if (res.send) {
						res.status(400).send(result);
					}
				}
			} catch (error) {
				const errorResponse = {
					status: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				};

				if (res.setHeader) {
					res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				} else if (res.header) {
					res.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				}

				if (res.status) {
					res.status(500).json(errorResponse);
				} else if (res.send) {
					res.status(500).send(errorResponse);
				}
			}
		};
	}
}
