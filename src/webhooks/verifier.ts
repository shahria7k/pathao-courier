import { PathaoWebhookError } from '../utils/errors';
import { WEBHOOK_HEADERS } from '../constants';

/**
 * Verify webhook signature using timing-safe comparison
 */
export function verifySignature(
  signature: string | undefined | null,
  webhookSecret: string,
  _payload: unknown
): boolean {
  if (!signature) {
    throw new PathaoWebhookError(`Missing ${WEBHOOK_HEADERS.SIGNATURE} header`);
  }

  if (!webhookSecret) {
    throw new PathaoWebhookError('Webhook secret is required');
  }

  // Create expected signature (Pathao uses the webhook secret as the signature)
  // Note: The actual signature verification method may vary based on Pathao's implementation
  // This is a placeholder - adjust based on actual Pathao webhook signature algorithm
  // For now, we verify that the signature matches the webhook secret
  const expectedSignature = webhookSecret;

  // Timing-safe comparison
  if (!timingSafeEqual(signature, expectedSignature)) {
    throw new PathaoWebhookError('Invalid webhook signature');
  }

  return true;
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
