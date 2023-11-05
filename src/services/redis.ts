import {
  consoleError,
  consoleLog,
  consoleNewLine,
  consoleSeparator,
} from '../utilities/console.ts';

import { Environment } from '../utilities/environment.ts';
import { MissingEnvironmentVariableError } from '../errors/missing-environment-variable-error.ts';
import { Redis } from 'npm:@upstash/redis@1.24.1';

function logFeeds(feeds: string[]) {
  consoleNewLine();
  consoleSeparator();
  if (feeds && feeds.length === 0) {
    consoleError('No feeds found!');
  } else {
    feeds?.forEach((feed) => {
      console.log(`%c@ %c${feed}`, 'color: yellow', 'color: default');
    });
  }
  consoleSeparator();
  consoleNewLine();
}

export async function getRedisClient(): Promise<Redis> {
  consoleLog('Connecting to Redis......');

  // Get Redis environment variables
  const environment = await Environment.getInstance();
  const redisUrl = environment.get('UPSTASH_REDIS_REST_URL');
  const redisToken = environment.get('UPSTASH_REDIS_REST_TOKEN');

  // Error if missing environment variables
  if (!redisUrl) {
    throw new MissingEnvironmentVariableError('UPSTASH_REDIS_REST_URL');
  }
  if (!redisToken) {
    throw new MissingEnvironmentVariableError('UPSTASH_REDIS_REST_TOKEN');
  }

  // Initialize Redis Connection
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  // Return Redis client
  consoleLog('Connected to Redis');
  return redis;
}

export async function getFeeds(redis: Redis): Promise<string[] | null> {
  consoleLog('Retrieving cached feeds......');
  const feeds = (await redis.smembers('feeds')) as string[] | null;
  console.log(
    `%c? %cRetrieved %c${feeds?.length ?? 0} %ccached feeds`,
    'color: blue',
    'color: default',
    'color: yellow',
    'color: default'
  );
  logFeeds(feeds ?? []);
  return feeds;
}

export async function addFeed(redis: Redis, feed: string) {
  consoleLog('Updating cached feeds......');
  await redis.sadd('feeds', feed);
  consoleLog('Updated cached feeds');
}

export async function removeFeed(redis: Redis, feed: string) {
  consoleLog('Removing cached feed......');
  await redis.srem('feeds', feed);
  consoleLog('Removed cached feed');
}

export async function getLastUpdated(redis: Redis): Promise<number | null> {
  consoleLog('Retrieving lastUpdated......');
  const lastUpdated: number | null = await redis.get('lastUpdated');
  consoleLog('Retrieved lastUpdated');
  if (lastUpdated) {
    console.log(
      `%c? %cLast updated at %c${new Date(lastUpdated)}`,
      'color: blue',
      'color: default',
      'color: yellow'
    );
  }
  return lastUpdated;
}

export async function updateLastUpdated(redis: Redis) {
  const now = Date.now();

  consoleLog('Updating lastUpdated......');
  await redis.set('lastUpdated', now);
  consoleLog('Updated lastUpdated');
}
