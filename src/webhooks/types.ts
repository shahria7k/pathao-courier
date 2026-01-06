/**
 * Express request type (minimal interface for webhook handlers)
 */
export interface ExpressRequest {
	headers: Record<string, string | string[] | undefined>;
	body: unknown;
}

/**
 * Express response type (minimal interface for webhook handlers)
 */
export interface ExpressResponse {
	setHeader(name: string, value: string): void;
	status(code: number): ExpressResponse;
	json(body: unknown): void;
}

/**
 * Express next function type
 */
export type ExpressNext = () => void;

/**
 * Fastify request type (minimal interface for webhook handlers)
 */
export interface FastifyRequest {
	headers: Record<string, string | string[] | undefined>;
	body: unknown;
}

/**
 * Fastify reply type (minimal interface for webhook handlers)
 */
export interface FastifyReply {
	header(name: string, value: string): FastifyReply;
	status(code: number): FastifyReply;
	send(body: unknown): void;
}

/**
 * Generic request type (minimal interface for webhook handlers)
 */
export interface GenericRequest {
	headers?: Record<string, string | string[] | undefined>;
	body?: unknown;
	rawBody?: unknown;
}

/**
 * Generic response type (minimal interface for webhook handlers)
 */
export interface GenericResponse {
	setHeader?: (name: string, value: string) => void;
	header?: (name: string, value: string) => void;
	status?: (code: number) => GenericResponse;
	json?: (body: unknown) => void;
	send?: (body: unknown) => void;
}
