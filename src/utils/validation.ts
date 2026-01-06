import { PathaoValidationError } from "./errors";

/**
 * Validate store name (3-50 characters)
 */
export function validateStoreName(name: string): void {
	if (!name || typeof name !== "string") {
		throw new PathaoValidationError("Store name is required and must be a string", "name");
	}
	if (name.length < 3 || name.length > 50) {
		throw new PathaoValidationError(
			"Store name must be between 3 and 50 characters",
			"name"
		);
	}
}

/**
 * Validate contact name (3-50 characters)
 */
export function validateContactName(contactName: string): void {
	if (!contactName || typeof contactName !== "string") {
		throw new PathaoValidationError(
			"Contact name is required and must be a string",
			"contact_name"
		);
	}
	if (contactName.length < 3 || contactName.length > 50) {
		throw new PathaoValidationError(
			"Contact name must be between 3 and 50 characters",
			"contact_name"
		);
	}
}

/**
 * Validate phone number (exactly 11 characters)
 */
export function validatePhoneNumber(phone: string, fieldName: string = "phone"): void {
	if (!phone || typeof phone !== "string") {
		throw new PathaoValidationError(
			`${fieldName} is required and must be a string`,
			fieldName
		);
	}
	if (phone.length !== 11) {
		throw new PathaoValidationError(
			`${fieldName} must be exactly 11 characters`,
			fieldName
		);
	}
}

/**
 * Validate recipient name (3-100 characters)
 */
export function validateRecipientName(name: string): void {
	if (!name || typeof name !== "string") {
		throw new PathaoValidationError(
			"Recipient name is required and must be a string",
			"recipient_name"
		);
	}
	if (name.length < 3 || name.length > 100) {
		throw new PathaoValidationError(
			"Recipient name must be between 3 and 100 characters",
			"recipient_name"
		);
	}
}

/**
 * Validate store address (15-120 characters)
 */
export function validateStoreAddress(address: string): void {
	if (!address || typeof address !== "string") {
		throw new PathaoValidationError(
			"Store address is required and must be a string",
			"address"
		);
	}
	if (address.length < 15 || address.length > 120) {
		throw new PathaoValidationError(
			"Store address must be between 15 and 120 characters",
			"address"
		);
	}
}

/**
 * Validate recipient address (10-220 characters)
 */
export function validateRecipientAddress(address: string): void {
	if (!address || typeof address !== "string") {
		throw new PathaoValidationError(
			"Recipient address is required and must be a string",
			"recipient_address"
		);
	}
	if (address.length < 10 || address.length > 220) {
		throw new PathaoValidationError(
			"Recipient address must be between 10 and 220 characters",
			"recipient_address"
		);
	}
}

/**
 * Validate item weight (0.5-10 kg)
 */
export function validateItemWeight(weight: number | string): void {
	const weightNum = typeof weight === "string" ? parseFloat(weight) : weight;
	if (isNaN(weightNum) || weightNum < 0.5 || weightNum > 10) {
		throw new PathaoValidationError(
			"Item weight must be between 0.5 and 10 kg",
			"item_weight"
		);
	}
}

/**
 * Validate item quantity (must be positive integer)
 */
export function validateItemQuantity(quantity: number): void {
	if (!Number.isInteger(quantity) || quantity < 1) {
		throw new PathaoValidationError(
			"Item quantity must be a positive integer",
			"item_quantity"
		);
	}
}

/**
 * Validate amount to collect (must be non-negative)
 */
export function validateAmountToCollect(amount: number): void {
	if (!Number.isInteger(amount) || amount < 0) {
		throw new PathaoValidationError(
			"Amount to collect must be a non-negative integer",
			"amount_to_collect"
		);
	}
}

/**
 * Validate city ID (must be positive integer)
 */
export function validateCityId(cityId: number): void {
	if (!Number.isInteger(cityId) || cityId < 1) {
		throw new PathaoValidationError("City ID must be a positive integer", "city_id");
	}
}

/**
 * Validate zone ID (must be positive integer)
 */
export function validateZoneId(zoneId: number): void {
	if (!Number.isInteger(zoneId) || zoneId < 1) {
		throw new PathaoValidationError("Zone ID must be a positive integer", "zone_id");
	}
}

/**
 * Validate area ID (must be positive integer)
 */
export function validateAreaId(areaId: number): void {
	if (!Number.isInteger(areaId) || areaId < 1) {
		throw new PathaoValidationError("Area ID must be a positive integer", "area_id");
	}
}

/**
 * Validate store ID (must be positive integer)
 */
export function validateStoreId(storeId: number): void {
	if (!Number.isInteger(storeId) || storeId < 1) {
		throw new PathaoValidationError("Store ID must be a positive integer", "store_id");
	}
}
