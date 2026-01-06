# Pathao Courier SDK

A modern, type-safe TypeScript SDK for the Pathao Courier Merchant API with comprehensive webhook support.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API endpoints
- ✅ **OAuth 2.0 Authentication** - Automatic token management and refresh
- ✅ **Webhook Handling** - Built-in webhook handlers for Express, Fastify, and generic frameworks
- ✅ **Input Validation** - Automatic validation of request parameters
- ✅ **Error Handling** - Custom error classes with detailed error messages
- ✅ **Framework Agnostic** - Works with any Node.js framework
- ✅ **Tree-shakeable** - Optimized for bundle size
- ✅ **Well Documented** - Comprehensive documentation and examples

## Installation

```bash
# npm
npm install pathao-courier

# yarn
yarn add pathao-courier

# pnpm
pnpm add pathao-courier
```

### ⚠️ TypeScript Configuration Required

If you're using TypeScript and importing from `'pathao-courier/webhooks'`, you **must** update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node16" // or "nodenext" or "bundler"
  }
}
```

**Without this, you'll get:** `Cannot find module 'pathao-courier/webhooks'`

See [TypeScript Support](#typescript-support) section for more details.

## Quick Start

### Basic Usage

```typescript
import { PathaoClient } from 'pathao-courier';

// Initialize the client
const client = new PathaoClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  username: 'your-email@example.com',
  password: 'your-password',
  environment: 'sandbox', // or 'production'
});

// Create a store
const store = await client.stores.create({
  name: 'My Store',
  contact_name: 'John Doe',
  contact_number: '01712345678',
  address: 'House 123, Road 4, Sector 10, Uttara, Dhaka-1230, Bangladesh',
  city_id: 1,
  zone_id: 298,
  area_id: 37,
});

// Create an order
const order = await client.orders.create({
  store_id: 123456,
  merchant_order_id: 'ORD-12345',
  recipient_name: 'Jane Smith',
  recipient_phone: '01787654321',
  recipient_address: 'House 456, Road 8, Dhanmondi, Dhaka-1205, Bangladesh',
  delivery_type: 48, // Normal Delivery
  item_type: 2, // Parcel
  item_quantity: 1,
  item_weight: 0.5,
  amount_to_collect: 1000,
});

console.log(`Order created: ${order.data.consignment_id}`);

// Get order info
const orderInfo = await client.orders.getInfo(order.data.consignment_id);
console.log(`Status: ${orderInfo.data.order_status}`);

