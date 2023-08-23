export interface IPlayer {
  username: string;
  playerNo: number;
  score: number;
  //   x: number;
  //   y: number;
}

export interface IBall {
  x: number;
  y: number;
}

export interface IRoom {
  roomId: number;
  players: IPlayer[];
  ball: IBall;
  winner: string;
}
