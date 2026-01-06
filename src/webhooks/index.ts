export { PathaoWebhookHandler, type PathaoWebhookHandlerConfig } from "./handler";
export { PathaoWebhookEvent } from "../constants";
export * from "../types/webhook";
export { verifySignature } from "./verifier";
export { parseWebhookPayload, isOrderWebhook, isStoreWebhook } from "./parser";

import { PathaoWebhookHandler, type PathaoWebhookHandlerConfig } from "./handler";

/**
 * Create Express webhook handler (for backward compatibility)
 */
export function createPathaoExpressWebhookHandler(
	config: PathaoWebhookHandlerConfig
): (req: any, res: any, next?: any) => Promise<void> {
	const handler = new PathaoWebhookHandler(config);
	return handler.express();
}

/**
 * Create Fastify webhook handler (for backward compatibility)
 */
export function createPathaoFastifyWebhookHandler(
	config: PathaoWebhookHandlerConfig
): (req: any, reply: any) => Promise<void> {
	const handler = new PathaoWebhookHandler(config);
	return handler.fastify();
}

/**
 * Create generic webhook handler (for backward compatibility)
 */
export function createPathaoGenericWebhookHandler(
	config: PathaoWebhookHandlerConfig
): (req: any, res: any) => Promise<void> {
	const handler = new PathaoWebhookHandler(config);
	return handler.generic();
}
