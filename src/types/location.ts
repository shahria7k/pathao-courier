/**
 * City information from Pathao API
 *
 * @public
 */
export interface City {
  /** Unique city identifier */
  city_id: number;
  /** City name */
  city_name: string;
}

/**
 * Response from city list API
 *
 * @public
 */
export interface CityListResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** City list data */
  data: {
    /** Array of city objects */
    data: City[];
  };
}

/**
 * Zone information from Pathao API
 *
 * Zones are subdivisions within a city.
 *
 * @public
 */
export interface Zone {
  /** Unique zone identifier */
  zone_id: number;
  /** Zone name */
  zone_name: string;
}

/**
 * Response from zone list API
 *
 * @public
 */
export interface ZoneListResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Zone list data */
  data: {
    /** Array of zone objects */
    data: Zone[];
  };
}

/**
 * Area information from Pathao API
 *
 * Areas are subdivisions within a zone. Each area has service availability flags.
 *
 * @public
 */
export interface Area {
  /** Unique area identifier */
  area_id: number;
  /** Area name */
  area_name: string;
  /** Whether home delivery is available in this area */
  home_delivery_available: boolean;
  /** Whether pickup service is available in this area */
  pickup_available: boolean;
}

/**
 * Response from area list API
 *
 * @public
 */
export interface AreaListResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Area list data */
  data: {
    /** Array of area objects */
    data: Area[];
  };
}
