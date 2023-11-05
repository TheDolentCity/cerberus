export class MissingFieldError extends Error {
  message: string;
  cause: Error | undefined;

  constructor(field: string, cause?: Error) {
    super();
    this.message = `Missing CLI field: '${field}'`;
    this.cause = cause;
  }
}
