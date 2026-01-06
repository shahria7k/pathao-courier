import { EventEmitter } from "events";
import { PathaoWebhookEvent, WEBHOOK_HEADERS, DEFAULT_WEBHOOK_INTEGRATION_SECRET } from "../constants";
import { verifySignature } from "./verifier";
import { parseWebhookPayload } from "./parser";
import type {
	ExpressRequest,
	ExpressResponse,
	ExpressNext,
	FastifyRequest,
	FastifyReply,
	GenericRequest,
	GenericResponse,
} from "./types";
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
				this.emit(PathaoWebhookEvent.ORDER_CREATED, payload);
				break;
			case "order.updated":
				this.emit(PathaoWebhookEvent.ORDER_UPDATED, payload);
				break;
			case "order.pickup-requested":
				this.emit(PathaoWebhookEvent.ORDER_PICKUP_REQUESTED, payload);
				break;
			case "order.assigned-for-pickup":
				this.emit(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_PICKUP, payload);
				break;
			case "order.picked":
				this.emit(PathaoWebhookEvent.ORDER_PICKED, payload);
				break;
			case "order.pickup-failed":
				this.emit(PathaoWebhookEvent.ORDER_PICKUP_FAILED, payload);
				break;
			case "order.pickup-cancelled":
				this.emit(PathaoWebhookEvent.ORDER_PICKUP_CANCELLED, payload);
				break;
			case "order.at-the-sorting-hub":
				this.emit(PathaoWebhookEvent.ORDER_AT_THE_SORTING_HUB, payload);
				break;
			case "order.in-transit":
				this.emit(PathaoWebhookEvent.ORDER_IN_TRANSIT, payload);
				break;
			case "order.received-at-last-mile-hub":
				this.emit(PathaoWebhookEvent.ORDER_RECEIVED_AT_LAST_MILE_HUB, payload);
				break;
			case "order.assigned-for-delivery":
				this.emit(PathaoWebhookEvent.ORDER_ASSIGNED_FOR_DELIVERY, payload);
				break;
			case "order.delivered":
				this.emit(PathaoWebhookEvent.ORDER_DELIVERED, payload);
				break;
			case "order.partial-delivery":
				this.emit(PathaoWebhookEvent.ORDER_PARTIAL_DELIVERY, payload);
				break;
			case "order.returned":
				this.emit(PathaoWebhookEvent.ORDER_RETURNED, payload);
				break;
			case "order.delivery-failed":
				this.emit(PathaoWebhookEvent.ORDER_DELIVERY_FAILED, payload);
				break;
			case "order.on-hold":
				this.emit(PathaoWebhookEvent.ORDER_ON_HOLD, payload);
				break;
			case "order.paid":
				this.emit(PathaoWebhookEvent.ORDER_PAID, payload);
				break;
			case "order.paid-return":
				this.emit(PathaoWebhookEvent.ORDER_PAID_RETURN, payload);
				break;
			case "order.exchanged":
				this.emit(PathaoWebhookEvent.ORDER_EXCHANGED, payload);
				break;
			case "store.created":
				this.emit(PathaoWebhookEvent.STORE_CREATED, payload);
				break;
			case "store.updated":
				this.emit(PathaoWebhookEvent.STORE_UPDATED, payload);
				break;
		}
	}

	// Convenience methods for each event type
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

	onOrderPickupRequested(handler: (payload: OrderPickupRequestedWebhook) => void | Promise<void>): this {
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
	 * Express.js middleware handler
	 */
	express(): (req: ExpressRequest, res: ExpressResponse, next?: ExpressNext) => Promise<void> {
		return (req: ExpressRequest, res: ExpressResponse, _next?: ExpressNext): Promise<void> => {
			try {
				const signatureHeader = req.headers[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()];
				const signature = Array.isArray(signatureHeader)
					? signatureHeader[0]
					: typeof signatureHeader === "string"
						? signatureHeader
						: undefined;
				const result = this.handle(req.body, signature);

				// Set required response header
				res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);

				if (result.status === "success") {
					res.status(200).json(result);
				} else {
					res.status(400).json(result);
				}
				return Promise.resolve();
			} catch (error) {
				res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				res.status(500).json({
					status: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				});
				return Promise.resolve();
			}
		};
	}

	/**
	 * Fastify route handler
	 */
	fastify(): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
		return (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
			try {
				const signatureHeader = req.headers[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()];
				const signature = Array.isArray(signatureHeader)
					? signatureHeader[0]
					: typeof signatureHeader === "string"
						? signatureHeader
						: undefined;
				const result = this.handle(req.body, signature);

				// Set required response header
				reply.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);

				if (result.status === "success") {
					reply.status(200).send(result);
				} else {
					reply.status(400).send(result);
				}
				return Promise.resolve();
			} catch (error) {
				reply.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				reply.status(500).send({
					status: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				});
				return Promise.resolve();
			}
		};
	}

	/**
	 * Generic framework handler
	 */
	generic(): (req: GenericRequest, res: GenericResponse) => Promise<void> {
		return (req: GenericRequest, res: GenericResponse): Promise<void> => {
			try {
				const signatureHeader =
					req.headers?.[WEBHOOK_HEADERS.SIGNATURE.toLowerCase()] ||
					req.headers?.[WEBHOOK_HEADERS.SIGNATURE];
				const signature = Array.isArray(signatureHeader)
					? signatureHeader[0]
					: typeof signatureHeader === "string"
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

				const statusCode = result.status === "success" ? 200 : 400;
				if (res.status && res.json) {
					const statusRes = res.status(statusCode);
					if (statusRes && typeof statusRes === "object" && "json" in statusRes) {
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
					status: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				};

				if (res.setHeader) {
					res.setHeader(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				}
				if (res.header) {
					res.header(WEBHOOK_HEADERS.INTEGRATION_SECRET, this.integrationSecret);
				}

				if (res.status && res.json) {
					const statusRes = res.status(500);
					if (statusRes && typeof statusRes === "object" && "json" in statusRes) {
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
