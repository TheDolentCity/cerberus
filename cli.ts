import { Commands, Flags } from './src/types.ts';
import {
  addFeedCommandHandler,
  removeFeedCommandHandler,
  testFeedCommandHandler,
} from './src/commands/command-handlers.ts';
import {
  addFeedCommandValidator,
  removeFeedCommandValidator,
  testFeedCommandValidator,
} from './src/commands/command-validators.ts';
import {
  consoleError,
  consoleHeader,
  consoleSeparator,
} from './src/utilities/console.ts';

import { FeedNotFoundError } from './src/errors/feed-not-found-error.ts';
import { MissingEnvironmentVariableError } from './src/errors/missing-environment-variable-error.ts';
import { MissingFieldError } from './src/errors/missing-field-error.ts';
import { parse } from 'https://deno.land/std@0.202.0/flags/mod.ts';

function getCommand() {
  return Deno.args[0];
}

function getFlags(): Flags {
  return parse(Deno.args, {
    string: ['feed', 'lastUpdated'],
  }) as Flags;
}

async function process() {
  consoleHeader('Welcome to Cerberus CLI');
  consoleSeparator();

  // Parse CLI command and flags
  const command = getCommand();
  const flags = getFlags();

  // Process command
  switch (command) {
    case Commands.ADD_FEED:
      {
        const command = addFeedCommandValidator(flags);
        await addFeedCommandHandler(command);
      }
      break;
    case Commands.REMOVE_FEED:
      {
        const command = removeFeedCommandValidator(flags);
        await removeFeedCommandHandler(command);
      }
      break;
    case Commands.TEST_FEED:
      {
        const command = testFeedCommandValidator(flags);
        await testFeedCommandHandler(command);
      }
      break;
    default:
      console.error(`Unknown command '${command}'`);
      break;
  }

  consoleSeparator();
}

async function cli() {
  try {
    await process();
  } catch (error) {
    if (error instanceof FeedNotFoundError) {
      consoleError(error.message);
    } else if (error instanceof MissingEnvironmentVariableError) {
      consoleError(error.message);
    } else if (error instanceof MissingFieldError) {
      consoleError(error.message);
    } else {
      consoleError(error.message);
    }
  }
}

// A CLI. A tool to manage the cerberus application.
cli();
