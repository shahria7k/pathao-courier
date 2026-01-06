import { describe, it, expect } from "vitest";
import { PathaoWebhookError } from "../../../src/utils/errors";
import { parseWebhookPayload, isOrderWebhook, isStoreWebhook } from "../../../src/webhooks/parser";
import type { OrderCreatedWebhook, StoreCreatedWebhook } from "../../../src/types/webhook";

describe("parseWebhookPayload", () => {
	it("should parse order.created webhook", () => {
		const payload = {
			consignment_id: "DL121224VS8TTJ",
			merchant_order_id: "TS-123",
			updated_at: "2024-12-27 23:49:43",
			timestamp: "2024-12-27T17:49:43+00:00",
			store_id: 130820,
			event: "order.created",
			delivery_fee: 83.46,
		};

		const result = parseWebhookPayload(payload);
		expect(result.event).toBe("order.created");
		expect(result.consignment_id).toBe("DL121224VS8TTJ");
	});

	it("should parse store.created webhook", () => {
		const payload = {
			store_id: 1,
			store_name: "Test Store",
			store_address: "Test store address",
			is_active: 1,
			event: "store.created",
			updated_at: "2024-12-27 23:55:34",
			timestamp: "2024-12-27T17:55:34+00:00",
		};

		const result = parseWebhookPayload(payload);
		expect(result.event).toBe("store.created");
		expect((result as StoreCreatedWebhook).store_id).toBe(1);
	});

	it("should throw for invalid payload", () => {
		expect(() => parseWebhookPayload(null)).toThrow(PathaoWebhookError);
		expect(() => parseWebhookPayload({})).toThrow(PathaoWebhookError);
	});

	it("should throw for unknown event type", () => {
		const payload = {
			event: "unknown.event",
		};

		expect(() => parseWebhookPayload(payload)).toThrow(PathaoWebhookError);
	});
});

describe("isOrderWebhook", () => {
	it("should return true for order webhooks", () => {
		const payload: OrderCreatedWebhook = {
			consignment_id: "DL121224VS8TTJ",
			merchant_order_id: "TS-123",
			updated_at: "2024-12-27 23:49:43",
			timestamp: "2024-12-27T17:49:43+00:00",
			store_id: 130820,
			event: "order.created",
			delivery_fee: 83.46,
		};

		expect(isOrderWebhook(payload)).toBe(true);
	});

	it("should return false for store webhooks", () => {
		const payload: StoreCreatedWebhook = {
			store_id: 1,
			store_name: "Test Store",
			store_address: "Test store address",
			is_active: 1,
			event: "store.created",
			updated_at: "2024-12-27 23:55:34",
			timestamp: "2024-12-27T17:55:34+00:00",
		};

		expect(isOrderWebhook(payload)).toBe(false);
	});
});

describe("isStoreWebhook", () => {
	it("should return true for store webhooks", () => {
		const payload: StoreCreatedWebhook = {
			store_id: 1,
			store_name: "Test Store",
			store_address: "Test store address",
			is_active: 1,
			event: "store.created",
			updated_at: "2024-12-27 23:55:34",
			timestamp: "2024-12-27T17:55:34+00:00",
		};

		expect(isStoreWebhook(payload)).toBe(true);
	});
});
