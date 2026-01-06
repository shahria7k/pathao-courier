import { BaseService } from './base.service';
import { HttpClient } from '../utils/http-client';
import { ENDPOINTS } from '../constants';
import type { PriceCalculationRequest, PriceCalculationResponse } from '../types/pricing';
import {
  validateStoreId,
  validateItemWeight,
  validateCityId,
  validateZoneId,
} from '../utils/validation';

/**
 * Service for calculating delivery prices
 *
 * @public
 */
export class PricingService extends BaseService {
  /**
   * Creates a new PricingService instance
   *
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Calculates the delivery price for an order
   *
   * @param request - Price calculation request with store, item, and destination details
   * @returns Calculated price information including delivery fee, COD charge, etc.
   * @throws {PathaoValidationError} If validation fails
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const price = await client.pricing.calculate({
   *   store_id: 123,
   *   item_weight: 0.5,
   *   recipient_city: 1,
   *   recipient_zone: 1,
   *   delivery_type: 48
   * });
   * console.log(price.data.delivery_fee);
   * ```
   */
  async calculate(request: PriceCalculationRequest): Promise<PriceCalculationResponse> {
    // Validate inputs
    validateStoreId(request.store_id);
    validateItemWeight(request.item_weight);
    validateCityId(request.recipient_city);
    validateZoneId(request.recipient_zone);

    return this.httpClient.post<PriceCalculationResponse>(ENDPOINTS.pricePlan, request, {
      'Content-Type': 'application/json; charset=UTF-8',
    });
  }
}
