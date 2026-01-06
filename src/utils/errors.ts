/**
 * Base error class for all Pathao SDK errors
 */
export class PathaoError extends Error {
	public readonly statusCode?: number;
	public readonly code?: string;

	constructor(message: string, statusCode?: number, code?: string) {
		super(message);
		this.name = "PathaoError";
		this.statusCode = statusCode;
		this.code = code;
		Object.setPrototypeOf(this, PathaoError.prototype);
	}
}

/**
 * Error thrown when API requests fail
 */
export class PathaoApiError extends PathaoError {
	public readonly response?: unknown;

	constructor(message: string, statusCode: number, response?: unknown) {
		super(message, statusCode, "API_ERROR");
		this.name = "PathaoApiError";
		this.response = response;
		Object.setPrototypeOf(this, PathaoApiError.prototype);
	}
}

/**
 * Error thrown when input validation fails
 */
export class PathaoValidationError extends PathaoError {
	public readonly field?: string;

	constructor(message: string, field?: string) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "PathaoValidationError";
		this.field = field;
		Object.setPrototypeOf(this, PathaoValidationError.prototype);
	}
}

/**
 * Error thrown when authentication fails
 */
export class PathaoAuthError extends PathaoError {
	constructor(message: string) {
		super(message, 401, "AUTH_ERROR");
		this.name = "PathaoAuthError";
		Object.setPrototypeOf(this, PathaoAuthError.prototype);
	}
}

/**
 * Error thrown when webhook processing fails
 */
export class PathaoWebhookError extends PathaoError {
	constructor(message: string) {
		super(message, 400, "WEBHOOK_ERROR");
		this.name = "PathaoWebhookError";
		Object.setPrototypeOf(this, PathaoWebhookError.prototype);
	}
}
