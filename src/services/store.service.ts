import { BaseService } from "./base.service";
import { HttpClient } from "../utils/http-client";
import { ENDPOINTS } from "../constants";
import type { CreateStoreRequest, CreateStoreResponse, StoreListResponse } from "../types/store";
import {
	validateStoreName,
	validateContactName,
	validatePhoneNumber,
	validateStoreAddress,
	validateCityId,
	validateZoneId,
	validateAreaId,
} from "../utils/validation";

export class StoreService extends BaseService {
	constructor(httpClient: HttpClient) {
		super(httpClient);
	}

	/**
	 * Create a new store
	 */
	async create(request: CreateStoreRequest): Promise<CreateStoreResponse> {
		// Validate inputs
		validateStoreName(request.name);
		validateContactName(request.contact_name);
		validatePhoneNumber(request.contact_number, "contact_number");
		if (request.secondary_contact) {
			validatePhoneNumber(request.secondary_contact, "secondary_contact");
		}
		if (request.otp_number) {
			validatePhoneNumber(request.otp_number, "otp_number");
		}
		validateStoreAddress(request.address);
		validateCityId(request.city_id);
		validateZoneId(request.zone_id);
		validateAreaId(request.area_id);

		return this.httpClient.post<CreateStoreResponse>(ENDPOINTS.stores, request);
	}

	/**
	 * Get list of stores
	 */
	async list(): Promise<StoreListResponse> {
		return this.httpClient.get<StoreListResponse>(ENDPOINTS.stores);
	}
}
