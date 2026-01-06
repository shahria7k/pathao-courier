import { DeliveryType, ItemType } from '../constants';

/**
 * Request to calculate price
 */
export interface PriceCalculationRequest {
  store_id: number;
  item_type: ItemType;
  delivery_type: DeliveryType;
  item_weight: number;
  recipient_city: number;
  recipient_zone: number;
}

/**
 * Response from price calculation
 */
export interface PriceCalculationResponse {
  message: string;
  type: string;
  code: number;
  data: {
    price: number;
    discount: number;
    promo_discount: number;
    plan_id: number;
    cod_enabled: number;
    cod_percentage: number;
    additional_charge: number;
    final_price: number;
  };
}
