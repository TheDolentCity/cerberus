import { FeedData, extract } from 'npm:@extractus/feed-extractor';
import {
  consoleError,
  consoleLog,
  consoleNewLine,
  consoleSeparator,
} from './console.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { Post } from './types.ts';

function logPosts(posts: Post[]) {
  consoleNewLine();
  consoleSeparator();
  if (posts && posts.length === 0) {
    consoleLog('No posts found');
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

export async function getNewPostsFromFeed(
  feedUrl: string,
  lastUpdated: number
): Promise<Post[]> {
  const feed = await getRssFeed(feedUrl);
  let posts: Post[] = [];

  // Iterate over entries
  feed?.entries?.forEach((entry) => {
    // Fetch the UTC entry published timestamp or default to 0
    const utc = new Date(entry?.published ?? 0).getTime();

    // Only add the post to the batch if its after the last update
    if (utc < lastUpdated) {
      const post: Post = {
        publicationTitle: feed?.title ?? 'Unknown publication',
        postTitle: entry?.title ?? 'Missing title',
        postDescription: entry?.description,
        postLink: entry?.link ?? '',
      };
      posts = [...posts, post];
    }
  });

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
    logPosts(posts);
    consoleLog(`Retrieved new posts`);
  } else {
    consoleError('Feeds does not exist!');
  }

  return posts;
}
