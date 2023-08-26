import { io } from "socket.io-client";

const URL = "http://localhost:3000/chat";
const URLgame = "http://localhost:3000/game";
// const URLchat = "http://localhost:3000/chat";
const socket = io(URL, { autoConnect: false });
const socketGame = io(URLgame, { autoConnect: false });
// const socketChat = io(URLchat, { autoConnect: false });

// socketChat.onAny((event, ...args) => {
//   console.log(event, args);
// });

socketGame.onAny((event, ...args) => {
  if (event !== "move") {
  console.log(event, args);
  }
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

// export default socket;
export  { socketGame, socket };