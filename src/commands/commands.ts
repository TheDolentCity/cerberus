export interface AddFeedCommand {
  feedUrl: string;
}

export interface RemoveFeedCommand {
  feedUrl: string;
}

export interface TestFeedCommand {
  feedUrl: string;
  lastUpdated: number;
}
