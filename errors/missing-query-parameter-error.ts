export class MissingQueryParameterError extends Error {
  message: string;
  cause: Error | undefined;

  constructor(queryParameterName: string, cause?: Error) {
    super();
    this.message = `Missing query parameter: '${queryParameterName}'`;
    this.cause = cause;
  }
}
