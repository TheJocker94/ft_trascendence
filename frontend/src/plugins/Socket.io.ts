import { io } from "socket.io-client";

const URL = "/chat";
const URLgame = "/game";
// const URLnotification = "/notification";
// const URLchat = "http://localhost:3000/chat";
const socket = io(URL, { autoConnect: false });
const socketGame = io(URLgame, { autoConnect: false });
// const socketNoti = io(URL, { autoConnect: false });
// const socketChat = io(URLchat, { autoConnect: false });

// socketChat.onAny((event, ...args) => {
//   console.log(event, args);
// });

socketGame.onAny((event, ...args) => {
  if (event !== "move") {
//   console.log(event, args);
  }
});

socket.onAny((event, ...args) => {
  if (event !== "groupListServer") {
//   console.log(event, args);
  }
});

// socketNoti.onAny((event, ...args) => {
// 	  console.log(event, args);
// });

// export default socket;
export  { socketGame, socket/*, socketNoti*/};
