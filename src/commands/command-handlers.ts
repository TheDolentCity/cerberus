import {
  AddFeedCommand,
  RemoveFeedCommand,
  TestFeedCommand,
} from './commands.ts';
import { addFeed, getRedisClient, removeFeed } from '../services/redis.ts';

import { Commands } from '../types.ts';
import { consoleLog } from '../utilities/console.ts';
import { getNewPostsFromFeed } from '../services/feeds.ts';
import { getRssFeed } from '../services/feeds.ts';
import { postDiscordMessages } from '../services/discord.ts';

export async function addFeedCommandHandler(command: AddFeedCommand) {
  // Check that feed exists
  await getRssFeed(command.feedUrl);

  const redis = await getRedisClient();
  await addFeed(redis, command.feedUrl);
}

export async function removeFeedCommandHandler(command: RemoveFeedCommand) {
  const redis = await getRedisClient();
  await removeFeed(redis, command.feedUrl);
}

export async function testFeedCommandHandler(command: TestFeedCommand) {
  consoleLog(`Processing '${Commands.TEST_FEED}' command`);
  consoleLog(`feed:${command.feedUrl}`);
  consoleLog(`lastUpdated:${command.lastUpdated}`);
  const date = new Date(0);
  date.setUTCMilliseconds(command.lastUpdated);
  consoleLog(`lastUpdatedDate:${date}`);

  const posts = await getNewPostsFromFeed(command.feedUrl, command.lastUpdated);
  // await postDiscordMessages(posts);
}
