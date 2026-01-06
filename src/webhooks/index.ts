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
 * Create Express webhook handler (for backward compatibility)
 */
export function createPathaoExpressWebhookHandler(
  config: PathaoWebhookHandlerConfig
): (req: ExpressRequest, res: ExpressResponse, next?: ExpressNext) => Promise<void> {
  const handler = new PathaoWebhookHandler(config);
  return handler.express();
}

/**
 * Create Fastify webhook handler (for backward compatibility)
 */
export function createPathaoFastifyWebhookHandler(
  config: PathaoWebhookHandlerConfig
): (req: FastifyRequest, reply: FastifyReply) => Promise<void> {
  const handler = new PathaoWebhookHandler(config);
  return handler.fastify();
}

/**
 * Create generic webhook handler (for backward compatibility)
 */
export function createPathaoGenericWebhookHandler(
  config: PathaoWebhookHandlerConfig
): (req: GenericRequest, res: GenericResponse) => Promise<void> {
  const handler = new PathaoWebhookHandler(config);
  return handler.generic();
}
