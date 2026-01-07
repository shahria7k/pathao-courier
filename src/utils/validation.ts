import { PathaoValidationError } from './errors';

/**
 * Validates a store name according to Pathao API requirements
 *
 * @param name - The store name to validate
 * @throws {PathaoValidationError} If name is missing, not a string, or length is not between 3-50 characters
 *
 * @example
 * ```typescript
 * validateStoreName('My Store'); // OK
 * validateStoreName('AB'); // Throws: must be between 3 and 50 characters
 * validateStoreName(''); // Throws: is required and must be a string
 * ```
 */
export function validateStoreName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new PathaoValidationError('Store name is required and must be a string', 'name');
  }
  if (name.length < 3 || name.length > 50) {
    throw new PathaoValidationError('Store name must be between 3 and 50 characters', 'name');
  }
}

/**
 * Validates a contact name according to Pathao API requirements
 *
 * @param contactName - The contact person's name to validate
 * @throws {PathaoValidationError} If contactName is missing, not a string, or length is not between 3-50 characters
 *
 * @example
 * ```typescript
 * validateContactName('John Doe'); // OK
 * validateContactName('JD'); // Throws: must be between 3 and 50 characters
 * ```
 */
export function validateContactName(contactName: string): void {
  if (!contactName || typeof contactName !== 'string') {
    throw new PathaoValidationError(
      'Contact name is required and must be a string',
      'contact_name'
    );
  }
  if (contactName.length < 3 || contactName.length > 50) {
    throw new PathaoValidationError(
      'Contact name must be between 3 and 50 characters',
      'contact_name'
    );
  }
}

/**
 * Validates a phone number according to Pathao API requirements
 *
 * Phone numbers must be exactly 11 characters (typically Bangladeshi phone numbers like '01712345678').
 *
 * @param phone - The phone number to validate
 * @param fieldName - Optional field name for error messages (defaults to 'phone')
 * @throws {PathaoValidationError} If phone is missing, not a string, or length is not exactly 11 characters
 *
 * @example
 * ```typescript
 * validatePhoneNumber('01712345678'); // OK
 * validatePhoneNumber('0171234567', 'contact_number'); // Throws: contact_number must be exactly 11 characters
 * validatePhoneNumber('017123456789'); // Throws: phone must be exactly 11 characters
 * ```
 */
export function validatePhoneNumber(phone: string, fieldName: string = 'phone'): void {
  if (!phone || typeof phone !== 'string') {
    throw new PathaoValidationError(`${fieldName} is required and must be a string`, fieldName);
  }
  if (phone.length !== 11) {
    throw new PathaoValidationError(`${fieldName} must be exactly 11 characters`, fieldName);
  }
}

/**
 * Validates a recipient name according to Pathao API requirements
 *
 * @param name - The recipient's name to validate
 * @throws {PathaoValidationError} If name is missing, not a string, or length is not between 3-100 characters
 *
 * @example
 * ```typescript
 * validateRecipientName('Jane Doe'); // OK
 * validateRecipientName('JD'); // Throws: must be between 3 and 100 characters
 * ```
 */
export function validateRecipientName(name: string): void {
  if (!name || typeof name !== 'string') {
    throw new PathaoValidationError(
      'Recipient name is required and must be a string',
      'recipient_name'
    );
  }
  if (name.length < 3 || name.length > 100) {
    throw new PathaoValidationError(
      'Recipient name must be between 3 and 100 characters',
      'recipient_name'
    );
  }
}

/**
 * Validates a store address according to Pathao API requirements
 *
 * @param address - The store address to validate
 * @throws {PathaoValidationError} If address is missing, not a string, or length is not between 15-120 characters
 *
 * @example
 * ```typescript
 * validateStoreAddress('House 123, Road 4, Sector 10, Uttara, Dhaka-1230'); // OK
 * validateStoreAddress('123 Main St'); // Throws: must be between 15 and 120 characters
 * ```
 */
export function validateStoreAddress(address: string): void {
  if (!address || typeof address !== 'string') {
    throw new PathaoValidationError('Store address is required and must be a string', 'address');
  }
  if (address.length < 15 || address.length > 120) {
    throw new PathaoValidationError(
      'Store address must be between 15 and 120 characters',
      'address'
    );
  }
}

/**
 * Validates a recipient address according to Pathao API requirements
 *
 * @param address - The recipient's delivery address to validate
 * @throws {PathaoValidationError} If address is missing, not a string, or length is not between 10-220 characters
 *
 * @example
 * ```typescript
 * validateRecipientAddress('House 456, Road 8, Sector 12, Gulshan, Dhaka-1212'); // OK
 * validateRecipientAddress('456 St'); // Throws: must be between 10 and 220 characters
 * ```
 */
export function validateRecipientAddress(address: string): void {
  if (!address || typeof address !== 'string') {
    throw new PathaoValidationError(
      'Recipient address is required and must be a string',
      'recipient_address'
    );
  }
  if (address.length < 10 || address.length > 220) {
    throw new PathaoValidationError(
      'Recipient address must be between 10 and 220 characters',
      'recipient_address'
    );
  }
}

