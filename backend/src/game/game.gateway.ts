import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import type { IRoom } from './models/IGame';
import { GameQueue } from './models/GameQueue';
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
  private queue: GameQueue = new GameQueue();
  private inGame: string[] = [];
  //interface room
  private Rooms: IRoom[] = [];
  private usersConnected: string[] = [];

  handleConnection(client: Socket) {
    console.log('Client game connected:', client.id);
    const parseId = this.queue.parseJwt(client.handshake.auth.token);
    const userId = parseId.id;
    client.data.userId = userId;
    if (!userId) {
      // Close the connection if no userId is provided
      client.disconnect();
      console.log('Client game disconnectedddd');
      return;
    }
    const message = `Welcome to the game, ${userId}`;
    client.emit('welcome', message);
    // Attach the userId to the socket for future use
    this.usersConnected.push(userId);
    console.log('User connected:', userId);
    console.log('Users in server are ', this.usersConnected);
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket): void {
    console.log('Join queue received');
    if (this.inGame.includes(client.data.userId)) {
      return;
    }
    this.queue.add(client);
    this.checkQueue();
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@ConnectedSocket() client: Socket): void {
    console.log('Leave queue received');
    this.queue.remove(client);
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
        username: client.data.userId,
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
            username: client.data.userId,
            playerNo: 1,
            score: 0,
          },
        ],
        winner: '',
      };
      this.Rooms.push(room);
      client.join(room.roomId.toString());
      client.emit('playerNo', { player: 1, room: room.roomId.toString() });
    }
    console.log('Room created is ', room);
  }
  // Chose standard or powerup mode
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

  // Chose random powerup
  @SubscribeMessage('powerup')
  handlePowerup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    // random number between 1 and 3
    const random = Math.floor(Math.random() * 3) + 1;
    console.log('Random number is ', random);
    this.server
      .to(data.room)
      .emit('powerupServer', { power: random, room: data.room });
  }

  //Me l'ha scritta copilot
  // Execute powerup
  @SubscribeMessage('powerdoit')
  handlePowerdoit(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Powerdoit received is ', data);
    this.server.to(data.room).emit('powerdoitServer', data);
  }
  // movePlayers
  @SubscribeMessage('movePlayer')
  handlemove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.server.to(data.room).emit('move', data);
  }
  // ballUpdate
  @SubscribeMessage('ballUpdate')
  handleBallUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    // console.log('Ball update received is ', data);
    // if (data.roomId) {
    this.server.to(data.room).emit('ballUpdateServer', data);
    // }
  }

  @SubscribeMessage('restart')
  handleRestart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Restart received is ', data);
    this.server.to(data.room).emit('restartServer', data.player);
  }

  @SubscribeMessage('powerballUpdate')
  handlePowerBallUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    // console.log('Ball update received is ', data);
    // if (data.roomId) {
    this.server.to(data.room).emit('powerballUpdateServer', data);
    // }
  }

  @SubscribeMessage('messageToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: any,
  ): void {
    console.log('Received data from client:');
    console.log(text.text);
    console.log('Username client :', client.data.userId);
    // this.server.emit('dataFromServer', data);
    this.server.emit('messageFromServer', {
      text: text.text,
      username: client.data.userId,
    });
  }

  @SubscribeMessage('updateScore')
  handleUpdateScore(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Update score received is ', data);
    if (data.score1 === 5)
      this.Rooms[parseInt(data.room)].winner =
        this.Rooms[parseInt(data.room)].players[0].username;
    else if (data.score2 === 5)
      this.Rooms[parseInt(data.room)].winner =
        this.Rooms[parseInt(data.room)].players[1].username;
    if (data.score1 === 5 || data.score2 === 5) {
      console.log('Room is ', this.Rooms[parseInt(data.room)]);
      console.log('Winner is ', this.Rooms[parseInt(data.room)].winner);
    }
    this.server.to(data.room).emit('updateScoreServer', data);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Leave room received is ', data);
    // client.leave(data);
    this.queue.remove(client);
    this.inGame = this.inGame.filter((user) => user !== client.data.userId);
    // this.server.to(data.room).emit('playerLeft', data);
    // this.Rooms = this.Rooms.filter((room) => room.roomId !== data.room);
  }
  @SubscribeMessage('exitGame')
  handleExitGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): void {
    console.log('Exit game received');
    this.server.to(data).emit('playerDisconnected', data);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // You can access the attached username if needed
    const username = client.data.userId;
    if (username) {
      console.log('User disconnected:', username);
    }
    this.queue.remove(client);
    if (this.inGame.includes(username)) {
      // quando un utente si disconnette, se è in una stanza, la stanza viene eliminata e si invia un messaggio a tutti i giocatori dentro la stanza
      // gli utenti nella stanza vengono rimossi dalla lista degli utenti queue e inGame
      // parti dall'ulyima stanza creata nel cercare gli utenti
      this.inGame = this.inGame.filter((user) => user !== username);

      const room = this.Rooms.reverse().find((room) =>
        room.players.find((player) => player.username === username),
      );
      if (room) {
        this.server
          .to(room.roomId.toString())
          .emit('playerDisconnected', room.roomId.toString());
        // this.Rooms = this.Rooms.filter((room) => room !== room);
      }
    }
    //   const room = this.Rooms.find((room) =>
    //     room.players.find((player) => player.username === username),
    //   );
    //   if (room) {
    //     this.server.to(room.roomId.toString()).emit('playerDisconnected');
    //     this.Rooms = this.Rooms.filter((room) => room !== room);
    //   }
    // }
    this.usersConnected = this.usersConnected.filter(
      (user) => user !== username,
    );
    console.log('Users connected are ', this.usersConnected);
  }

  // Utility function to start the game

  private async checkQueue() {
    let playersSockets: Socket[];
    if (this.queue.size() < 2) return;
    else {
      playersSockets = this.queue.pop2();
      this.inGame.push(playersSockets[0].data.userId);
      this.inGame.push(playersSockets[1].data.userId);
      const gameId = await this.createGame([
        playersSockets[0].data.userId,
        playersSockets[1].data.userId,
      ]);
      playersSockets[0].emit('playerNo', { player: 1, room: gameId });
      playersSockets[1].emit('playerNo', { player: 2, room: gameId });
      playersSockets[0].join(gameId);
      playersSockets[1].join(gameId);
      this.server.to(gameId).emit('startingGame', this.Rooms[parseInt(gameId)]);
      // playersSockets[0].emit('matchFound', gameId);
      // playersSockets[1].emit('matchFound', gameId);
    }
  }

  private async createGame(userIds: string[]) {
    const room: IRoom = {
      roomId: this.Rooms.length,
      players: [
        {
          username: userIds[0],
          playerNo: 1,
          score: 0,
        },
        {
          username: userIds[1],
          playerNo: 2,
          score: 0,
        },
      ],
      winner: '',
    };
    this.Rooms.push(room);
    return room.roomId.toString();
  }
}
