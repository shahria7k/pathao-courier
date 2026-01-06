import { describe, it, expect } from "vitest";
import { PathaoValidationError } from "../../../src/utils/errors";
import {
	validateStoreName,
	validateContactName,
	validatePhoneNumber,
	validateRecipientName,
	validateItemWeight,
	validateItemQuantity,
	validateAmountToCollect,
} from "../../../src/utils/validation";

describe("validateStoreName", () => {
	it("should pass for valid store name", () => {
		expect(() => validateStoreName("My Store")).not.toThrow();
	});

	it("should throw for name less than 3 characters", () => {
		expect(() => validateStoreName("AB")).toThrow(PathaoValidationError);
	});

	it("should throw for name more than 50 characters", () => {
		expect(() => validateStoreName("A".repeat(51))).toThrow(PathaoValidationError);
	});
});

describe("validatePhoneNumber", () => {
	it("should pass for valid 11-digit phone number", () => {
		expect(() => validatePhoneNumber("01712345678")).not.toThrow();
	});

	it("should throw for phone number not exactly 11 characters", () => {
		expect(() => validatePhoneNumber("0171234567")).toThrow(PathaoValidationError);
		expect(() => validatePhoneNumber("017123456789")).toThrow(PathaoValidationError);
	});
});

describe("validateItemWeight", () => {
	it("should pass for valid weight", () => {
		expect(() => validateItemWeight(0.5)).not.toThrow();
		expect(() => validateItemWeight(10)).not.toThrow();
		expect(() => validateItemWeight("0.5")).not.toThrow();
	});

	it("should throw for weight less than 0.5", () => {
		expect(() => validateItemWeight(0.4)).toThrow(PathaoValidationError);
	});

	it("should throw for weight more than 10", () => {
		expect(() => validateItemWeight(10.1)).toThrow(PathaoValidationError);
	});
});

describe("validateItemQuantity", () => {
	it("should pass for valid quantity", () => {
		expect(() => validateItemQuantity(1)).not.toThrow();
		expect(() => validateItemQuantity(100)).not.toThrow();
	});

	it("should throw for non-positive quantity", () => {
		expect(() => validateItemQuantity(0)).toThrow(PathaoValidationError);
		expect(() => validateItemQuantity(-1)).toThrow(PathaoValidationError);
	});
});

describe("validateAmountToCollect", () => {
	it("should pass for valid amount", () => {
		expect(() => validateAmountToCollect(0)).not.toThrow();
		expect(() => validateAmountToCollect(1000)).not.toThrow();
	});

	it("should throw for negative amount", () => {
		expect(() => validateAmountToCollect(-1)).toThrow(PathaoValidationError);
	});
});
