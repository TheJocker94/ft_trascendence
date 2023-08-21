import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: false,
  },
  allowEIO3: true,
})
export class GameGateway {
  @WebSocketServer()
  server: Server;
  users = 0;
  private createdGameRooms: string[] = [];
  handleConnection(client: Socket) {
    console.log('Client game connected:', client.id);
    // Extract the username from the handshake data
    const username = client.handshake.auth.username;
    const message = `Welcome to the game, ${username}`;
    this.server.emit('welcome', message);
    // client.emit('welcome', message);
    // this.server.on('messageToServer', (data) => {
    //   console.log('Received data from client:');
    //   console.log('Message received is ', data);
    // });
    // console.log('User connected:', username);

    if (!username) {
      // Close the connection if no username is provided
      client.disconnect();
      console.log('Client game disconnectedddd');
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
  @SubscribeMessage('createGame')
  handleCreateGame(@ConnectedSocket() client: Socket): void {
    console.log('Create game received');

    // Search for an available room
    const availableRoom = this.createdGameRooms.find(
      (roomId) => this.server.sockets.adapter.rooms.get(roomId)?.size < 2,
    );

    if (availableRoom) {
      client.join(availableRoom);
      client.emit('gameCreated', { IdRoom: availableRoom });
      console.log('Client joined room:', availableRoom);
    } else {
      const gameId = (Math.random() + 1).toString(36).slice(2, 18);
      console.log(
        'Game created by client',
        client['username'],
        'Game id is ',
        gameId,
      );
      this.createdGameRooms.push(gameId);
      client.join(gameId);
      client.emit('gameCreated', { IdRoom: gameId });
      console.log('Client created and joined new room:', gameId);
    }
  }

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
  // @SubscribeMessage('getUsers')
  // handleGetUsers(@ConnectedSocket() client: Socket): void {
  //   const users = this.getConnectedUsers();
  //   client.emit('users', users);
  // }

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
