/**
 * Request payload for issuing a new OAuth 2.0 access token
 *
 * @public
 */
export interface IssueTokenRequest {
  /** OAuth 2.0 client ID from Pathao dashboard */
  client_id: string;
  /** OAuth 2.0 client secret from Pathao dashboard */
  client_secret: string;
  /** OAuth 2.0 grant type (must be 'password') */
  grant_type: 'password';
  /** Merchant email address (username) */
  username: string;
  /** Merchant password */
  password: string;
}

/**
 * Request payload for refreshing an OAuth 2.0 access token
 *
 * @public
 */
export interface RefreshTokenRequest {
  /** OAuth 2.0 client ID from Pathao dashboard */
  client_id: string;
  /** OAuth 2.0 client secret from Pathao dashboard */
  client_secret: string;
  /** OAuth 2.0 grant type (must be 'refresh_token') */
  grant_type: 'refresh_token';
  /** Refresh token from previous token response */
  refresh_token: string;
}

/**
 * Response from token issuance or refresh API
 *
 * @public
 */
export interface TokenResponse {
  /** Token type (always 'Bearer') */
  token_type: 'Bearer';
  /** Token expiration time in seconds */
  expires_in: number;
  /** Access token for API authentication */
  access_token: string;
  /** Refresh token for obtaining new access tokens */
  refresh_token: string;
}

/**
 * Stored token information with expiration timestamp
 *
 * @public
 */
export interface StoredToken {
  /** Access token for API authentication */
  access_token: string;
  /** Refresh token for obtaining new access tokens */
  refresh_token: string;
  /** Token expiration timestamp in milliseconds (Unix timestamp) */
  expires_at: number;
}
