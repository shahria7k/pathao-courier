import { BaseService } from './base.service';
import { HttpClient } from '../utils/http-client';
import { ENDPOINTS } from '../constants';
import type { CreateStoreRequest, CreateStoreResponse, StoreListResponse } from '../types/store';
import {
  validateStoreName,
  validateContactName,
  validatePhoneNumber,
  validateStoreAddress,
  validateCityId,
  validateZoneId,
  validateAreaId,
} from '../utils/validation';

/**
 * Service for managing stores in the Pathao Courier system
 *
 * @public
 */
export class StoreService extends BaseService {
  /**
   * Creates a new StoreService instance
   *
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Creates a new store
   *
   * @param request - Store creation request with all required fields
   * @returns The created store information including store_id
   * @throws {PathaoValidationError} If validation fails
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const store = await client.stores.create({
   *   name: 'My Store',
   *   contact_name: 'John Doe',
   *   contact_number: '01712345678',
   *   address: '123 Main Street',
   *   city_id: 1,
   *   zone_id: 1,
   *   area_id: 1
   * });
   * ```
   */
  async create(request: CreateStoreRequest): Promise<CreateStoreResponse> {
    // Validate inputs
    validateStoreName(request.name);
    validateContactName(request.contact_name);
    validatePhoneNumber(request.contact_number, 'contact_number');
    if (request.secondary_contact) {
      validatePhoneNumber(request.secondary_contact, 'secondary_contact');
    }
    if (request.otp_number) {
      validatePhoneNumber(request.otp_number, 'otp_number');
    }
    validateStoreAddress(request.address);
    validateCityId(request.city_id);
    validateZoneId(request.zone_id);
    validateAreaId(request.area_id);

    return this.httpClient.post<CreateStoreResponse>(ENDPOINTS.stores, request);
  }

  /**
   * Retrieves a list of all stores associated with the account
   *
   * @returns List of stores with their details
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const stores = await client.stores.list();
   * console.log(stores.data); // Array of store objects
   * ```
   */
  async list(): Promise<StoreListResponse> {
    return this.httpClient.get<StoreListResponse>(ENDPOINTS.stores);
  }
}
