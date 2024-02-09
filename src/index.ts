import { Message } from './message';

export function print(msg: Message) {
  const m = msg.message;
  console.log(m);
}
