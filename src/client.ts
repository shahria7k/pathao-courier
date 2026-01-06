import { HttpClient } from "./utils/http-client";
import { AuthService, type AuthServiceConfig } from "./services/auth.service";
import { StoreService } from "./services/store.service";
import { OrderService } from "./services/order.service";
import { LocationService } from "./services/location.service";
import { PricingService } from "./services/pricing.service";
import { BASE_URLS } from "./constants";
import type { StoredToken } from "./types/auth";

export interface PathaoClientConfig {
	clientId: string;
	clientSecret: string;
	username: string;
	password: string;
	environment?: "sandbox" | "production";
	baseUrl?: string;
	timeout?: number;
	onTokenUpdate?: (token: StoredToken) => Promise<void> | void;
	onTokenLoad?: () => Promise<StoredToken | null> | StoredToken | null;
}

export class PathaoClient {
	public readonly stores: StoreService;
	public readonly orders: OrderService;
	public readonly locations: LocationService;
	public readonly pricing: PricingService;

	private readonly authService: AuthService;
	private readonly httpClient: HttpClient;

	constructor(config: PathaoClientConfig) {
		// Validate required fields
		if (!config.clientId || !config.clientSecret || !config.username || !config.password) {
			throw new Error("clientId, clientSecret, username, and password are required");
		}

		// Determine base URL
		const baseUrl =
			config.baseUrl ||
			(config.environment === "production" ? BASE_URLS.production : BASE_URLS.sandbox);

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
