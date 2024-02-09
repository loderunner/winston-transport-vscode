import { MESSAGE } from 'triple-beam';
import Transport, { TransportStreamOptions } from 'winston-transport';

import type { TransformableInfo } from 'logform';
import type { OutputChannel } from 'vscode';

type Options = TransportStreamOptions & {
  outputChannel: OutputChannel;
};
export class OutputChannelTransport extends Transport {
  private outputChannel: OutputChannel;

  constructor(opts: Options) {
    super(opts);
    this.outputChannel = opts.outputChannel;
  }

  public log(info: TransformableInfo, next: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this.outputChannel.appendLine(info[MESSAGE]);

    next();
  }
}
