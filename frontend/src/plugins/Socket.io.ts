import { io } from "socket.io-client";

const URL = "/chat";
const URLgame = "/game";

const socket = io(URL, { autoConnect: false });
const socketGame = io(URLgame, { autoConnect: false });

socketGame.onAny((event, ...args) => {
  if (event !== "move") {
  }
});

socket.onAny((event, ...args) => {
  if (event !== "groupListServer") {
  }
});

export  { socketGame, socket };
