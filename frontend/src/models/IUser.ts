export interface IUser {
  Losses : number;
  Played : number;
  Wins   : number;
  blockedById : string[];
  email : string;
  friendsId : string[];
  id : string;
  isOnline : boolean;
  isPlaying : boolean;
  profilePicture : string;
  username : string;
  winrate : number;
}

export interface IMiniUser {
  id : string;
  isOnline : boolean;
  isPlaying : boolean;
  profilePicture : string;
  username : string;
}

export interface IMatchHistory {
  mode: string;
  score: string;
  winnerUsername: string;
  user1Id: IMiniUser;
  user2Id: IMiniUser;
}