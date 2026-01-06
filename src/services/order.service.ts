import { BaseService } from './base.service';
import { HttpClient } from '../utils/http-client';
import { ENDPOINTS } from '../constants';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  BulkOrderRequest,
  BulkOrderResponse,
  OrderInfoResponse,
} from '../types/order';
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
} from '../utils/validation';

/**
 * Service for managing orders in the Pathao Courier system
 *
 * @public
 */
export class OrderService extends BaseService {
  /**
   * Creates a new OrderService instance
   *
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Creates a single delivery order
   *
   * @param request - Order creation request with recipient and item details
   * @returns The created order information including consignment_id
   * @throws {PathaoValidationError} If validation fails
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const order = await client.orders.create({
   *   store_id: 123,
   *   recipient_name: 'Jane Doe',
   *   recipient_phone: '01712345678',
   *   recipient_address: '456 Delivery St',
   *   recipient_city: 1,
   *   recipient_zone: 1,
   *   recipient_area: 1,
   *   item_type: 2,
   *   item_weight: 0.5,
   *   item_quantity: 1,
   *   amount_to_collect: 1000,
   *   item_description: 'Product description'
   * });
   * ```
   */
  async create(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    // Validate inputs
    validateStoreId(request.store_id);
    validateRecipientName(request.recipient_name);
    validatePhoneNumber(request.recipient_phone, 'recipient_phone');
    if (request.recipient_secondary_phone) {
      validatePhoneNumber(request.recipient_secondary_phone, 'recipient_secondary_phone');
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
   * Creates multiple orders in a single API call (bulk order creation)
   *
   * @param request - Bulk order request containing an array of orders
   * @returns Response containing results for all orders, including any failures
   * @throws {PathaoValidationError} If validation fails for any order
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const result = await client.orders.createBulk({
   *   orders: [
   *     { /* order 1 details *\/ },
   *     { /* order 2 details *\/ }
   *   ]
   * });
   * ```
   */
  async createBulk(request: BulkOrderRequest): Promise<BulkOrderResponse> {
    // Validate each order in the bulk request
    for (const order of request.orders) {
      validateStoreId(order.store_id);
      validateRecipientName(order.recipient_name);
      validatePhoneNumber(order.recipient_phone, 'recipient_phone');
      if (order.recipient_secondary_phone) {
        validatePhoneNumber(order.recipient_secondary_phone, 'recipient_secondary_phone');
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
      'Content-Type': 'application/json; charset=UTF-8',
    });
  }

  /**
   * Retrieves order information by consignment ID
   *
   * @param consignmentId - The consignment ID of the order
   * @returns Order information including status, tracking details, etc.
   * @throws {Error} If consignmentId is missing or invalid
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const orderInfo = await client.orders.getInfo('CM123456789');
   * console.log(orderInfo.data.status);
   * ```
   */
  async getInfo(consignmentId: string): Promise<OrderInfoResponse> {
    if (!consignmentId || typeof consignmentId !== 'string') {
      throw new Error('Consignment ID is required and must be a string');
    }

    return this.httpClient.get<OrderInfoResponse>(ENDPOINTS.orderInfo(consignmentId));
  }
}
