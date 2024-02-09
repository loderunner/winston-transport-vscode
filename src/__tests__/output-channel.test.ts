import { mock, mockReset } from 'jest-mock-extended';
import { LEVEL, MESSAGE } from 'triple-beam';
import { createLogger, format } from 'winston';

import { OutputChannelTransport } from '../output-channel';

import type { OutputChannel } from 'vscode';

const mockOutputChannel = mock<OutputChannel>();

describe('OutputChannelTransport', () => {
  afterEach(() => {
    mockReset(mockOutputChannel);
  });
  it('should create an OutputChannelTransport', () => {
    // Create a new transport and expect it not to throw
    new OutputChannelTransport({
      outputChannel: mockOutputChannel,
    });
    expect.assertions(0);
  });

  it('should append line to output channel', () => {
    const transport = new OutputChannelTransport({
      outputChannel: mockOutputChannel,
    });
    const next = jest.fn();

    transport.log(
      {
        level: 'info',
        message: 'Hello World!',
        [LEVEL]: 'info',
        [MESSAGE]: 'Hello World!',
      },
      next,
    );

    expect(mockOutputChannel.appendLine).toHaveBeenCalledWith('Hello World!');
    expect(next).toHaveBeenCalled();
  });

  it('should integrate in a winston logger', () => {
    const logger = createLogger({
      format: format.combine(format.timestamp(), format.simple()),
      transports: [
        new OutputChannelTransport({
          outputChannel: mockOutputChannel,
          level: 'error',
        }),
      ],
    });

    logger.info('Hello World!');
    logger.error('Oh no!');

    expect(mockOutputChannel.appendLine).toHaveBeenCalledTimes(1);
    expect(mockOutputChannel.appendLine).toHaveBeenLastCalledWith(
      expect.stringContaining('Oh no!'),
    );
  });
});
