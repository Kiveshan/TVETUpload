// Small typed error carrying an HTTP status, so services can signal known
// failures (404/409/…) and controllers map them straight to a response.
export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}
