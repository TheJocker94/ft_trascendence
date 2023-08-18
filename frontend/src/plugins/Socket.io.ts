import { reactive } from "vue";
import { io, Socket } from "socket.io-client";

// Define the type for our state object
interface State {
  connected: boolean;
  fooEvents: any[]; // Replace 'any' with the specific type of your 'foo' event data
  barEvents: any[]; // Replace 'any' with the specific type of your 'bar' event data
}

export const state: State = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

const URL: string  = "http://localhost:3000/api";

// Initialize the socket with appropriate type
export const socket: Socket = io(URL, { autoConnect: false });


socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect", () => {
  state.connected = true;
  console.log("Connection:", state.connected);
  
});

socket.on("disconnect", () => {
  state.connected = false;
  console.log("Connection:", state.connected);

});

socket.on("foo", (...args: any[]) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args: any[]) => {
  state.barEvents.push(args);
});

socket.on("messageToClients", (message: string)=>{
  console.log(message)
  return message
})

export function sendMessage(message: string): void {
  socket.emit("sendMessage", message);
}