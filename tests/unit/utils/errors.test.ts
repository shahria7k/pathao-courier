import { describe, it, expect } from "vitest";
import {
	PathaoError,
	PathaoApiError,
	PathaoValidationError,
	PathaoAuthError,
	PathaoWebhookError,
} from "../../../src/utils/errors";

describe("PathaoError", () => {
	it("should create error with message", () => {
		const error = new PathaoError("Test error");
		expect(error.message).toBe("Test error");
		expect(error.name).toBe("PathaoError");
	});

	it("should create error with status code and code", () => {
		const error = new PathaoError("Test error", 400, "TEST_ERROR");
		expect(error.statusCode).toBe(400);
		expect(error.code).toBe("TEST_ERROR");
	});
});

describe("PathaoApiError", () => {
	it("should create API error", () => {
		const error = new PathaoApiError("API error", 404);
		expect(error.message).toBe("API error");
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe("API_ERROR");
		expect(error.name).toBe("PathaoApiError");
	});

	it("should include response data", () => {
		const response = { error: "Not found" };
		const error = new PathaoApiError("API error", 404, response);
		expect(error.response).toEqual(response);
	});
});

describe("PathaoValidationError", () => {
	it("should create validation error", () => {
		const error = new PathaoValidationError("Validation error", "field");
		expect(error.message).toBe("Validation error");
		expect(error.field).toBe("field");
		expect(error.statusCode).toBe(400);
		expect(error.code).toBe("VALIDATION_ERROR");
		expect(error.name).toBe("PathaoValidationError");
	});
});

describe("PathaoAuthError", () => {
	it("should create auth error", () => {
		const error = new PathaoAuthError("Auth error");
		expect(error.message).toBe("Auth error");
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe("AUTH_ERROR");
		expect(error.name).toBe("PathaoAuthError");
	});
});

describe("PathaoWebhookError", () => {
	it("should create webhook error", () => {
		const error = new PathaoWebhookError("Webhook error");
		expect(error.message).toBe("Webhook error");
		expect(error.statusCode).toBe(400);
		expect(error.code).toBe("WEBHOOK_ERROR");
		expect(error.name).toBe("PathaoWebhookError");
	});
});
