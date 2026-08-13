import { createApiApplication } from "../server/_core/app";

/**
 * Vercel automatically invokes this function for /api/* requests. The
 * Express application remains the request handler; it never opens a port.
 */
console.info("[Vercel] Initializing Skillpath API function");
const app = createApiApplication();

export const config = {
  maxDuration: 30,
};

export default app;
