import { BaseService } from "./base.service";
import { HttpClient } from "../utils/http-client";
import { ENDPOINTS } from "../constants";
import type {
	CityListResponse,
	ZoneListResponse,
	AreaListResponse,
} from "../types/location";
import { validateCityId, validateZoneId } from "../utils/validation";

export class LocationService extends BaseService {
	constructor(httpClient: HttpClient) {
		super(httpClient);
	}

	/**
	 * Get list of all cities
	 */
	async getCities(): Promise<CityListResponse> {
		return this.httpClient.get<CityListResponse>(ENDPOINTS.cityList, {
			"Content-Type": "application/json; charset=UTF-8",
		});
	}

	/**
	 * Get list of zones for a specific city
	 */
	async getZones(cityId: number): Promise<ZoneListResponse> {
		validateCityId(cityId);
		return this.httpClient.get<ZoneListResponse>(ENDPOINTS.zoneList(cityId), {
			"Content-Type": "application/json; charset=UTF-8",
		});
	}

	/**
	 * Get list of areas for a specific zone
	 */
	async getAreas(zoneId: number): Promise<AreaListResponse> {
		validateZoneId(zoneId);
		return this.httpClient.get<AreaListResponse>(ENDPOINTS.areaList(zoneId), {
			"Content-Type": "application/json; charset=UTF-8",
		});
	}
}
