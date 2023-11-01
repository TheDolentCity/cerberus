import { FeedData, extract } from 'npm:@extractus/feed-extractor';
import {
  consoleError,
  consoleLog,
  consoleNewLine,
  consoleSeparator,
} from './console.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { Post } from './types.ts';

function logPosts(posts: Array<Post>) {
  consoleNewLine();
  consoleSeparator();
  if (posts && posts.length === 0) {
    consoleError('No posts found!');
  } else {
    posts?.forEach((post) => {
      console.log(`%c@ %c${post?.postTitle}`, 'color: yellow', 'color: white');
    });
  }
  consoleSeparator();
  consoleNewLine();
}

export async function getRssFeed(feedUrl: string): Promise<FeedData> {
  consoleLog(`Retrieving RSS feed (${feedUrl})......`);
  const feed = await extract(feedUrl);

  if (!feed) {
    throw new FeedNotFoundError(feedUrl);
  }

  consoleLog(`Retrieved RSS feed (${feedUrl})`);
  return feed;
}

export async function getPosts(
  feedUrl: string,
  lastUpdated: number
): Promise<Array<Post>> {
  const feed = await getRssFeed(feedUrl);
  let posts: Array<Post> = [];

  // Iterate over entries
  feed?.entries?.forEach((entry) => {
    // Fetch the UTC entry published timestamp or default to 0
    const utc = entry?.published?.getTime() ?? 0;

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

  logPosts(posts);

  return posts;
}