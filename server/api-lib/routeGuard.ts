import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Express 4 does not forward a rejected async handler, so a failed import
 * leaves the HTTP response open until the client times out.
 */
export function guardRoute(handler: (...args: unknown[]) => unknown): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => handler(req, res, next))
      .catch((error: unknown) => {
        const code = error && typeof error === 'object' && 'code' in error && typeof (error as { code?: unknown }).code === 'string'
          ? (error as { code: string }).code
          : 'route_failed';
        console.error('[api] route failed', code, error instanceof Error ? error.name : '');
        if (res.headersSent) return;
        res.status(500).json({ error: '요청을 처리하지 못했습니다.', code });
      });
  };
}

type RouteRegistrar = (...args: unknown[]) => unknown;

export function installAsyncRouteGuard(app: {
  get: RouteRegistrar;
  post: RouteRegistrar;
  put: RouteRegistrar;
  delete: RouteRegistrar;
  patch: RouteRegistrar;
}): void {
  for (const method of ['get', 'post', 'put', 'delete', 'patch'] as const) {
    const original = app[method].bind(app);
    app[method] = (...args: unknown[]) => {
      const index = args.length - 1;
      const handler = args[index];
      if (typeof handler === 'function' && handler.constructor?.name === 'AsyncFunction') {
        args[index] = guardRoute(handler as (...args: unknown[]) => unknown);
      }
      return original(...args);
    };
  }
}
