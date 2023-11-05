import { FeedData, extract } from 'npm:@extractus/feed-extractor';
import {
  consoleError,
  consoleLog,
  consoleNewLine,
  consoleSeparator,
} from '../utilities/console.ts';

import { FeedNotFoundError } from '../errors/feed-not-found-error.ts';
import { Post } from '../types.ts';

export function consoleLogPosts(posts: Post[]) {
  consoleNewLine();
  consoleSeparator();
  if (posts && posts.length === 0) {
    consoleLog('No posts found');
  } else {
    console.log(posts);
  }
  consoleSeparator();
  consoleNewLine();
}

export function consoleLogFeed(feed: FeedData) {
  consoleNewLine();
  consoleSeparator();
  console.log(feed);
  consoleSeparator();
  consoleNewLine();
}

export async function getRssFeed(feedUrl: string): Promise<FeedData> {
  consoleLog(`Retrieving RSS feed (${feedUrl})......`);
  const feed = await extract(feedUrl, {
    xmlParserOptions: {
      ignoreAttributes: false,
      unpairedTags: ['hr', 'br', 'meta'],
      stopNodes: ['*.pre', '*.script'],
      processEntities: true,
      htmlEntities: true,
    },
  });

  if (!feed) {
    throw new FeedNotFoundError(feedUrl);
  }

  consoleLogFeed(feed);
  consoleLog(`Retrieved RSS feed (${feedUrl})`);
  return feed;
}

export async function getNewPostsFromFeed(
  feedUrl: string,
  lastUpdated: number
): Promise<Post[]> {
  const feed = await getRssFeed(feedUrl);
  let posts: Post[] = [];

  // Iterate over entries
  consoleLog(`Retrieving new posts from RSS feed (${feedUrl})......`);
  feed?.entries?.forEach((entry) => {
    // Fetch the UTC entry published timestamp or default to 0
    const utc = entry?.published ? new Date(entry.published).getTime() : 0;
    // consoleLog(`entry:${entry.link} published:${utc} lastUpdated:${lastUpdated}`);

    // Only add the post to the batch if its after the last update
    if (utc > lastUpdated) {
      const post: Post = {
        publicationTitle: feed?.title ?? 'Unknown publication',
        postTitle: entry?.title ?? 'Missing title',
        postDescription: entry?.description,
        postLink: entry?.link ?? '',
      };
      posts = [...posts, post];
    }
  });

  consoleLog(`Retrieved new posts from RSS feed (${feedUrl})`);
  consoleLogPosts(posts);
  return posts;
}

export async function getAllNewPosts(
  feeds: string[] | null,
  lastUpdated: number
): Promise<Post[]> {
  let posts: Post[] = [];

  if (feeds) {
    consoleLog(`Retrieving new posts......`);
    // Iterate over feeds
    for (let i = 0; i < feeds.length; i++) {
      // Fetch new posts for each feed and add it to the list
      const feed = feeds[i];
      const newPosts = await getNewPostsFromFeed(feed, lastUpdated);
      posts = [...posts, ...newPosts];
    }
    consoleLogPosts(posts);
    consoleLog(`Retrieved new posts`);
  } else {
    consoleError('Feeds does not exist!');
  }

  return posts;
}
