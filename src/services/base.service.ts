import { HttpClient } from '../utils/http-client';

/**
 * Base service class that all API services extend
 *
 * This abstract class provides a common foundation for all service classes in the SDK.
 * It provides access to the HttpClient instance for making authenticated API requests.
 *
 * All service classes (StoreService, OrderService, LocationService, PricingService)
 * extend this class to inherit the HTTP client functionality.
 *
 * @example
 * ```typescript
 * class MyService extends BaseService {
 *   async doSomething() {
 *     return this.httpClient.get('/api/endpoint');
 *   }
 * }
 * ```
 *
 * @public
 */
export abstract class BaseService {
  /** HTTP client instance for making authenticated API requests */
  protected readonly httpClient: HttpClient;

  /**
   * Creates a new BaseService instance
   *
   * @param httpClient - The HTTP client instance to use for API requests
   */
  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }
}
