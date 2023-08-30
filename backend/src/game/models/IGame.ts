export interface IPlayer {
  username: string;
  playerNo: number;
  score: number;
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
}
