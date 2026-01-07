import { DeliveryType, ItemType } from '../constants';

/**
 * Request payload for calculating delivery price
 *
 * @public
 */
export interface PriceCalculationRequest {
  /** Store ID where the order originates from */
  store_id: number;
  /** Item type (Document = 1, Parcel = 2) */
  item_type: ItemType;
  /** Delivery type (Normal = 48 hours, OnDemand = 12 hours) */
  delivery_type: DeliveryType;
  /** Item weight in kilograms (0.5-10 kg) */
  item_weight: number;
  /** Recipient's city ID (use LocationService.getCities() to get valid IDs) */
  recipient_city: number;
  /** Recipient's zone ID (use LocationService.getZones() to get valid IDs) */
  recipient_zone: number;
}

/**
 * Response from price calculation API
 *
 * @public
 */
export interface PriceCalculationResponse {
  /** Response message */
  message: string;
  /** Response type */
  type: string;
  /** Response code */
  code: number;
  /** Price calculation data */
  data: {
    /** Base delivery price in smallest currency unit */
    price: number;
    /** Discount amount in smallest currency unit */
    discount: number;
    /** Promotional discount amount in smallest currency unit */
    promo_discount: number;
    /** Pricing plan ID */
    plan_id: number;
    /** Whether COD (Cash on Delivery) is enabled (1 = enabled, 0 = disabled) */
    cod_enabled: number;
    /** COD percentage charge (if COD is enabled) */
    cod_percentage: number;
    /** Additional charges in smallest currency unit */
    additional_charge: number;
    /** Final price after all discounts and charges in smallest currency unit */
    final_price: number;
  };
}
