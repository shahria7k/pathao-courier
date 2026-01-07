/**
 * Request payload for creating a new store
 *
 * @public
 */
export interface CreateStoreRequest {
  /** Store name (3-50 characters) */
  name: string;
  /** Contact person's name (3-50 characters) */
  contact_name: string;
  /** Primary contact phone number (exactly 11 characters) */
  contact_number: string;
  /** Secondary contact phone number (optional, exactly 11 characters if provided) */
  secondary_contact?: string;
  /** OTP number for verification (optional) */
  otp_number?: string;
  /** Store address (15-120 characters) */
  address: string;
  /** City ID (use LocationService.getCities() to get valid IDs) */
  city_id: number;
  /** Zone ID (use LocationService.getZones() to get valid IDs) */
  zone_id: number;
  /** Area ID (use LocationService.getAreas() to get valid IDs) */
  area_id: number;
}

/**
 * Response from store creation API
 *
 * @public
 */
export interface CreateStoreResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Store creation data */
  data: {
    /** Created store name */
    store_name: string;
  };
}

/**
 * Store information from API
 *
 * @public
 */
export interface Store {
  /** Unique store identifier */
  store_id: number;
  /** Store name */
  store_name: string;
  /** Store address */
  store_address: string;
  /** Whether the store is active (1 = active, 0 = inactive) */
  is_active: number;
  /** City ID where the store is located */
  city_id: number;
  /** Zone ID where the store is located */
  zone_id: number;
  /** Hub ID associated with the store */
  hub_id: number;
  /** Whether this is the default store for orders */
  is_default_store: boolean;
  /** Whether this is the default return store */
  is_default_return_store: boolean;
}

/**
 * Response from store list API
 *
 * @public
 */
export interface StoreListResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Paginated store list data */
  data: {
    /** Array of store objects */
    data: Store[];
    /** Total number of stores */
    total: number;
    /** Current page number */
    current_page: number;
    /** Number of items per page */
    per_page: number;
    /** Number of items in current page */
    total_in_page: number;
    /** Last page number */
    last_page: number;
    /** API path */
    path: string;
    /** Last item number on current page */
    to: number;
    /** First item number on current page */
    from: number;
    /** URL to last page */
    last_page_url: string;
    /** URL to first page */
    first_page_url: string;
  };
}
