import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import type { IRoom } from './models/IGame';
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
  private powerup = false;
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
        //   x: 770,
        //   y: 300,
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
            //   x: 30,
            //   y: 300,
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
      this.powerup = false;
    } else if (choice === 'powerup') {
      this.server.emit('choose', 'powerup');
      this.powerup = true;
    }
  }

  @SubscribeMessage('powerup')
  handlePowerup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    // random number between 1 and 3
    const random = Math.floor(Math.random() * 3) + 1;
    console.log('Random number is ', random);
    // if (data.roomId) {
    this.server.emit('powerupServer', { power: random, room: data.room });
    // }
  }

  //Me l'ha scritta copilot
  @SubscribeMessage('joinGame')
  handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Join game received is ', data);
    const room = this.Rooms.find((room) => room.roomId === data.roomId);
    if (room) {
      client.join(room.roomId.toString());
      client.emit('playerNo', { player: 2, room: room.roomId.toString() });

      // add player to room
      room.players.push({
        username: client['username'],
        playerNo: 2,
        score: 0,
        //   x: 770,
        //   y: 300,
      });
      this.server.to(room.roomId.toString()).emit('startingGame', room);
      // io.to(room.id).emit('startingGame');

      // setTimeout(() => {
      //     io.to(room.id).emit('startedGame', room);

      //     // start game
      //     startGame(room);
      // }, 3000);
    }
  }

  @SubscribeMessage('powerdoit')
  handlePowerdoit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Powerdoit received is ', data);
    // if (data.roomId) {
    this.server.emit('powerdoitServer', data);
    // }
  }

  @SubscribeMessage('movePlayer')
  handlemove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    // console.log('Move received is ', data);
    // if (data.roomId) {
    this.server.emit('move', data);
    // }
  }
  // ballUpdate
  @SubscribeMessage('ballUpdate')
  handleBallUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    // console.log('Ball update received is ', data);
    // if (data.roomId) {
    this.server.emit('ballUpdateServer', data);
    // }
  }

  @SubscribeMessage('powerballUpdate')
  handlePowerBallUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Ball update received is ', data);
    // if (data.roomId) {
    this.server.emit('powerballUpdateServer', data);
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

  @SubscribeMessage('updateScore')
  handleUpdateScore(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Update score received is ', data);
    // if (data.roomId) {
    // client.broadcast.emit('updateScoreServer', data);
    this.server.emit('updateScoreServer', data);
    // }
  }

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
}
