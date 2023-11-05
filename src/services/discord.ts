import { Environment } from '../utilities/environment.ts';
import { MissingEnvironmentVariableError } from '../errors/missing-environment-variable-error.ts';
import { Post } from '../types.ts';
import { consoleLog } from '../utilities/console.ts';

export function formatPostAsDiscordMessage(post: Post): string {
  let message = '';
  message += `### ${post.publicationTitle} | ${post.postTitle}\n`;
  message += `*${post.postDescription}*\n\n`;
  message += `${post.postLink}`;
  return message;
}

export async function postDiscordMessages(posts: Post[]) {
  const environment = await Environment.getInstance();
  const webhookUrl = environment.get('DISCORD_WEBHOOK_URL');

  // Error if missing environment variables
  if (!webhookUrl) {
    throw new MissingEnvironmentVariableError('DISCORD_WEBHOOK_URL');
  }

  consoleLog('Posting messages to discord......');
  for (let i = 0; i < posts?.length; i++) {
    const post = posts[i];
    const message = formatPostAsDiscordMessage(post);
    await postDiscordMessage(webhookUrl, message);
  }
  console.log(
    `%c? %cPosted %c${posts?.length ?? 0} %cmessages to discord`,
    'color: blue',
    'color: default',
    'color: yellow',
    'color: default'
  );
}

export async function postDiscordMessage(url: string, message: string) {
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
