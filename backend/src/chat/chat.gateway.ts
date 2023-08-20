import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: false,
  },
  allowEIO3: true,
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  users = 0;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    // Extract the username from the handshake data
    const username = client.handshake.auth.username;
    const message = `Welcome to the chat, ${username}`;
    this.server.emit('welcome', message);
    // this.server.on('messageToServer', (data) => {
    //   console.log('Received data from client:');
    //   console.log('Message received is ', data);
    // });
    // console.log('User connected:', username);

    if (!username) {
      // Close the connection if no username is provided
      client.disconnect();
      console.log('Client disconnectedddd');
      return;
    }

    // Attach the username to the socket for future use
    client['username'] = username;

    console.log('User connected:', username);
  }
  // Create a method to get a list of connected users
  getConnectedUsers(): { userID: string; username: string }[] {
    const users = [];
    for (const [id, socket] of this.server.sockets.sockets) {
      if (socket['username']) {
        users.push({
          userID: id,
          username: socket['username'],
        });
      }
    }
    console.log('Users are :', users);
    return users;
  }

  // @SubscribeMessage('dataToServer')
  // handleWelcome(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: any,
  // ): void {
  //   console.log('Received data from client:');
  //   console.log(data);
  //   // this.server.emit('dataFromServer', data);
  //   client.emit('dataFromServer', data);
  // }

  @SubscribeMessage('messageToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: any,
  ): void {
    console.log('Received data from client:');
    console.log(text.text);
    console.log('Username client :', client['username']);
    // this.server.emit('dataFromServer', data);
    this.server.emit('messageFromServer', {
      text: text.text,
      username: client['username'],
    });
  }
  // Create a message handler to emit the list of users to the client
  @SubscribeMessage('getUsers')
  handleGetUsers(@ConnectedSocket() client: Socket): void {
    const users = this.getConnectedUsers();
    client.emit('users', users);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // You can access the attached username if needed
    const username = client['username'];
    if (username) {
      console.log('User disconnected:', username);
    }
  }
  // @SubscribeMessage('sendMessage')
  // handleMessage(client: Socket, payload: string): void {
  //   console.log('Received message:', payload);
  //   this.server.emit('receiveMessage', payload);
  // }
  // @SubscribeMessage('sendMessage')
  // handleMessage(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: string,
  // ): void {
  //   console.log('Received message:', payload);
  //   // Emit the payload to all connected clients
  //   this.server.emit('receiveMessage', payload);
  // }
}
