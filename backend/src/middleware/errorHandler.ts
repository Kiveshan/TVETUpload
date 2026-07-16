import type { ErrorRequestHandler } from "express";

// Central error middleware. Domain errors carry an HTTP status either as
// `statusCode` (HttpError) or `status`; both are mapped here so controllers can
// just `throw`. Anything without a client status is treated as an unexpected
// 500 and its message is not leaked.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode =
    typeof err?.statusCode === "number"
      ? err.statusCode
      : typeof err?.status === "number"
        ? err.status
        : 500;

  if (statusCode >= 500) {
    console.error(err);
  }

  const message =
    statusCode >= 500 ? "Internal server error." : err?.message ?? "Request failed.";

  res.status(statusCode).json({ message });
};