/**
 * Validates item weight according to Pathao API requirements
 *
 * Accepts both number and string formats. Strings are parsed to numbers.
 * Weight must be between 0.5 kg and 10 kg.
 *
 * @param weight - The item weight in kilograms (number or string)
 * @throws {PathaoValidationError} If weight is invalid, not a number, or outside the 0.5-10 kg range
 *
 * @example
 * ```typescript
 * validateItemWeight(0.5); // OK
 * validateItemWeight('1.5'); // OK (parsed to number)
 * validateItemWeight(0.3); // Throws: must be between 0.5 and 10 kg
 * validateItemWeight(15); // Throws: must be between 0.5 and 10 kg
 * ```
 */
export function validateItemWeight(weight: number | string): void {
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  if (isNaN(weightNum) || weightNum < 0.5 || weightNum > 10) {
    throw new PathaoValidationError('Item weight must be between 0.5 and 10 kg', 'item_weight');
  }
}

/**
 * Validates item quantity according to Pathao API requirements
 *
 * Quantity must be a positive integer (1 or greater).
 *
 * @param quantity - The number of items
 * @throws {PathaoValidationError} If quantity is not a positive integer
 *
 * @example
 * ```typescript
 * validateItemQuantity(1); // OK
 * validateItemQuantity(10); // OK
 * validateItemQuantity(0); // Throws: must be a positive integer
 * validateItemQuantity(-1); // Throws: must be a positive integer
 * validateItemQuantity(1.5); // Throws: must be a positive integer
 * ```
 */
export function validateItemQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new PathaoValidationError('Item quantity must be a positive integer', 'item_quantity');
  }
}

/**
 * Validates the amount to collect (COD - Cash on Delivery) according to Pathao API requirements
 *
 * Amount must be a non-negative integer (0 or greater). Use 0 for prepaid orders.
 *
 * @param amount - The amount to collect in the local currency (smallest unit, e.g., taka)
 * @throws {PathaoValidationError} If amount is not a non-negative integer
 *
 * @example
 * ```typescript
 * validateAmountToCollect(0); // OK (prepaid order)
 * validateAmountToCollect(1000); // OK (1000 taka COD)
 * validateAmountToCollect(-100); // Throws: must be a non-negative integer
 * validateAmountToCollect(100.5); // Throws: must be a non-negative integer
 * ```
 */
export function validateAmountToCollect(amount: number): void {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new PathaoValidationError(
      'Amount to collect must be a non-negative integer',
      'amount_to_collect'
    );
  }
}

/**
 * Validates a city ID according to Pathao API requirements
 *
 * City ID must be a positive integer. Use the LocationService to get valid city IDs.
 *
 * @param cityId - The city ID to validate
 * @throws {PathaoValidationError} If cityId is not a positive integer
 *
 * @example
 * ```typescript
 * validateCityId(1); // OK
 * validateCityId(0); // Throws: must be a positive integer
 * validateCityId(-1); // Throws: must be a positive integer
 * ```
 *
 * @see LocationService.getCities - Get list of valid city IDs
 */
export function validateCityId(cityId: number): void {
  if (!Number.isInteger(cityId) || cityId < 1) {
    throw new PathaoValidationError('City ID must be a positive integer', 'city_id');
  }
}

/**
 * Validates a zone ID according to Pathao API requirements
 *
 * Zone ID must be a positive integer. Use the LocationService to get valid zone IDs for a city.
 *
 * @param zoneId - The zone ID to validate
 * @throws {PathaoValidationError} If zoneId is not a positive integer
 *
 * @example
 * ```typescript
 * validateZoneId(298); // OK
 * validateZoneId(0); // Throws: must be a positive integer
 * ```
 *
 * @see LocationService.getZones - Get list of valid zone IDs for a city
 */
export function validateZoneId(zoneId: number): void {
  if (!Number.isInteger(zoneId) || zoneId < 1) {
    throw new PathaoValidationError('Zone ID must be a positive integer', 'zone_id');
  }
}

/**
 * Validates an area ID according to Pathao API requirements
 *
 * Area ID must be a positive integer. Use the LocationService to get valid area IDs for a zone.
 *
 * @param areaId - The area ID to validate
 * @throws {PathaoValidationError} If areaId is not a positive integer
 *
 * @example
 * ```typescript
 * validateAreaId(37); // OK
 * validateAreaId(0); // Throws: must be a positive integer
 * ```
 *
 * @see LocationService.getAreas - Get list of valid area IDs for a zone
 */
export function validateAreaId(areaId: number): void {
  if (!Number.isInteger(areaId) || areaId < 1) {
    throw new PathaoValidationError('Area ID must be a positive integer', 'area_id');
  }
}

/**
 * Validates a store ID according to Pathao API requirements
 *
 * Store ID must be a positive integer. This is the ID returned when creating a store.
 *
 * @param storeId - The store ID to validate
 * @throws {PathaoValidationError} If storeId is not a positive integer
 *
 * @example
 * ```typescript
 * validateStoreId(123456); // OK
 * validateStoreId(0); // Throws: must be a positive integer
 * ```
 *
 * @see StoreService.create - Create a store and get its ID
 * @see StoreService.list - Get list of stores with their IDs
 */
export function validateStoreId(storeId: number): void {
  if (!Number.isInteger(storeId) || storeId < 1) {
    throw new PathaoValidationError('Store ID must be a positive integer', 'store_id');
  }
}
