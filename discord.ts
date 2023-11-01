import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { Post } from './types.ts';
import { consoleLog } from './console.ts';

// export async function getDiscordClient(
//   env: Record<string, string>
// ): Promise<Bot> {
//   const discordToken = env['DISCORD_TOKEN'];

//   if (!discordToken) {
//     throw new MissingEnvironmentVariableError('DISCORD_TOKEN');
//   }

//   consoleLog('Creating discord bot...');
//   const rest = createRestManager({
//     token: discordToken,
//   });
//   rest.sendRequest();
//   const bot = createBot({
//     token: discordToken,
//     intents: Intents.GuildWebhooks | Intents.GuildMessages,
//     events: {
//       ready() {
//         consoleLog('Connected discord bot to gateway...');
//       },
//     },
//   });

//   await startBot(bot);
//   consoleLog('Created discord bot');

//   return bot;
// }

export function formatPostAsMessage(post: Post): string {
  let message = '';
  message += `### ${post.publicationTitle} | ${post.postTitle}\n`;
  message += `*${post.postDescription}*\n\n`;
  message += `${post.postLink}`;
  return message;
}

export async function postMessages(posts: Post[], env: Record<string, string>) {
  const webhookUrl = env['DISCORD_WEBHOOK_URL'];

  // Error if missing environment variables
  if (!webhookUrl) {
    throw new MissingEnvironmentVariableError('DISCORD_WEBHOOK_URL');
  }

  consoleLog('Posting messages to discord......');
  for (let i = 0; i < posts?.length; i++) {
    const post = posts[i];
    const message = formatPostAsMessage(post);
    await postMessage(webhookUrl, message);
  }
  console.log(
    `%c@ %cPosted %c${posts?.length ?? 0} %cmessages to discord`,
    'color: blue',
    'color: white',
    'color: yellow',
    'color: white'
  );
}

export async function postMessage(url: string, message: string) {
  await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message,
    }),
  });
}
