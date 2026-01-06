import { DeliveryType, ItemType } from '../constants';

/**
 * Request to create a single order
 */
export interface CreateOrderRequest {
  store_id: number;
  merchant_order_id?: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_secondary_phone?: string;
  recipient_address: string;
  recipient_city?: number;
  recipient_zone?: number;
  recipient_area?: number;
  delivery_type: DeliveryType;
  item_type: ItemType;
  special_instruction?: string;
  item_quantity: number;
  item_weight: number | string;
  item_description?: string;
  amount_to_collect: number;
}

/**
 * Response from order creation
 */
export interface CreateOrderResponse {
  message: string;
  type: string;
  code: number;
  data: {
    consignment_id: string;
    merchant_order_id?: string;
    order_status: string;
    delivery_fee: number;
  };
}

/**
 * Order item for bulk order creation
 */
export interface BulkOrderItem extends CreateOrderRequest {}

/**
 * Request to create bulk orders
 */
export interface BulkOrderRequest {
  orders: BulkOrderItem[];
}

/**
 * Response from bulk order creation
 */
export interface BulkOrderResponse {
  message: string;
  type: string;
  code: number;
  data: boolean;
}

/**
 * Order information
 */
export interface OrderInfo {
  consignment_id: string;
  merchant_order_id?: string;
  order_status: string;
  order_status_slug: string;
  updated_at: string;
  invoice_id: string | null;
}

/**
 * Response from order info
 */
export interface OrderInfoResponse {
  message: string;
  type: string;
  code: number;
  data: OrderInfo;
}
