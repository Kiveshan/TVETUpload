import type { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps an async route handler so a rejected promise (or a synchronous throw)
// is forwarded to Express's error middleware via next(), instead of becoming an
// unhandled rejection that leaves the request hanging. Lets controllers simply
// `throw` a domain error and rely on the central errorHandler to map it.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
