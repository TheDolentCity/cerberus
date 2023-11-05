import { AddFeedCommand, RemoveFeedCommand, TestFeedCommand } from './commands.ts';

import { Flags } from '../types.ts';
import { MissingFieldError } from '../errors/missing-field-error.ts';

export function addFeedCommandValidator(flags: Flags): AddFeedCommand {
  if (!flags?.feed) {
    throw new MissingFieldError('feed');
  }

  return {
    feedUrl: flags?.feed,
  };
}

export function removeFeedCommandValidator(flags: Flags): RemoveFeedCommand {
  if (!flags?.feed) {
    throw new MissingFieldError('feed');
  }

  return {
    feedUrl: flags?.feed,
  };
}

export function testFeedCommandValidator(flags: Flags): TestFeedCommand {
  if (!flags?.feed) {
    throw new MissingFieldError('feed');
  } else if (!flags?.lastUpdated) {
    throw new MissingFieldError('lastUpdated');
  }

  return {
    feedUrl: flags?.feed,
    lastUpdated: flags?.lastUpdated,
  };
}