// Calculate price
const price = await client.pricing.calculate({
  store_id: 123456,
  item_type: 2,
  delivery_type: 48,
  item_weight: 0.5,
  recipient_city: 1,
  recipient_zone: 298,
});
console.log(`Delivery fee: ${price.data.final_price} BDT`);
```

## API Reference

### Complete API Methods Table

| Service             | Method                     | Description                      | Parameters                   | Returns                       |
| ------------------- | -------------------------- | -------------------------------- | ---------------------------- | ----------------------------- |
| **Stores**          | `create`                   | Create a new store               | `CreateStoreRequest`         | `CreateStoreResponse`         |
|                     | `list`                     | Get list of stores               | -                            | `StoreListResponse`           |
| **Orders**          | `create`                   | Create a single order            | `CreateOrderRequest`         | `CreateOrderResponse`         |
|                     | `createBulk`               | Create multiple orders           | `BulkOrderRequest`           | `BulkOrderResponse`           |
|                     | `getInfo`                  | Get order info by consignment ID | `consignmentId: string`     | `OrderInfoResponse`           |
| **Locations**        | `getCities`                | Get list of all cities           | -                            | `CityListResponse`            |
|                     | `getZones`                 | Get zones for a city             | `cityId: number`            | `ZoneListResponse`            |
|                     | `getAreas`                 | Get areas for a zone             | `zoneId: number`            | `AreaListResponse`            |
| **Pricing**          | `calculate`                | Calculate delivery price         | `PriceCalculationRequest`   | `PriceCalculationResponse`    |

### Webhook Utilities Table

| Utility                                | Description                        | Framework | Returns                             |
| -------------------------------------- | ---------------------------------- | --------- | ----------------------------------- |
| `PathaoWebhookHandler`                 | Main webhook handler class         | Any       | Class instance                      |
| `createPathaoExpressWebhookHandler`   | Express.js middleware for webhooks | Express   | `(req, res, next) => Promise<void>` |
| `createPathaoFastifyWebhookHandler`   | Fastify route handler for webhooks | Fastify   | `(req, reply) => Promise<void>`    |
| `createPathaoGenericWebhookHandler`   | Generic handler for any framework  | Any       | `(req, res) => Promise<void>`       |

### Webhook Handler Methods

| Method             | Description                              | Parameters                               | Returns                    |
| ------------------ | ---------------------------------------- | ---------------------------------------- | -------------------------- |
| `handle`           | Process webhook payload                  | `body: unknown, authHeader?: string`     | `Promise<WebhookResponse>` |
| `express`          | Get Express middleware handler           | -                                        | Express middleware         |
| `fastify`          | Get Fastify route handler                | -                                        | Fastify handler            |
| `generic`          | Get generic framework handler            | -                                        | Generic handler            |
| `onOrderCreated`  | Set handler for order.created webhooks   | `handler: (payload) => void`             | `this`                     |
| `onOrderDelivered` | Set handler for order.delivered webhooks | `handler: (payload) => void`             | `this`                     |
| `on`               | Listen to webhook events (EventEmitter)  | `event: PathaoWebhookEvent, listener`   | `this`                     |

### Error Classes Table

| Error Class                    | Description                               | Properties                                                |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------- |
| `PathaoError`                  | Base error class for all Pathao errors    | `message: string, statusCode?: number, code?: string`     |
| `PathaoApiError`               | API request/response errors                | `message: string, statusCode: number, response?: unknown` |
| `PathaoValidationError`       | Input validation errors                   | `message: string, field?: string`                         |
| `PathaoAuthError`              | Authentication errors                     | `message: string`                                         |
| `PathaoWebhookError`           | Webhook processing errors                 | `message: string`                                         |

### Type Definitions & Enums

| Category           | Name                               | Description                                                                                               |
| ------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Enums**          | `PathaoWebhookEvent`               | Webhook event names (`WEBHOOK`, `ORDER_CREATED`, `ORDER_DELIVERED`, etc., `ERROR`)                      |
|                    | `DeliveryType`                     | Delivery type values (`Normal = 48`, `OnDemand = 12`)                                                    |
|                    | `ItemType`                         | Item type values (`Document = 1`, `Parcel = 2`)                                                           |
| **Request Types**  | `CreateStoreRequest`               | Store creation request payload                                                                            |
|                    | `CreateOrderRequest`               | Order creation request payload                                                                            |
|                    | `BulkOrderRequest`                 | Bulk order creation payload                                                                               |
|                    | `PriceCalculationRequest`          | Price calculation request payload                                                                         |
| **Response Types** | `CreateStoreResponse`              | Store creation response                                                                                   |
|                    | `CreateOrderResponse`              | Order creation response                                                                                   |
|                    | `OrderInfoResponse`                | Order info response                                                                                       |
|                    | `WebhookResponse`                  | Webhook processing response                                                                               |
| **Webhook Types**  | `OrderCreatedWebhook`              | Order created webhook payload                                                                             |
|                    | `OrderDeliveredWebhook`            | Order delivered webhook payload                                                                           |
|                    | `WebhookPayload`                   | Union type for all webhook payloads                                                                       |

### Validation Utilities

| Function                   | Description                                                      | Parameters                          | Throws                     |
| -------------------------- | ---------------------------------------------------------------- | ----------------------------------- | -------------------------- |
| `validateStoreName`        | Validate store name (3-50 chars)                                | `name: string`                      | `PathaoValidationError`    |
| `validateContactName`     | Validate contact name (3-50 chars)                              | `name: string`                      | `PathaoValidationError`    |
| `validatePhoneNumber`      | Validate phone number (11 digits)                                | `phone: string, fieldName?: string` | `PathaoValidationError`    |
| `validateRecipientName`    | Validate recipient name (3-100 chars)                           | `name: string`                      | `PathaoValidationError`   |
| `validateRecipientAddress` | Validate recipient address (10-220 chars)                       | `address: string`                  | `PathaoValidationError`   |
| `validateItemWeight`       | Validate item weight (0.5-10 kg)                                | `weight: number \| string`         | `PathaoValidationError`   |
| `validateItemQuantity`     | Validate item quantity (positive integer)                       | `quantity: number`                  | `PathaoValidationError`   |
| `validateAmountToCollect`  | Validate amount to collect (non-negative)                       | `amount: number`                    | `PathaoValidationError`   |

## API Reference

### Stores

#### Create Store

```typescript
const store = await client.stores.create({
  name: 'My Store', // Required: 3-50 characters
  contact_name: 'John Doe', // Required: 3-50 characters
  contact_number: '01712345678', // Required: 11 digits
  secondary_contact: '01512345678', // Optional: 11 digits
  otp_number: '01712345678', // Optional: 11 digits
  address: 'House 123, Road 4, Sector 10, Uttara, Dhaka-1230, Bangladesh', // Required: 15-120 characters
  city_id: 1, // Required
  zone_id: 298, // Required
  area_id: 37, // Required
});
```

#### List Stores

```typescript
const stores = await client.stores.list();
console.log(`Total stores: ${stores.data.total}`);
```

### Orders

#### Create Single Order

```typescript
const order = await client.orders.create({
  store_id: 123456, // Required
  merchant_order_id: 'ORD-12345', // Optional
  recipient_name: 'Jane Smith', // Required: 3-100 characters
  recipient_phone: '01787654321', // Required: 11 digits
  recipient_secondary_phone: '01587654321', // Optional: 11 digits
  recipient_address: 'House 456, Road 8, Dhanmondi, Dhaka-1205, Bangladesh', // Required: 10-220 characters
  recipient_city: 1, // Optional (auto-detected if not provided)
  recipient_zone: 298, // Optional (auto-detected if not provided)
  recipient_area: 37, // Optional (auto-detected if not provided)
  delivery_type: 48, // Required: 48 = Normal, 12 = On Demand
  item_type: 2, // Required: 1 = Document, 2 = Parcel
  special_instruction: 'Handle with care', // Optional
  item_quantity: 1, // Required: positive integer
  item_weight: 0.5, // Required: 0.5-10 kg
  item_description: 'Electronics', // Optional
  amount_to_collect: 1000, // Required: non-negative integer
});
```

#### Create Bulk Orders

```typescript
const orders = await client.orders.createBulk({
  orders: [
    {
      store_id: 123456,
      recipient_name: 'John Doe',
      recipient_phone: '01712345678',
      recipient_address: '123 Main St, Dhaka',
      delivery_type: 48,
      item_type: 2,
      item_quantity: 1,
      item_weight: 0.5,
      amount_to_collect: 1000,
    },
    {
      store_id: 123456,
      recipient_name: 'Jane Smith',
      recipient_phone: '01787654321',
      recipient_address: '456 Oak Ave, Dhaka',
      delivery_type: 48,
      item_type: 2,
      item_quantity: 1,
      item_weight: 0.5,
      amount_to_collect: 2000,
    },
  ],
});
```

#### Get Order Info

```typescript
const orderInfo = await client.orders.getInfo('DL121224VS8TTJ');
console.log(`Status: ${orderInfo.data.order_status}`);
```

### Locations

#### Get Cities

```typescript
const cities = await client.locations.getCities();
console.log(`Available cities: ${cities.data.data.length}`);
```

#### Get Zones

```typescript
const zones = await client.locations.getZones(1); // City ID
console.log(`Available zones: ${zones.data.data.length}`);
```

#### Get Areas

```typescript
const areas = await client.locations.getAreas(298); // Zone ID
console.log(`Available areas: ${areas.data.data.length}`);
```

### Pricing

#### Calculate Price

```typescript
const price = await client.pricing.calculate({
  store_id: 123456,
  item_type: 2, // Parcel
  delivery_type: 48, // Normal Delivery
  item_weight: 0.5, // kg
  recipient_city: 1,
  recipient_zone: 298,
});

