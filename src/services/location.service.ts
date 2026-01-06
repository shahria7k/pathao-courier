import { BaseService } from './base.service';
import { HttpClient } from '../utils/http-client';
import { ENDPOINTS } from '../constants';
import type { CityListResponse, ZoneListResponse, AreaListResponse } from '../types/location';
import { validateCityId, validateZoneId } from '../utils/validation';

/**
 * Service for fetching location data (cities, zones, areas) from Pathao
 *
 * @public
 */
export class LocationService extends BaseService {
  /**
   * Creates a new LocationService instance
   *
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Retrieves a list of all available cities
   *
   * @returns List of cities with their IDs and names
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const cities = await client.locations.getCities();
   * console.log(cities.data); // Array of city objects
   * ```
   */
  async getCities(): Promise<CityListResponse> {
    return this.httpClient.get<CityListResponse>(ENDPOINTS.cityList, {
      'Content-Type': 'application/json; charset=UTF-8',
    });
  }

  /**
   * Retrieves a list of zones for a specific city
   *
   * @param cityId - The ID of the city
   * @returns List of zones within the specified city
   * @throws {PathaoValidationError} If cityId is invalid
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const zones = await client.locations.getZones(1);
   * console.log(zones.data); // Array of zone objects
   * ```
   */
  async getZones(cityId: number): Promise<ZoneListResponse> {
    validateCityId(cityId);
    return this.httpClient.get<ZoneListResponse>(ENDPOINTS.zoneList(cityId), {
      'Content-Type': 'application/json; charset=UTF-8',
    });
  }

  /**
   * Retrieves a list of areas for a specific zone
   *
   * @param zoneId - The ID of the zone
   * @returns List of areas within the specified zone
   * @throws {PathaoValidationError} If zoneId is invalid
   * @throws {PathaoApiError} If API request fails
   *
   * @example
   * ```typescript
   * const areas = await client.locations.getAreas(1);
   * console.log(areas.data); // Array of area objects
   * ```
   */
  async getAreas(zoneId: number): Promise<AreaListResponse> {
    validateZoneId(zoneId);
    return this.httpClient.get<AreaListResponse>(ENDPOINTS.areaList(zoneId), {
      'Content-Type': 'application/json; charset=UTF-8',
    });
  }
}
