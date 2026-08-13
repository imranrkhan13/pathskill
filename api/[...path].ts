/**
 * Vercel automatically invokes this function for /api/* requests. The
 * Express application remains the request handler; it never opens a port.
 * Loading it on demand makes module-start failures observable in Vercel logs.
 */
let appHandler: ((req: unknown, res: unknown) => unknown) | null = null;

async function getAppHandler() {
  if (appHandler) return appHandler;

  const { createApiApplication } = await import("../server/_core/app");
  appHandler = createApiApplication() as unknown as (req: unknown, res: unknown) => unknown;
  return appHandler;
}

export const config = {
  maxDuration: 30,
};

export default async function handler(req: unknown, res: any) {
  try {
    const app = await getAppHandler();
    return app(req, res);
  } catch (error) {
    console.error("[Vercel] Skillpath API initialization failed", error);
    return res.status(500).json({
      error: "API initialization failed",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
