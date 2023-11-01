export function consoleNewLine() {
  console.log('');
}

export function consoleSeparator() {
  console.log(
    '%c################################################################################',
    'background-color: blue'
  );
}

export function consoleHeader(log: string) {
  console.log(`%c${log}`, 'background-color: blue');
}

export function consoleLog(log: string) {
  console.log(`%c? %c${log}`, 'color: blue', 'color: white');
}

export function consoleError(error: string) {
  console.log('');
  console.log(
    '%c################################################################################',
    'background-color: red'
  );
  console.error(`%cERROR:${error}`, 'background-color: red');
  console.log(
    '%c################################################################################',
    'background-color: red'
  );
  console.log('');
}
