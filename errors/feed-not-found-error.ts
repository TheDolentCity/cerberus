export class FeedNotFoundError extends Error {
  message: string;
  cause: Error | undefined;

  constructor(feed: string, cause?: Error) {
    super();
    this.message = `Feed '${feed}' not found.`;
    this.cause = cause;
  }
}
