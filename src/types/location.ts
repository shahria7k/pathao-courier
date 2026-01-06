/**
 * City information
 */
export interface City {
	city_id: number;
	city_name: string;
}

/**
 * Response from city list
 */
export interface CityListResponse {
	message: string;
	type: string;
	code: number;
	data: {
		data: City[];
	};
}

/**
 * Zone information
 */
export interface Zone {
	zone_id: number;
	zone_name: string;
}

/**
 * Response from zone list
 */
export interface ZoneListResponse {
	message: string;
	type: string;
	code: number;
	data: {
		data: Zone[];
	};
}

/**
 * Area information
 */
export interface Area {
	area_id: number;
	area_name: string;
	home_delivery_available: boolean;
	pickup_available: boolean;
}

/**
 * Response from area list
 */
export interface AreaListResponse {
	message: string;
	type: string;
	code: number;
	data: {
		data: Area[];
	};
}
