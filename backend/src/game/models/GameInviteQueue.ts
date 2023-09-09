import { Socket } from 'socket.io';

export class GameInviteQueue {
  private queue: Array<Socket>;

  constructor() {
    this.queue = [];
  }

  public add(socket: Socket): void {
    if (this.queue.includes(socket)) return;
    if (this.queue.includes(socket.data.id)) return;
    this.queue.push(socket);
  }

  public remove(socket: Socket): void {
    const index = this.queue.indexOf(socket);
    if (index > -1)
      this.queue.splice(index, 1);
  }

  public pop2(): Socket[] {
    return [this.queue.shift(), this.queue.shift()];
  }

  public size(): number {
    return this.queue.length;
  }

  public parseJwt(token: string) {
    try {
      if (!token)
        throw new Error('Token is missing');

      const tokenSegments = token.split('.');

			if (tokenSegments.length < 2)
        throw new Error('Invalid token format');

      return JSON.parse(Buffer.from(tokenSegments[1], 'base64').toString());
    } catch (error) {
      console.error('Error parsing JWT:', error.message);
      return null; // or return an appropriate value indicating failure
    }
  }
}
