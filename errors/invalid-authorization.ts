export class InvalidAuthorization extends Error {
  message: string;
  cause: Error | undefined;

  constructor(cause?: Error) {
    super();
    this.message = `Invalid authorization.'`;
    this.cause = cause;
  }
}
