import { InvalidAuthorization } from './errors/invalid-authorization.ts';
import { MissingEnvironmentVariableError } from './errors/missing-environment-variable-error.ts';
import { Receiver } from 'npm:@upstash/qstash@2.1.9';
import { consoleLog } from './console.ts';

export async function validateFromQStash(request: Request) {
  consoleLog('Validating from QStash......');

  // Get Redis environment variables
  const currentSigningKey = Deno.env.get('QSTASH_CURRENT_SIGNING_KEY');
  const nextSigningKey = Deno.env.get('QSTASH_NEXT_SIGNING_KEY');

  // Error if missing environment variables
  if (!currentSigningKey) {
    throw new MissingEnvironmentVariableError('QSTASH_CURRENT_SIGNING_KEY');
  }
  if (!nextSigningKey) {
    throw new MissingEnvironmentVariableError('QSTASH_NEXT_SIGNING_KEY');
  }

  const receiver = new Receiver({
    currentSigningKey: currentSigningKey,
    nextSigningKey: nextSigningKey,
  });

  const body = await request.text();
  const signature = request.headers.get('Upstash-Signature')!;

  const valid = await receiver
    .verify({
      signature,
      body,
    })
    .catch((err: Error) => {
      console.error(err);
      return false;
    });

  if (!valid) {
    throw new InvalidAuthorization();
  }

  consoleLog('Validated from QStash');
}
