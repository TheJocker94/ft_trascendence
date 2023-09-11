export interface IPlayer {
  userId: string;
  username: string;
  playerNo: number;
  //   minimized default false
  minimized: boolean;
}

export interface IBall {
  x: number;
  y: number;
}

export interface IRoom {
  roomId: number;
  players: IPlayer[];
  winner: string;
  finished: boolean;
  inviteId?: string;
}
