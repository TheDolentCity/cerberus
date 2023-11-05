export class MissingEnvironmentVariableError extends Error {
  message: string;
  cause: Error | undefined;

  constructor(environmentVariableName: string, cause?: Error) {
    super();
    this.message = `Missing environment variable: '${environmentVariableName}'`;
    this.cause = cause;
  }
}
