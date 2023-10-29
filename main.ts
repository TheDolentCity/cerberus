import { Redis } from 'https://deno.land/x/upstash_redis@v1.14.0/mod.ts';
import { parseFeed } from 'https://deno.land/x/rss/mod.ts';
import { serve } from 'https://deno.land/std@0.204.0/http/server.ts';
import { startBot } from 'https://deno.land/x/discordeno/mod.ts';

interface CachedFeed {
  url: string;
  lastUpdatedUTC: number;
}

// Fetch feeds from Deno KV
// Iterate over feeds

// Fetch latest RSS feed
// Deserialize RSS feed
// Compare latest RSS feed item to latest stored
// Store feed update

// If there are any feed updates, initialize Discord bot and webhook
// Iterate over feed updates
// Send message with webhook

// Merge feed update into feeds object
// Deno KV

serve(async (_req: Request) => {
  // Initialize Redis Connection
  console.log(`Connecting to REDIS...`);
  const redisURL = Deno.env.get('UPSTASH_REDIS_REST_URL');
  const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');
  const redis = new Redis({
    url: redisURL,
    token: redisToken,
  });
  console.log(`Connection established.`);

  // Fetch the latest feeds
  console.log(`Fetching cached feeds...`);
  const cachedFeeds: CachedFeed[] | null | undefined = await redis.get('feeds');
  console.log(`${cachedFeeds?.length ?? 0} cached feeds retrieved.`);

  // Fetch each RSS feed and deserialize it
  cachedFeeds?.forEach(async (cachedFeed) => {
    console.log('Retrieving RSS feed...');
    const rss = await fetch(cachedFeed?.url);
    const xml = await rss?.text();
    console.log('Retrieved RSS feed.');
    console.log('Parsing RSS feed...');
    const feed = await parseFeed(xml);
    console.log('Parsed RSS feed.');
    console.log('==========================================================');
    console.log(feed);
    console.log('==========================================================');

    // Compare latest feed item timestamp to cachedFeed
    // const latestItem = feed?.items?.forEach(item => {
    //   console.log(item);
    // });
    // const latestUTC = feed?.entries?.;
  });

  console.log(`Exiting function...`);
  return new Response(null, { status: 204 });
});
