import { PathaoWebhookError } from '../utils/errors';
import { WEBHOOK_HEADERS } from '../constants';

/**
 * Verifies the webhook signature using timing-safe comparison
 *
 * This function validates that the incoming webhook request is authentic by comparing
 * the signature header with the expected webhook secret. It uses timing-safe comparison
 * to prevent timing attacks.
 *
 * **Security Note:** Always verify webhook signatures in production to prevent unauthorized
 * requests. Never process webhooks without signature verification.
 *
 * **Current Implementation:** This implementation assumes Pathao uses the webhook secret
 * directly as the signature. If Pathao uses a different signature algorithm (e.g., HMAC),
 * this function should be updated accordingly.
 *
 * @param signature - The signature from the X-PATHAO-Signature header
 * @param webhookSecret - Your webhook secret configured in Pathao dashboard
 * @param _payload - The webhook payload (currently unused, reserved for future HMAC verification)
 * @returns True if signature is valid
 * @throws {PathaoWebhookError} If signature is missing, webhook secret is missing, or signature is invalid
 *
 * @example
 * ```typescript
 * const signature = req.headers['x-pathao-signature'];
 * const isValid = verifySignature(signature, 'your-webhook-secret', req.body);
 * if (!isValid) {
 *   // Reject the webhook
 * }
 * ```
 *
 * @public
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
 * Performs timing-safe string comparison to prevent timing attacks
 *
 * This function compares two strings in constant time, preventing attackers from
 * using timing information to guess the correct signature. It always takes the same
 * amount of time regardless of where the strings differ.
 *
 * **Security:** This is critical for signature verification. Regular string comparison
 * (`===`) can leak information about the correct signature through timing differences.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns True if strings are equal, false otherwise
 *
 * @internal
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
