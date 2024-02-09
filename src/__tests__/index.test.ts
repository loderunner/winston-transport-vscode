import { print } from '..';

describe('hello', () => {
  it('should log the message', () => {
    const spy = jest.spyOn(console, 'log');

    print({ message: 'hello' });

    expect(spy).toHaveBeenCalledWith('hello');
  });
});
