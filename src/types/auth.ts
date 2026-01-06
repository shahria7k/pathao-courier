/**
 * Request to issue a new access token
 */
export interface IssueTokenRequest {
	client_id: string;
	client_secret: string;
	grant_type: "password";
	username: string;
	password: string;
}

/**
 * Request to refresh an access token
 */
export interface RefreshTokenRequest {
	client_id: string;
	client_secret: string;
	grant_type: "refresh_token";
	refresh_token: string;
}

/**
 * Response from token issuance/refresh
 */
export interface TokenResponse {
	token_type: "Bearer";
	expires_in: number;
	access_token: string;
	refresh_token: string;
}

/**
 * Stored token information
 */
export interface StoredToken {
	access_token: string;
	refresh_token: string;
	expires_at: number; // Unix timestamp in milliseconds
}
