import { PathaoApiError, PathaoAuthError } from "./errors";

export interface HttpClientConfig {
	baseUrl: string;
	timeout?: number;
	getAccessToken: () => Promise<string>;
}

interface RequestOptions {
	method: string;
	path: string;
	body?: unknown;
	headers?: Record<string, string>;
}

export class HttpClient {
	private readonly baseUrl: string;
	private readonly timeout: number;
	private readonly getAccessToken: () => Promise<string>;

	constructor(config: HttpClientConfig) {
		this.baseUrl = config.baseUrl;
		this.timeout = config.timeout || 30000;
		this.getAccessToken = config.getAccessToken;
	}

	async request<T>(options: RequestOptions): Promise<T> {
		const url = `${this.baseUrl}${options.path}`;
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...options.headers,
		};

		// Get access token and add to headers
		try {
			const accessToken = await this.getAccessToken();
			headers["Authorization"] = `Bearer ${accessToken}`;
		} catch (error) {
			if (error instanceof PathaoAuthError) {
				throw error;
			}
			throw new PathaoAuthError("Failed to get access token");
		}

		// Create abort controller for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(url, {
				method: options.method,
				headers,
				body: options.body ? JSON.stringify(options.body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			const responseData = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new PathaoApiError(
					responseData.message || `API request failed with status ${response.status}`,
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

			if (error instanceof Error && error.name === "AbortError") {
				throw new PathaoApiError("Request timeout", 408);
			}

			throw new PathaoApiError(
				error instanceof Error ? error.message : "Unknown error occurred",
				500
			);
		}
	}

	async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
		return this.request<T>({ method: "GET", path, headers });
	}

	async post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
		return this.request<T>({ method: "POST", path, body, headers });
	}
}