console.log(`Delivery fee: ${price.data.final_price} BDT`);
console.log(`Base price: ${price.data.price} BDT`);
console.log(`Discount: ${price.data.discount} BDT`);
```

## Webhook Integration

The SDK provides comprehensive webhook handling utilities to help you build webhook endpoints quickly.

### Express.js Example

**Recommended: Use handler instance directly**

```typescript
import express from 'express';
import { PathaoWebhookHandler, PathaoWebhookEvent } from 'pathao-courier/webhooks';

const app = express();
app.use(express.json());

// Create handler instance and set up callbacks
const webhookHandler = new PathaoWebhookHandler({
  webhookSecret: 'your-webhook-secret',
  integrationSecret: 'f3992ecc-59da-4cbe-a049-a13da2018d51', // For test responses
});

webhookHandler.onOrderCreated(async (payload) => {
  console.log('Order created:', payload);
  // Handle order creation
  // e.g., update database, send notification, etc.
});

webhookHandler.onOrderDelivered(async (payload) => {
  console.log('Order delivered:', payload);
  // Handle delivery completion
});

// Use the handler directly as Express route handler
app.post('/pathao-webhook', webhookHandler.express());
```

**Alternative: Using adapter function**

```typescript
import express from 'express';
import { createPathaoExpressWebhookHandler } from 'pathao-courier/webhooks';

