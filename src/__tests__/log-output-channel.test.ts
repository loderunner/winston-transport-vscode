import { mock, mockReset } from 'jest-mock-extended';
import { LEVEL, MESSAGE } from 'triple-beam';
import { createLogger, format } from 'winston';

import { LogOutputChannelTransport } from '../log-output-channel';

import type { LogOutputChannel } from 'vscode';

const mockOutputChannel = mock<LogOutputChannel>();

describe('LogOutputChannelTransport', () => {
  afterEach(() => {
    mockReset(mockOutputChannel);
  });

  it('should create an OutputChannelTransport', () => {
    // Create a new transport and expect it not to throw
    new LogOutputChannelTransport({
      outputChannel: mockOutputChannel,
    });
    expect.assertions(0);
  });

  it('should log to channel with level', () => {
    const transport = new LogOutputChannelTransport({
      outputChannel: mockOutputChannel,
    });

    const cases = [
      { level: 'error', fn: mockOutputChannel.error },
      { level: 'warn', fn: mockOutputChannel.warn },
      { level: 'info', fn: mockOutputChannel.info },
      { level: 'debug', fn: mockOutputChannel.debug },
      { level: 'trace', fn: mockOutputChannel.trace },
    ];

    for (const { level, fn } of cases) {
      const next = jest.fn();

      transport.log(
        {
          level,
          message: 'Hello World!',
          [LEVEL]: level,
          [MESSAGE]: `${level} Hello World!`,
        },
        next,
      );

      expect(fn).toHaveBeenCalledWith(`${level} Hello World!`);
      expect(next).toHaveBeenCalled();
    }
  });

  it('should integrate in a winston logger', () => {
    const logger = createLogger({
      levels: LogOutputChannelTransport.config.levels,
      format: format.combine(format.timestamp(), format.simple()),
      transports: [
        new LogOutputChannelTransport({
          outputChannel: mockOutputChannel,
          level: 'error',
        }),
      ],
    });

    logger.info('Hello World!');
    logger.error('Oh no!');

    expect(mockOutputChannel.info).not.toHaveBeenCalled();
    expect(mockOutputChannel.error).toHaveBeenCalledTimes(1);
    expect(mockOutputChannel.error).toHaveBeenLastCalledWith(
      expect.stringContaining('Oh no!'),
    );
  });

  describe('format', () => {
    it('should format the message without values', () => {
      const info = LogOutputChannelTransport.format().transform({
        level: 'info',
        message: 'Hello World!',
      });

      expect(info).toEqual({
        level: 'info',
        message: 'Hello World!',
        [LEVEL]: 'info',
        [MESSAGE]: 'Hello World!',
      });
    });

    it('should format the message with a single value', () => {
      const info = LogOutputChannelTransport.format().transform({
        level: 'info',
        message: 'Hello World!',
        hello: 'world',
      });

      expect(info).toEqual({
        level: 'info',
        message: 'Hello World!',
        hello: 'world',
        [LEVEL]: 'info',
        [MESSAGE]: 'Hello World! hello="world"',
      });
    });

    it('should format the message with multiple values', () => {
      const info = LogOutputChannelTransport.format().transform({
        level: 'info',
        message: 'Hello World!',
        hello: 'world',
        barbes: 'rochechouart',
        yes: true,
        notDefined: undefined,
        nil: null,
        thx: 1138,
      });

      const message = info[MESSAGE];
      expect(message).toMatch(/^Hello World! /);
      expect(message).toMatch(/ hello="world"/);
      expect(message).toMatch(/ barbes="rochechouart"/);
      expect(message).toMatch(/ yes=true/);
      expect(message).toMatch(/ notDefined=undefined/);
      expect(message).toMatch(/ nil=null/);
      expect(message).toMatch(/ thx=1138/);
    });

    it('should format the message with nested values', () => {
      const info = LogOutputChannelTransport.format().transform({
        level: 'info',
        message: 'Hello World!',
        nested: {
          values: {
            should: 'work',
          },
          really: 'yeah',
        },
        this: { is: 'incredible' },
      });

      const message = info[MESSAGE];
      expect(message).toMatch(/^Hello World! /);
      expect(message).toMatch(/ nested.values.should="work"/);
      expect(message).toMatch(/ nested.really="yeah"/);
      expect(message).toMatch(/ this.is="incredible"/);
    });
  });
});
