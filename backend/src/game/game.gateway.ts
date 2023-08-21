import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import type { IRoom, IBall, IPlayer } from './models/IGame';
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
  //interface room
  private Rooms: IRoom[] = [];
  private usersConnected: string[] = [];
  handleConnection(client: Socket) {
    console.log('Client game connected:', client.id);
    // Extract the username from the handshake data
    const username = client.handshake.auth.username;
    const message = `Welcome to the game, ${username}`;
    client.emit('welcome', message);
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
    this.usersConnected.push(username);
    console.log('User connected:', username);
    console.log('Users in server are ', this.usersConnected);
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
    let room: IRoom;
    if (
      this.Rooms.length > 0 &&
      this.Rooms[this.Rooms.length - 1].players.length === 1
    ) {
      room = this.Rooms[this.Rooms.length - 1];
    }
    if (room) {
      client.join(room.roomId.toString());
      client.emit('playerNo', { player: 2, room: room.roomId.toString() });

      // add player to room
      room.players.push({
        username: client['username'],
        playerNo: 2,
        score: 0,
      });
      this.server.to(room.roomId.toString()).emit('startingGame', room);
      // io.to(room.id).emit('startingGame');

      // setTimeout(() => {
      //     io.to(room.id).emit('startedGame', room);

      //     // start game
      //     startGame(room);
      // }, 3000);
    } else {
      room = {
        roomId: this.Rooms.length + 1,
        players: [
          {
            username: client['username'],
            playerNo: 1,
            score: 0,
          },
        ],
        ball: {
          x: 395,
          y: 245,
        },
        winner: '',
      };
      this.Rooms.push(room);
      client.join(room.roomId.toString());
      client.emit('playerNo', { player: 1, room: room.roomId.toString() });
    }
    console.log('Room created is ', room);
  }

  @SubscribeMessage('choice')
  handleChoice(
    @ConnectedSocket() client: Socket,
    @MessageBody() choice: string,
  ): void {
    if (choice === 'standard') {
      this.server.emit('choose', 'standard');
    } else if (choice === 'powerup') {
      this.server.emit('choose', 'powerup');
    }
  }
  @SubscribeMessage('movePlayer')
  handlemove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Move received is ', data);
    // if (data.roomId) {
    this.server.emit('move', data);
    // }
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
    this.usersConnected = this.usersConnected.filter(
      (user) => user !== username,
    );
    console.log('Users connected are ', this.usersConnected);
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
