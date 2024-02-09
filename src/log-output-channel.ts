import { format } from 'logform';
import { Config, LEVEL, MESSAGE } from 'triple-beam';
import Transport, { TransportStreamOptions } from 'winston-transport';

import type { TransformableInfo } from 'logform';
import type { LogOutputChannel } from 'vscode';

export class LogOutputChannelTransport extends Transport {
  private outputChannel: LogOutputChannel;

  constructor(opts: LogOutputChannelTransport.Options) {
    super(opts);
    this.outputChannel = opts.outputChannel;
  }

  public log(info: TransformableInfo, next: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    switch (info[LEVEL]) {
      case 'error':
        this.outputChannel.error(info[MESSAGE]);
        break;
      case 'warning':
      case 'warn':
        this.outputChannel.warn(info[MESSAGE]);
        break;
      case 'info':
        this.outputChannel.info(info[MESSAGE]);
        break;
      case 'debug':
        this.outputChannel.debug(info[MESSAGE]);
        break;
      case 'trace':
        this.outputChannel.trace(info[MESSAGE]);
        break;
      default:
        this.outputChannel.appendLine(info[MESSAGE]);
        break;
    }

    next();
  }
}

const formatFunc = format((info: TransformableInfo): TransformableInfo => {
  const { level, message, ...rest } = info;

  const restPairs = Object.entries(rest)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(' ');

  let msg = info[MESSAGE] ?? message;
  if (restPairs.length > 0) {
    msg += ` ${restPairs}`;
  }

  return {
    ...info,
    [LEVEL]: info[LEVEL] ?? level,
    [MESSAGE]: msg,
  };
});

export namespace LogOutputChannelTransport {
  export type Options = TransportStreamOptions & {
    outputChannel: LogOutputChannel;
  };

  export const config: Config = {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4,
    },
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'blue',
      trace: 'grey',
    },
  };

  export const format = formatFunc;
}