const app = express();
app.use(express.json());

const webhookHandler = createPathaoExpressWebhookHandler({
  webhookSecret: 'your-webhook-secret',
});

app.post('/pathao-webhook', webhookHandler);
```

### Fastify Example

**Recommended: Use handler instance directly**

```typescript
import Fastify from 'fastify';
import { PathaoWebhookHandler } from 'pathao-courier/webhooks';

const fastify = Fastify();

// Create handler instance and set up callbacks
const webhookHandler = new PathaoWebhookHandler({
  webhookSecret: 'your-webhook-secret',
});

webhookHandler.onOrderDelivered(async (payload) => {
  console.log('Order delivered:', payload);
});

// Use the handler directly as Fastify route handler
fastify.post('/pathao-webhook', webhookHandler.fastify());
```

**Alternative: Using adapter function**

```typescript
import Fastify from 'fastify';
import { createPathaoFastifyWebhookHandler } from 'pathao-courier/webhooks';

const fastify = Fastify();

const webhookHandler = createPathaoFastifyWebhookHandler({
  webhookSecret: 'your-webhook-secret',
});

fastify.post('/pathao-webhook', webhookHandler);
```

### Generic Framework Example

**Recommended: Use handler instance directly**

```typescript
import { PathaoWebhookHandler } from 'pathao-courier/webhooks';

// Create handler instance and set up callbacks
const webhookHandler = new PathaoWebhookHandler({
  webhookSecret: 'your-webhook-secret',
});

webhookHandler.onOrderDelivered(async (payload) => {
  console.log('Order delivered:', payload);
});

// Use with any framework
app.post('/pathao-webhook', async (req, res) => {
  await webhookHandler.generic()(req, res);
});
```

### Manual Webhook Handling

```typescript
import { PathaoWebhookHandler, PathaoWebhookEvent } from 'pathao-courier/webhooks';

const handler = new PathaoWebhookHandler({
  webhookSecret: 'your-webhook-secret',
});

// Set up event listeners using PathaoWebhookEvent enum
handler.on(PathaoWebhookEvent.WEBHOOK, (payload) => {
  console.log('Received webhook:', payload);
});

handler.on(PathaoWebhookEvent.ORDER_CREATED, (payload) => {
  console.log('Order created:', payload);
});

handler.on(PathaoWebhookEvent.ORDER_DELIVERED, (payload) => {
  console.log('Order delivered:', payload);
});

handler.on(PathaoWebhookEvent.ERROR, (error) => {
  console.error('Webhook error:', error);
});

// Process webhook
const result = await handler.handle(request.body, request.headers['x-pathao-signature']);

