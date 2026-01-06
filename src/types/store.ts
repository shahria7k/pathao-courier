/**
 * Request to create a new store
 */
export interface CreateStoreRequest {
  name: string;
  contact_name: string;
  contact_number: string;
  secondary_contact?: string;
  otp_number?: string;
  address: string;
  city_id: number;
  zone_id: number;
  area_id: number;
}

/**
 * Response from store creation
 */
export interface CreateStoreResponse {
  message: string;
  type: string;
  code: number;
  data: {
    store_name: string;
  };
}

/**
 * Store information
 */
export interface Store {
  store_id: number;
  store_name: string;
  store_address: string;
  is_active: number;
  city_id: number;
  zone_id: number;
  hub_id: number;
  is_default_store: boolean;
  is_default_return_store: boolean;
}

/**
 * Response from store list
 */
export interface StoreListResponse {
  message: string;
  type: string;
  code: number;
  data: {
    data: Store[];
    total: number;
    current_page: number;
    per_page: number;
    total_in_page: number;
    last_page: number;
    path: string;
    to: number;
    from: number;
    last_page_url: string;
    first_page_url: string;
  };
}
