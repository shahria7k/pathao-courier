export { PathaoWebhookHandler, type PathaoWebhookHandlerConfig } from './handler';
export { PathaoWebhookEvent } from '../constants';
export * from '../types/webhook';
export { verifySignature } from './verifier';
export { parseWebhookPayload, isOrderWebhook, isStoreWebhook } from './parser';
export type {
  ExpressRequest,
  ExpressResponse,
  ExpressNext,
  FastifyRequest,
  FastifyReply,
  GenericRequest,
  GenericResponse,
} from './types';

import { PathaoWebhookHandler, type PathaoWebhookHandlerConfig } from './handler';

import type {
  ExpressRequest,
  ExpressResponse,
  ExpressNext,
  FastifyRequest,
  FastifyReply,
  GenericRequest,
  GenericResponse,
} from './types';

/**
 * Creates an Express.js middleware function for handling Pathao webhooks
 *
 * This is a convenience function for backward compatibility. For new code,
 * prefer using `PathaoWebhookHandler` directly:
 * ```typescript
 * const handler = new PathaoWebhookHandler(config);
 * app.post('/webhook', handler.express());
 * ```
 *
 * @param config - Webhook handler configuration
 * @returns Express middleware function that handles webhook requests
 *
 * @example
 * ```typescript
 * import { createPathaoExpressWebhookHandler } from 'pathao-courier/webhooks';
 *
 * const webhookHandler = createPathaoExpressWebhookHandler({
 *   webhookSecret: 'your-webhook-secret'
 * });
 *
 * app.post('/webhook', webhookHandler);
 * ```
 *
 * @public
 */
export function createPathaoExpressWebhookHandler(
  config: PathaoWebhookHandlerConfig
): (req: ExpressRequest, res: ExpressResponse, next?: ExpressNext) => Promise<void> {
  const handler = new PathaoWebhookHandler(config);
  return handler.express();
}

/**
 * Creates a Fastify route handler function for handling Pathao webhooks
 *
 * This is a convenience function for backward compatibility. For new code,
 * prefer using `PathaoWebhookHandler` directly:
 * ```typescript
 * const handler = new PathaoWebhookHandler(config);
 * fastify.post('/webhook', handler.fastify());
 * ```
 *
 * @param config - Webhook handler configuration
 * @returns Fastify route handler function
 *
 * @example
 * ```typescript
 * import { createPathaoFastifyWebhookHandler } from 'pathao-courier/webhooks';
 *
 * const webhookHandler = createPathaoFastifyWebhookHandler({
 *   webhookSecret: 'your-webhook-secret'
 * });
 *
 * fastify.post('/webhook', webhookHandler);
 * ```
 *
 * @public
 */
export function createPathaoFastifyWebhookHandler(
  config: PathaoWebhookHandlerConfig
): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
  const handler = new PathaoWebhookHandler(config);
  return handler.fastify();
}

/**
 * Creates a generic framework-agnostic handler function for Pathao webhooks
 *
 * This is a convenience function for backward compatibility. For new code,
 * prefer using `PathaoWebhookHandler` directly:
 * ```typescript
 * const handler = new PathaoWebhookHandler(config);
 * router.post('/webhook', async (req, res) => {
 *   await handler.generic()(req, res);
 * });
 * ```
 *
 * Useful for frameworks not directly supported (Koa, Hapi, etc.).
 *
 * @param config - Webhook handler configuration
 * @returns Generic handler function that works with any framework
 *
 * @example
 * ```typescript
 * import { createPathaoGenericWebhookHandler } from 'pathao-courier/webhooks';
 *
 * const webhookHandler = createPathaoGenericWebhookHandler({
 *   webhookSecret: 'your-webhook-secret'
 * });
 *
 * router.post('/webhook', async (req, res) => {
 *   await webhookHandler(req, res);
 * });
 * ```
 *
 * @public
 */
export function createPathaoGenericWebhookHandler(
  config: PathaoWebhookHandlerConfig
): (req: GenericRequest, res: GenericResponse) => Promise<void> {
  const handler = new PathaoWebhookHandler(config);
  return handler.generic();
}
