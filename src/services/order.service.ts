import { BaseService } from "./base.service";
import { HttpClient } from "../utils/http-client";
import { ENDPOINTS } from "../constants";
import type {
	CreateOrderRequest,
	CreateOrderResponse,
	BulkOrderRequest,
	BulkOrderResponse,
	OrderInfoResponse,
} from "../types/order";
import {
	validateStoreId,
	validateRecipientName,
	validatePhoneNumber,
	validateRecipientAddress,
	validateItemWeight,
	validateItemQuantity,
	validateAmountToCollect,
	validateCityId,
	validateZoneId,
	validateAreaId,
} from "../utils/validation";

export class OrderService extends BaseService {
	constructor(httpClient: HttpClient) {
		super(httpClient);
	}

	/**
	 * Create a single order
	 */
	async create(request: CreateOrderRequest): Promise<CreateOrderResponse> {
		// Validate inputs
		validateStoreId(request.store_id);
		validateRecipientName(request.recipient_name);
		validatePhoneNumber(request.recipient_phone, "recipient_phone");
		if (request.recipient_secondary_phone) {
			validatePhoneNumber(request.recipient_secondary_phone, "recipient_secondary_phone");
		}
		validateRecipientAddress(request.recipient_address);
		if (request.recipient_city) {
			validateCityId(request.recipient_city);
		}
		if (request.recipient_zone) {
			validateZoneId(request.recipient_zone);
		}
		if (request.recipient_area) {
			validateAreaId(request.recipient_area);
		}
		validateItemWeight(request.item_weight);
		validateItemQuantity(request.item_quantity);
		validateAmountToCollect(request.amount_to_collect);

		return this.httpClient.post<CreateOrderResponse>(ENDPOINTS.orders, request);
	}

	/**
	 * Create multiple orders (bulk)
	 */
	async createBulk(request: BulkOrderRequest): Promise<BulkOrderResponse> {
		// Validate each order in the bulk request
		for (const order of request.orders) {
			validateStoreId(order.store_id);
			validateRecipientName(order.recipient_name);
			validatePhoneNumber(order.recipient_phone, "recipient_phone");
			if (order.recipient_secondary_phone) {
				validatePhoneNumber(order.recipient_secondary_phone, "recipient_secondary_phone");
			}
			validateRecipientAddress(order.recipient_address);
			if (order.recipient_city) {
				validateCityId(order.recipient_city);
			}
			if (order.recipient_zone) {
				validateZoneId(order.recipient_zone);
			}
			if (order.recipient_area) {
				validateAreaId(order.recipient_area);
			}
			validateItemWeight(order.item_weight);
			validateItemQuantity(order.item_quantity);
			validateAmountToCollect(order.amount_to_collect);
		}

		return this.httpClient.post<BulkOrderResponse>(ENDPOINTS.bulkOrders, request, {
			"Content-Type": "application/json; charset=UTF-8",
		});
	}

	/**
	 * Get order short info by consignment ID
	 */
	async getInfo(consignmentId: string): Promise<OrderInfoResponse> {
		if (!consignmentId || typeof consignmentId !== "string") {
			throw new Error("Consignment ID is required and must be a string");
		}

		return this.httpClient.get<OrderInfoResponse>(ENDPOINTS.orderInfo(consignmentId));
	}
}
