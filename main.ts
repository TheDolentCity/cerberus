import {
  getFeeds,
  getLastUpdated,
  getRedisClient,
  updateLastUpdated,
} from './redis.ts';

import { FeedNotFoundError } from './errors/feed-not-found-error.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { consoleError } from './console.ts';
import { getAllNewPosts } from './feed.ts';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';
import { postMessages } from './discord.ts';

async function sendRssPostsToDiscord() {
  // Fetch cached feeds and lastUpdated from redis
  const env = await load();
  const redis = getRedisClient(env);
  const feeds = await getFeeds(redis);
  const lastUpdated = (await getLastUpdated(redis)) ?? Date.now();

  // Get all new posts
  const posts = await getAllNewPosts(feeds, lastUpdated);

  // Send posts to Discord
  await postMessages(posts, env);

  // Update last updated timestamp (uses Date.now())
  await updateLastUpdated(redis);
}

async function handler(_req: Request): Promise<Response> {
  try {
    await sendRssPostsToDiscord();
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof FeedNotFoundError) {
      consoleError(error.message);
      return new Response(null, { status: 500, statusText: error.message });
    } else if (error instanceof MissingEnvironmentVariableError) {
      consoleError(error.message);
      return new Response(null, { status: 500, statusText: error.message });
    } else {
      consoleError(error.message);
      return new Response(null, { status: 500, statusText: error.message });
    }
  }
}

Deno.serve(handler);
