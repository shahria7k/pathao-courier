import { PathaoApiError, PathaoAuthError } from './errors';

/**
 * Configuration options for the HttpClient
 *
 * @public
 */
export interface HttpClientConfig {
  /** Base URL for all API requests (e.g., 'https://api-hermes.pathao.com') */
  baseUrl: string;
  /** Request timeout in milliseconds. Defaults to 30000 (30 seconds) */
  timeout?: number;
  /** Function that returns a valid access token for authentication */
  getAccessToken: () => Promise<string>;
}

/**
 * Internal request options for HTTP requests
 *
 * @internal
 */
interface RequestOptions {
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** API endpoint path (e.g., '/aladdin/api/v1/stores') */
  path: string;
  /** Request body (will be JSON stringified) */
  body?: unknown;
  /** Additional HTTP headers */
  headers?: Record<string, string>;
}

/**
 * HTTP client for making authenticated API requests to Pathao Courier API
 *
 * This client handles:
 * - Automatic authentication token injection
 * - Request timeouts
 * - Error handling and transformation
 * - JSON serialization/deserialization
 *
 * @example
 * ```typescript
 * const httpClient = new HttpClient({
 *   baseUrl: 'https://api-hermes.pathao.com',
 *   timeout: 30000,
 *   getAccessToken: async () => {
 *     // Return valid access token
 *     return 'your-access-token';
 *   }
 * });
 *
 * const data = await httpClient.get<StoreListResponse>('/aladdin/api/v1/stores');
 * ```
 *
 * @public
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly getAccessToken: () => Promise<string>;

  /**
   * Creates a new HttpClient instance
   *
   * @param config - Configuration object for the HTTP client
   * @throws {Error} If baseUrl is not provided
   *
   * @example
   * ```typescript
   * const client = new HttpClient({
   *   baseUrl: 'https://api-hermes.pathao.com',
   *   timeout: 30000,
   *   getAccessToken: async () => await authService.getAccessToken()
   * });
   * ```
   */
  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    this.getAccessToken = config.getAccessToken;
  }

  /**
   * Makes an HTTP request with automatic authentication and error handling
   *
   * This method:
   * - Automatically injects the Authorization header with Bearer token
   * - Handles request timeouts
   * - Transforms API errors into PathaoApiError instances
   * - Serializes request body to JSON
   * - Deserializes response from JSON
   *
   * @param options - Request options including method, path, body, and headers
   * @returns Promise resolving to the typed response data
   * @throws {PathaoAuthError} If access token retrieval fails
   * @throws {PathaoApiError} If the API request fails or times out
   *
   * @example
   * ```typescript
   * const response = await httpClient.request<CreateStoreResponse>({
   *   method: 'POST',
   *   path: '/aladdin/api/v1/stores',
   *   body: { name: 'My Store', ... },
   *   headers: { 'Custom-Header': 'value' }
   * });
   * ```
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${options.path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Get access token and add to headers
    try {
      const accessToken = await this.getAccessToken();
      headers['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      if (error instanceof PathaoAuthError) {
        throw error;
      }
      throw new PathaoAuthError('Failed to get access token');
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fetchOptions: RequestInit = {
        method: options.method,
        headers,
        signal: controller.signal,
      };
      if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, fetchOptions);

      clearTimeout(timeoutId);

      const responseData: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorData = responseData as { message?: string };
        throw new PathaoApiError(
          errorData.message || `API request failed with status ${response.status}`,
          response.status,
          responseData
        );
      }

      return responseData as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PathaoApiError || error instanceof PathaoAuthError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new PathaoApiError('Request timeout', 408);
      }

      throw new PathaoApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  }

  /**
   * Makes a GET request to the specified endpoint
   *
   * @param path - API endpoint path (e.g., '/aladdin/api/v1/stores')
   * @param headers - Optional additional HTTP headers
   * @returns Promise resolving to the typed response data
   * @throws {PathaoAuthError} If access token retrieval fails
   * @throws {PathaoApiError} If the API request fails or times out
   *
   * @example
   * ```typescript
   * const stores = await httpClient.get<StoreListResponse>('/aladdin/api/v1/stores');
   * const orderInfo = await httpClient.get<OrderInfoResponse>(
   *   '/aladdin/api/v1/orders/CM123456789/info',
   *   { 'Custom-Header': 'value' }
   * );
   * ```
   */
  async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'GET', path, headers: headers || {} });
  }

  /**
   * Makes a POST request to the specified endpoint
   *
   * @param path - API endpoint path (e.g., '/aladdin/api/v1/orders')
   * @param body - Request body object (will be JSON stringified)
   * @param headers - Optional additional HTTP headers
   * @returns Promise resolving to the typed response data
   * @throws {PathaoAuthError} If access token retrieval fails
   * @throws {PathaoApiError} If the API request fails or times out
   *
   * @example
   * ```typescript
   * const store = await httpClient.post<CreateStoreResponse>(
   *   '/aladdin/api/v1/stores',
   *   {
   *     name: 'My Store',
   *     contact_name: 'John Doe',
   *     contact_number: '01712345678',
   *     address: '123 Main St',
   *     city_id: 1,
   *     zone_id: 1,
   *     area_id: 1
   *   }
   * );
   *
   * const order = await httpClient.post<CreateOrderResponse>(
   *   '/aladdin/api/v1/orders',
   *   orderData,
   *   { 'Content-Type': 'application/json; charset=UTF-8' }
   * );
   * ```
   */
  async post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ method: 'POST', path, body, headers: headers || {} });
  }
}
