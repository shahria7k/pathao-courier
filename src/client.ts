import { HttpClient } from './utils/http-client';
import { AuthService, type AuthServiceConfig } from './services/auth.service';
import { StoreService } from './services/store.service';
import { OrderService } from './services/order.service';
import { LocationService } from './services/location.service';
import { PricingService } from './services/pricing.service';
import { BASE_URLS } from './constants';
import type { StoredToken } from './types/auth';

/**
 * Configuration options for the PathaoClient
 *
 * @public
 */
export interface PathaoClientConfig {
  /** OAuth 2.0 client ID from Pathao */
  clientId: string;
  /** OAuth 2.0 client secret from Pathao */
  clientSecret: string;
  /** Username for OAuth 2.0 authentication */
  username: string;
  /** Password for OAuth 2.0 authentication */
  password: string;
  /** API environment to use. Defaults to 'sandbox' */
  environment?: 'sandbox' | 'production';
  /** Custom base URL for the API. Overrides environment setting */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000 */
  timeout?: number;
  /** Callback function called when access token is updated. Useful for persisting tokens */
  onTokenUpdate?: (token: StoredToken) => Promise<void> | void;
  /** Callback function to load stored token. Should return null if no token exists */
  onTokenLoad?: () => Promise<StoredToken | null> | StoredToken | null;
}

/**
 * Main client class for interacting with the Pathao Courier Merchant API
 *
 * @example
 * ```typescript
 * const client = new PathaoClient({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   username: 'your-username',
 *   password: 'your-password',
 *   environment: 'production'
 * });
 *
 * // Create a store
 * const store = await client.stores.create({
 *   name: 'My Store',
 *   contact_name: 'John Doe',
 *   contact_number: '01712345678',
 *   address: '123 Main St',
 *   city_id: 1,
 *   zone_id: 1,
 *   area_id: 1
 * });
 * ```
 *
 * @public
 */
export class PathaoClient {
  /** Service for managing stores */
  public readonly stores: StoreService;
  /** Service for managing orders */
  public readonly orders: OrderService;
  /** Service for fetching location data (cities, zones, areas) */
  public readonly locations: LocationService;
  /** Service for calculating delivery pricing */
  public readonly pricing: PricingService;

  private readonly authService: AuthService;
  private readonly httpClient: HttpClient;

  /**
   * Creates a new PathaoClient instance
   *
   * @param config - Configuration object for the client
   * @throws {Error} If required configuration fields are missing
   *
   * @example
   * ```typescript
   * const client = new PathaoClient({
   *   clientId: 'your-client-id',
   *   clientSecret: 'your-client-secret',
   *   username: 'your-username',
   *   password: 'your-password'
   * });
   * ```
   */
  constructor(config: PathaoClientConfig) {
    // Validate required fields
    if (!config.clientId || !config.clientSecret || !config.username || !config.password) {
      throw new Error('clientId, clientSecret, username, and password are required');
    }

    // Determine base URL
    const baseUrl =
      config.baseUrl ||
      (config.environment === 'production' ? BASE_URLS.production : BASE_URLS.sandbox);

    // Create auth service
    const authConfig: AuthServiceConfig = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      username: config.username,
      password: config.password,
      baseUrl,
      ...(config.onTokenUpdate && { onTokenUpdate: config.onTokenUpdate }),
      ...(config.onTokenLoad && { onTokenLoad: config.onTokenLoad }),
    };

    this.authService = new AuthService(authConfig);

    // Create HTTP client
    this.httpClient = new HttpClient({
      baseUrl,
      ...(config.timeout && { timeout: config.timeout }),
      getAccessToken: async (): Promise<string> => this.authService.getAccessToken(),
    });

    // Initialize services
    this.stores = new StoreService(this.httpClient);
    this.orders = new OrderService(this.httpClient);
    this.locations = new LocationService(this.httpClient);
    this.pricing = new PricingService(this.httpClient);
  }
}
