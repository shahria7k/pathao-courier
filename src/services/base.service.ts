import { HttpClient } from "../utils/http-client";

/**
 * Base service class that all API services extend
 */
export abstract class BaseService {
	protected readonly httpClient: HttpClient;

	constructor(httpClient: HttpClient) {
		this.httpClient = httpClient;
	}
}
