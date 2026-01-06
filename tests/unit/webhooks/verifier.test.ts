import { describe, it, expect } from "vitest";
import { PathaoWebhookError } from "../../../src/utils/errors";
import { verifySignature } from "../../../src/webhooks/verifier";

describe("verifySignature", () => {
	const webhookSecret = "test-secret";
	const payload = { event: "order.created" };

	it("should verify valid signature", () => {
		// Note: This test assumes the signature is the webhook secret itself
		// Adjust based on actual Pathao signature algorithm
		expect(() => verifySignature(webhookSecret, webhookSecret, payload)).not.toThrow();
	});

	it("should throw for missing signature", () => {
		expect(() => verifySignature(undefined, webhookSecret, payload)).toThrow(
			PathaoWebhookError
		);
		expect(() => verifySignature(null, webhookSecret, payload)).toThrow(PathaoWebhookError);
	});

	it("should throw for missing webhook secret", () => {
		expect(() => verifySignature("signature", "", payload)).toThrow(PathaoWebhookError);
	});

	it("should throw for invalid signature", () => {
		expect(() => verifySignature("wrong-signature", webhookSecret, payload)).toThrow();
	});
});
