import { PathaoAuthError } from "../utils/errors";
import { BASE_URLS, ENDPOINTS } from "../constants";
import type { IssueTokenRequest, RefreshTokenRequest, TokenResponse, StoredToken } from "../types/auth";

export interface AuthServiceConfig {
	clientId: string;
	clientSecret: string;
	username: string;
	password: string;
	baseUrl: string;
	onTokenUpdate?: (token: StoredToken) => Promise<void> | void;
	onTokenLoad?: () => Promise<StoredToken | null> | StoredToken | null;
}

export class AuthService {
	private readonly config: AuthServiceConfig;
	private token: StoredToken | null = null;
	private tokenPromise: Promise<StoredToken> | null = null;

	constructor(config: AuthServiceConfig) {
		this.config = config;
	}

	/**
	 * Get access token, refreshing if necessary
	 */
	async getAccessToken(): Promise<string> {
		// Load token from storage if available
		if (!this.token && this.config.onTokenLoad) {
			this.token = await Promise.resolve(this.config.onTokenLoad());
		}

		// Check if token exists and is still valid (with 5 minute buffer)
		if (this.token && this.token.expires_at > Date.now() + 5 * 60 * 1000) {
			return this.token.access_token;
		}

		// If token is expired or about to expire, refresh it
		if (this.token && this.token.refresh_token) {
			try {
				await this.refreshToken();
				return this.token.access_token;
			} catch (error) {
				// If refresh fails, issue a new token
				// Fall through to issueToken
			}
		}

		// Issue a new token
		await this.issueToken();
		return this.token!.access_token;
	}

	/**
	 * Issue a new access token using username/password
	 */
	async issueToken(): Promise<StoredToken> {
		// Prevent concurrent token requests
		if (this.tokenPromise) {
			return this.tokenPromise;
		}

		this.tokenPromise = (async () => {
			try {
				const request: IssueTokenRequest = {
					client_id: this.config.clientId,
					client_secret: this.config.clientSecret,
					grant_type: "password",
					username: this.config.username,
					password: this.config.password,
				};

				const response = await fetch(`${this.config.baseUrl}${ENDPOINTS.issueToken}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(request),
				});

				const data = (await response.json()) as TokenResponse | { message?: string };

				if (!response.ok) {
					throw new PathaoAuthError(
						"message" in data ? data.message : "Failed to issue access token"
					);
				}

				const tokenResponse = data as TokenResponse;

				// Calculate expiry time (expires_in is in seconds)
				const expiresAt = Date.now() + tokenResponse.expires_in * 1000;

				const token: StoredToken = {
					access_token: tokenResponse.access_token,
					refresh_token: tokenResponse.refresh_token,
					expires_at: expiresAt,
				};

				this.token = token;

				// Save token if callback is provided
				if (this.config.onTokenUpdate) {
					await Promise.resolve(this.config.onTokenUpdate(token));
				}

				return token;
			} catch (error) {
				if (error instanceof PathaoAuthError) {
					throw error;
				}
				throw new PathaoAuthError(
					error instanceof Error ? error.message : "Failed to issue access token"
				);
			} finally {
				this.tokenPromise = null;
			}
		})();

		return this.tokenPromise;
	}

	/**
	 * Refresh access token using refresh token
	 */
	async refreshToken(): Promise<StoredToken> {
		if (!this.token?.refresh_token) {
			throw new PathaoAuthError("No refresh token available");
		}

		// Prevent concurrent refresh requests
		if (this.tokenPromise) {
			return this.tokenPromise;
		}

		this.tokenPromise = (async () => {
			try {
				const request: RefreshTokenRequest = {
					client_id: this.config.clientId,
					client_secret: this.config.clientSecret,
					grant_type: "refresh_token",
					refresh_token: this.token!.refresh_token,
				};

				const response = await fetch(`${this.config.baseUrl}${ENDPOINTS.issueToken}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(request),
				});

				const data = (await response.json()) as TokenResponse | { message?: string };

				if (!response.ok) {
					throw new PathaoAuthError(
						"message" in data ? data.message : "Failed to refresh access token"
					);
				}

				const tokenResponse = data as TokenResponse;

				// Calculate expiry time
				const expiresAt = Date.now() + tokenResponse.expires_in * 1000;

				const token: StoredToken = {
					access_token: tokenResponse.access_token,
					refresh_token: tokenResponse.refresh_token,
					expires_at: expiresAt,
				};

				this.token = token;

				// Save token if callback is provided
				if (this.config.onTokenUpdate) {
					await Promise.resolve(this.config.onTokenUpdate(token));
				}

				return token;
			} catch (error) {
				if (error instanceof PathaoAuthError) {
					throw error;
				}
				throw new PathaoAuthError(
					error instanceof Error ? error.message : "Failed to refresh access token"
				);
			} finally {
				this.tokenPromise = null;
			}
		})();

		return this.tokenPromise;
	}
}
