import { BaseService } from "./base.service";
import { HttpClient } from "../utils/http-client";
import { ENDPOINTS } from "../constants";
import type {
	PriceCalculationRequest,
	PriceCalculationResponse,
} from "../types/pricing";
import {
	validateStoreId,
	validateItemWeight,
	validateCityId,
	validateZoneId,
} from "../utils/validation";

export class PricingService extends BaseService {
	constructor(httpClient: HttpClient) {
		super(httpClient);
	}

	/**
	 * Calculate delivery price
	 */
	async calculate(request: PriceCalculationRequest): Promise<PriceCalculationResponse> {
		// Validate inputs
		validateStoreId(request.store_id);
		validateItemWeight(request.item_weight);
		validateCityId(request.recipient_city);
		validateZoneId(request.recipient_zone);

		return this.httpClient.post<PriceCalculationResponse>(ENDPOINTS.pricePlan, request, {
			"Content-Type": "application/json; charset=UTF-8",
		});
	}
}
