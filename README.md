# winston-transport-vscode

A VS Code extension transport for [Winston](https://github.com/winstonjs/winston) logger

[![loderunner](https://circleci.com/gh/loderunner/winston-transport-vscode.svg?style=shield)](https://app.circleci.com/pipelines/github/loderunner/winston-transport-vscode?branch=main)

---

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Transports](#transports)
  - [OutputChannelTransport](#outputchanneltransport)
  - [LogOutputChannelTransport](#logoutputchanneltransport)
- [Levels](#levels)
- [Format](#format)
  - [Usage](#usage)

---

## Installation

```shell
npm install winston-transport-vscode
```

## Getting Started

To use Winston logger in your VS Code extension, create an output channel for
your extension, using the
[VS Code API](https://code.visualstudio.com/api/references/vscode-api#window.createOutputChannel),
create a Transport, giving it the output channel, and use that transport in your
winston logger instance.

```js
// 1. Require (or import)
const vscode = require('vscode');
const winston = require('winston');
const { LogOutputChannelTransport } = require('winston-transport-vscode');

// 2. Create a Log Output Channel for your extension with the VS Code API
const outputChannel = vscode.window.createOutputChannel('My extension', {
  log: true,
});

// 3. Create the Winston logger giving it the Log Output Channel
const logger = winston.createLogger({
  level: 'trace', // Recommended: set the highest possible level
  levels: LogOutputChannelTransport.config.levels, // Recommended: use predefined VS Code log levels
  format: LogOutputChannelTransport.format(), // Recommended: use predefined format
  transports: [new LogOutputChannelTransport({ outputChannel })],
});

logger.info('Hello World!');
```

## Transports

VS Code offers 2 types of output channels:

- [`OutputChannel`](https://code.visualstudio.com/api/references/vscode-api#OutputChannel) -
  a simple channel for plain text output
- [`LogOutputChannel`](https://code.visualstudio.com/api/references/vscode-api#LogOutputChannel) -
  an output channel dedicated to logging

### OutputChannelTransport

Send logs to an `OutputChannel` using the `OutputChannelTransport`

```js
const vscode = require('vscode');
const winston = require('winston');
const { OutputChannelTransport } = require('winston-transport-vscode');

const { combine, timestamp, prettyPrint } = winston.format;

const outputChannel = vscode.window.createOutputChannel('My extension');

const transport = new OutputChannelTransport({
  outputChannel,
  format: combine(timestamp(), simple()),
});

const logger = winston.createLogger({
  transports: [transport],
});

logger.info('Hello World!');
```

### LogOutputChannelTransport

Send logs to a `LogOutputChannel` using the `LogOutputChannelTransport`.

```js
const vscode = require('vscode');
const winston = require('winston');
const { LogOutputChannelTransport } = require('winston-transport-vscode');

const outputChannel = vscode.window.createOutputChannel('My extension', {
  log: true,
});

const logger = winston.createLogger({
  level: 'trace',
  levels: LogOutputChannelTransport.config.levels,
  format: LogOutputChannelTransport.format(),
  transports: [new LogOutputChannelTransport({ outputChannel })],
});

logger.info('Hello World!');
```

It is recommended to set the logger's level to the highest possible level
(`trace`), as VS Code's LogOutputChannel supports its own [log level filtering](https://code.visualstudio.com/updates/v1_73#_setting-log-level-per-output-channel).

## Levels

VS Code's `LogOutputChannel` supports a dedicated set of log levels that differs
from Winston's default configuration. To use VS Code log levels with Winston,
`winston-transport-vscode` provides a levels configuration.

The log levels are as follows:

- error - `0`
- warn - `1`
- info - `2`
- debug - `3`
- trace - `4`

Use `LogOutputChannelTransport.config.levels` when configuring your logger.

```js
const logger = winston.createLogger({
  level: 'trace',

  // winston-transport-vscode levels configuration
  levels: LogOutputChannelTransport.config.levels,

  format: LogOutputChannelTransport.format(),
  transports: [new LogOutputChannelTransport({ outputChannel })],
});
```

## Format

`winston-transport-vscode` provides a built-in formatter that easily integrates
with `LogOutputChannel`. `LogOutputChannelTransport.format` supports structured
logging for contextual value while outputting a more human-readable format than
JSON.

```js
const fmt = LogOutputChannelTransport.format();

fmt.transform({ level: 'info', message: 'Hello World!', extra: 'info' });
// {
//   level: 'info',
//   message: 'Hello World!',
//   extra: 'info',
//   [Symbol(level)]: 'info',
//   [Symbol(message)]: 'Hello World! extra="info"'
// }
```

### Usage

Use `LogOutputChannelTransport.format` when configuring your logger.

```js
const logger = winston.createLogger({
  level: 'trace',
  levels: LogOutputChannelTransport.config.levels,

  // winston-transport-vscode format
  format: LogOutputChannelTransport.format(),

  transports: [new LogOutputChannelTransport({ outputChannel })],
});
```
