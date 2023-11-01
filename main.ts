import {
  getFeeds,
  getLastUpdated,
  getRedisClient,
  updateLastUpdated,
} from './redis.ts';

import { getAllPosts } from './feed.ts';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';
import { postMessages } from './discord.ts';

// Fetch cached feeds and lastUpdated from redis
const env = await load();
const redis = getRedisClient(env);
const feeds = await getFeeds(redis);
const lastUpdated = (await getLastUpdated(redis)) ?? Date.now();

// Get all new posts
const posts = await getAllPosts(feeds, lastUpdated);

// Send posts to Discord
await postMessages(posts, env);

// Update last updated timestamp (uses Date.now())
await updateLastUpdated(redis);
