/**
 * Minimal Express request interface for webhook handlers
 *
 * This interface provides only the properties needed for webhook processing,
 * allowing compatibility with Express.js without requiring the full Express types.
 *
 * @public
 */
export interface ExpressRequest {
  /** HTTP headers, including X-PATHAO-Signature */
  headers: Record<string, string | string[] | undefined>;
  /** Parsed request body containing the webhook payload */
  body: unknown;
}

/**
 * Minimal Express response interface for webhook handlers
 *
 * This interface provides only the methods needed for webhook responses,
 * allowing compatibility with Express.js without requiring the full Express types.
 *
 * @public
 */
export interface ExpressResponse {
  /**
   * Sets an HTTP response header
   *
   * @param name - Header name
   * @param value - Header value
   */
  setHeader(name: string, value: string): void;
  /**
   * Sets the HTTP status code
   *
   * @param code - HTTP status code
   * @returns The response object for chaining
   */
  status(code: number): ExpressResponse;
  /**
   * Sends a JSON response
   *
   * @param body - Response body to send as JSON
   */
  json(body: unknown): void;
}

/**
 * Express next function type for middleware
 *
 * @public
 */
export type ExpressNext = () => void;

/**
 * Minimal Fastify request interface for webhook handlers
 *
 * This interface provides only the properties needed for webhook processing,
 * allowing compatibility with Fastify without requiring the full Fastify types.
 *
 * @public
 */
export interface FastifyRequest {
  /** HTTP headers, including X-PATHAO-Signature */
  headers: Record<string, string | string[] | undefined>;
  /** Parsed request body containing the webhook payload */
  body: unknown;
}

/**
 * Minimal Fastify reply interface for webhook handlers
 *
 * This interface provides only the methods needed for webhook responses,
 * allowing compatibility with Fastify without requiring the full Fastify types.
 *
 * @public
 */
export interface FastifyReply {
  /**
   * Sets an HTTP response header
   *
   * @param name - Header name
   * @param value - Header value
   * @returns The reply object for chaining
   */
  header(name: string, value: string): FastifyReply;
  /**
   * Sets the HTTP status code
   *
   * @param code - HTTP status code
   * @returns The reply object for chaining
   */
  status(code: number): FastifyReply;
  /**
   * Sends a response
   *
   * @param body - Response body to send
   */
  send(body: unknown): void;
}

/**
 * Generic request interface for framework-agnostic webhook handlers
 *
 * This interface is designed to work with any Node.js web framework by
 * providing optional properties that different frameworks may use.
 *
 * @public
 */
export interface GenericRequest {
  /** HTTP headers, including X-PATHAO-Signature */
  headers?: Record<string, string | string[] | undefined>;
  /** Parsed request body containing the webhook payload */
  body?: unknown;
  /** Raw request body (used by some frameworks like Koa) */
  rawBody?: unknown;
}

/**
 * Generic response interface for framework-agnostic webhook handlers
 *
 * This interface is designed to work with any Node.js web framework by
 * providing optional methods that different frameworks may implement.
 *
 * @public
 */
export interface GenericResponse {
  /**
   * Sets an HTTP response header (Express-style)
   *
   * @param name - Header name
   * @param value - Header value
   */
  setHeader?: (name: string, value: string) => void;
  /**
   * Sets an HTTP response header (Fastify-style)
   *
   * @param name - Header name
   * @param value - Header value
   * @returns The response object for chaining
   */
  header?: (name: string, value: string) => void;
  /**
   * Sets the HTTP status code
   *
   * @param code - HTTP status code
   * @returns The response object for chaining
   */
  status?: (code: number) => GenericResponse;
  /**
   * Sends a JSON response (Express-style)
   *
   * @param body - Response body to send as JSON
   */
  json?: (body: unknown) => void;
  /**
   * Sends a response (Fastify/Koa-style)
   *
   * @param body - Response body to send
   */
  send?: (body: unknown) => void;
}
