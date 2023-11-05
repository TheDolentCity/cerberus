export const Commands: Readonly<{
  ADD_FEED: string;
  REMOVE_FEED: string;
  TEST_FEED: string;
}> = {
  ADD_FEED: 'addFeed',
  REMOVE_FEED: 'removeFeed',
  TEST_FEED: 'testFeed',
};

export interface Flags {
  feed?: string | undefined;
  lastUpdated?: number | undefined;
}

export interface Post {
  publicationTitle: string;
  postTitle: string;
  postLink: string;
  postDescription?: string;
}
