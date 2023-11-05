import 'https://deno.land/std@0.205.0/dotenv/load.ts';

import {
  getFeeds,
  getLastUpdated,
  getRedisClient,
  updateLastUpdated,
} from './src/services/redis.ts';

import { FeedNotFoundError } from './src/errors/feed-not-found-error.ts';
import { InvalidAuthorization } from './src/errors/invalid-authorization.ts';
import { MissingEnvironmentVariableError } from './src/errors/missing-environment-variable-error.ts';
import { consoleError } from './src/utilities/console.ts';
import { getAllNewPosts } from './src/services/feeds.ts';
import { postDiscordMessages } from './src/services/discord.ts';
import { validateFromQStash } from './src/services/qstash.ts';

async function sendRssPostsToDiscord() {
  // Fetch lastUpdated and cached feeds from redis
  const redis = await getRedisClient();
  const lastUpdated = (await getLastUpdated(redis)) ?? Date.now();
  const feeds = await getFeeds(redis);

  // Get all new posts
  const posts = await getAllNewPosts(feeds, lastUpdated);

  // Send posts to Discord
  await postDiscordMessages(posts);

  // Update last updated timestamp (uses Date.now())
  await updateLastUpdated(redis);
}

async function handler(request: Request): Promise<Response> {
  try {
    await validateFromQStash(request);
    await sendRssPostsToDiscord();

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof InvalidAuthorization) {
      consoleError(error.message);
      return new Response(null, { status: 401, statusText: error.message });
    } else if (error instanceof FeedNotFoundError) {
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

// A web server. The default runtime for the cerberus application.
Deno.serve(handler);
