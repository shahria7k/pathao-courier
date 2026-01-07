import { DeliveryType, ItemType } from '../constants';

/**
 * Request payload for creating a single order
 *
 * @public
 */
export interface CreateOrderRequest {
  /** Store ID where the order originates from */
  store_id: number;
  /** Optional merchant's internal order ID for tracking */
  merchant_order_id?: string;
  /** Recipient's full name (3-100 characters) */
  recipient_name: string;
  /** Recipient's primary phone number (exactly 11 characters) */
  recipient_phone: string;
  /** Recipient's secondary phone number (optional, exactly 11 characters if provided) */
  recipient_secondary_phone?: string;
  /** Delivery address (10-220 characters) */
  recipient_address: string;
  /** Recipient's city ID (optional, use LocationService.getCities() to get valid IDs) */
  recipient_city?: number;
  /** Recipient's zone ID (optional, use LocationService.getZones() to get valid IDs) */
  recipient_zone?: number;
  /** Recipient's area ID (optional, use LocationService.getAreas() to get valid IDs) */
  recipient_area?: number;
  /** Delivery type (Normal = 48 hours, OnDemand = 12 hours) */
  delivery_type: DeliveryType;
  /** Item type (Document = 1, Parcel = 2) */
  item_type: ItemType;
  /** Special delivery instructions (optional) */
  special_instruction?: string;
  /** Number of items (must be positive integer) */
  item_quantity: number;
  /** Item weight in kilograms (0.5-10 kg, can be number or string) */
  item_weight: number | string;
  /** Item description (optional) */
  item_description?: string;
  /** Amount to collect (COD) in smallest currency unit (0 for prepaid orders) */
  amount_to_collect: number;
}

/**
 * Response from order creation API
 *
 * @public
 */
export interface CreateOrderResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Order creation data */
  data: {
    /** Pathao consignment ID (tracking number) */
    consignment_id: string;
    /** Merchant's order ID (if provided) */
    merchant_order_id?: string;
    /** Current order status */
    order_status: string;
    /** Delivery fee in smallest currency unit */
    delivery_fee: number;
  };
}

/**
 * Order item for bulk order creation
 *
 * Each item in a bulk order request has the same structure as CreateOrderRequest.
 *
 * @public
 */
export interface BulkOrderItem extends CreateOrderRequest {}

/**
 * Request payload for creating multiple orders at once
 *
 * @public
 */
export interface BulkOrderRequest {
  /** Array of order items to create */
  orders: BulkOrderItem[];
}

/**
 * Response from bulk order creation API
 *
 * @public
 */
export interface BulkOrderResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Success indicator (true if all orders created successfully) */
  data: boolean;
}

/**
 * Order information from API
 *
 * @public
 */
export interface OrderInfo {
  /** Pathao consignment ID (tracking number) */
  consignment_id: string;
  /** Merchant's order ID (if provided during creation) */
  merchant_order_id?: string;
  /** Current order status (human-readable) */
  order_status: string;
  /** Current order status slug (machine-readable) */
  order_status_slug: string;
  /** Last update timestamp (ISO 8601 format) */
  updated_at: string;
  /** Invoice ID (null if not yet invoiced) */
  invoice_id: string | null;
}

/**
 * Response from order info API
 *
 * @public
 */
export interface OrderInfoResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Order information data */
  data: OrderInfo;
}
