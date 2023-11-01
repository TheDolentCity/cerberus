import {
  getFeeds,
  getLastUpdated,
  getRedisClient,
  updateLastUpdated,
} from './redis.ts';

import { Post } from './types.ts';
import { Redis } from 'https://deno.land/x/upstash_redis@v1.14.0/mod.ts';
import { extract } from 'npm:@extractus/feed-extractor';
import { getPosts } from './feed.ts';
import { parseFeed } from 'https://deno.land/x/rss/mod.ts';
import { serve } from 'https://deno.land/std@0.204.0/http/server.ts';

// Fetch last update and cached feeds from redis
const redis = await getRedisClient();
const feeds = await getFeeds(redis);
const lastUpdated = (await getLastUpdated(redis)) ?? Date.now();

// Get all new posts
let posts: Array<Post>;
feeds?.forEach(async (feed) => {
  const newPosts = await getPosts(feed, lastUpdated);
  posts = [...posts, ...newPosts];
});

// SEND POSTS TO DISCORD

// Update last updated timestamp (uses Date.now())
await updateLastUpdated(redis);