if (result.status === 'success') {
  // Webhook processed successfully
} else {
  // Handle error
  console.error(result.message);
}
```

### Webhook Events

The `PathaoWebhookHandler` emits events that you can listen to using the `PathaoWebhookEvent` enum:

- **`PathaoWebhookEvent.WEBHOOK`** - Emitted for any Pathao webhook payload after successful parsing and authentication
- **`PathaoWebhookEvent.ORDER_CREATED`** - Emitted when an order is created
- **`PathaoWebhookEvent.ORDER_DELIVERED`** - Emitted when an order is delivered
- **`PathaoWebhookEvent.ORDER_PICKED`** - Emitted when an order is picked up
- **`PathaoWebhookEvent.STORE_CREATED`** - Emitted when a store is created
- **`PathaoWebhookEvent.ERROR`** - Emitted when an error occurs during webhook processing

```typescript
import { PathaoWebhookHandler, PathaoWebhookEvent } from 'pathao-courier/webhooks';

const handler = new PathaoWebhookHandler({ webhookSecret: 'your-webhook-secret' });

// Listen to all webhooks
handler.on(PathaoWebhookEvent.WEBHOOK, (payload) => {
  console.log('Any Pathao webhook received:', payload);
});

// Listen to specific webhook types
handler.on(PathaoWebhookEvent.ORDER_DELIVERED, (payload) => {
  // payload is typed as OrderDeliveredWebhook
  console.log('Consignment ID:', payload.consignment_id);
  console.log('Collected Amount:', payload.collected_amount);
});

// Handle errors
handler.on(PathaoWebhookEvent.ERROR, (error) => {
  console.error('Pathao webhook processing error:', error);
});
```

### Webhook Payload Types

The SDK provides TypeScript types for webhook payloads:

```typescript
import type {
  OrderCreatedWebhook,
  OrderDeliveredWebhook,
  WebhookPayload,
} from 'pathao-courier';

// Type-safe webhook handling
handler.onOrderDelivered((payload: OrderDeliveredWebhook) => {
  // payload is fully typed
  console.log(payload.consignment_id);
  console.log(payload.collected_amount);
  console.log(payload.event); // Type: "order.delivered"
});
```

## Token Management

The SDK automatically manages OAuth 2.0 tokens, including automatic refresh. You can optionally provide callbacks for custom token storage:

```typescript
import { PathaoClient } from 'pathao-courier';
import type { StoredToken } from 'pathao-courier';

// Custom token storage
const client = new PathaoClient({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  username: 'your-email@example.com',
  password: 'your-password',
  environment: 'sandbox',
  onTokenUpdate: async (token: StoredToken) => {
    // Save token to database
    await db.saveToken(token);
  },
  onTokenLoad: async (): Promise<StoredToken | null> => {
    // Load token from database
    return await db.loadToken();
  },
});
```

## Error Handling

The SDK provides custom error classes for better error handling:

```typescript
import {
  PathaoError,
  PathaoApiError,
  PathaoValidationError,
  PathaoAuthError,
  PathaoWebhookError,
} from 'pathao-courier';

try {
  await client.orders.create(orderData);
} catch (error) {
  if (error instanceof PathaoValidationError) {
    console.error('Validation error:', error.message);
    console.error('Field:', error.field);
  } else if (error instanceof PathaoApiError) {
    console.error('API error:', error.message);
    console.error('Status code:', error.statusCode);
  } else if (error instanceof PathaoAuthError) {
    console.error('Authentication error:', error.message);
  } else if (error instanceof PathaoError) {
    console.error('Pathao error:', error.message);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions.

### Module Resolution

If you encounter module resolution errors when importing from `'pathao-courier/webhooks'`, ensure your `tsconfig.json` uses one of these `moduleResolution` settings:

- `"node16"` (recommended for Node.js projects)
- `"nodenext"` (recommended for modern Node.js projects)
- `"bundler"` (recommended for bundler-based projects)

Example `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node16"
    // ... other options
  }
}
```

### Type Definitions

The SDK provides full type definitions:

```typescript
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderInfoResponse,
  WebhookPayload,
} from 'pathao-courier';

// All types are exported and available
const orderRequest: CreateOrderRequest = {
  // TypeScript will autocomplete and validate
};
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint

# Format code
npm run format

# Generate documentation
npm run docs
```

## License

MIT

## Support

For API documentation and support, please visit the [Pathao Courier Portal](https://merchant.pathao.com).
