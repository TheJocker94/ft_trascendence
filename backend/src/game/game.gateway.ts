import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from './game.service';
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
@Injectable()
export class GameGateway {
  constructor(
    private prisma: PrismaService,
    private gameService: GameService,
  ) {}
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
  // player ready to play
  @SubscribeMessage('ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Ready received');
    this.server.to(data.room).emit('start', data.player);
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

  @SubscribeMessage('hitPaddle')
  handleHitPaddle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Hit paddle received is ', data);
    this.server.to(data.room).emit('hitPaddleServer', data);
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

  @SubscribeMessage('pause')
  handlePause(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Pause received is ', data);
    this.Rooms[parseInt(data.room)].players[data.player - 1].minimized = true;
    this.server.to(data.room).emit('pauseServer', data);
  }
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: any,): void {
  //   console.log('Pause received is ', data);
  //   this.Rooms[parseInt(data.room)].players[data.player - 1].minimized = true;
  //   this.server.to(data.room).emit('pauseServer', data);
  // }

  @SubscribeMessage('unpause')
  handleUnPause(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.Rooms[parseInt(data.room)].players[data.player - 1].minimized = false;
    console.log('Pause received is ', data);
    if (
      this.Rooms[parseInt(data.room)].players[0].minimized == false &&
      this.Rooms[parseInt(data.room)].players[1].minimized == false
    )
      this.server.to(data.room).emit('unpauseServer', data);
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
    this.Rooms[parseInt(data.room)].finished = false;
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
  async handleUpdateScore(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    if (data.score1 === 5 || data.score2 === 5) {
      this.Rooms[parseInt(data.room)].finished = true;
      let winner: string;
      let loser: string;
      if (data.score1 === 5) {
        winner = this.Rooms[parseInt(data.room)].players[1].username;
        loser = this.Rooms[parseInt(data.room)].players[0].username;
      } else if (data.score2 === 5) {
        winner = this.Rooms[parseInt(data.room)].players[0].username;
        loser = this.Rooms[parseInt(data.room)].players[1].username;
      }

      const matchplayed = await this.gameService.createHistory({
        user1Id: this.Rooms[parseInt(data.room)].players[0].username,
        user2Id: this.Rooms[parseInt(data.room)].players[1].username,
        winnerId: winner,
        score: data.score1 + '-' + data.score2,
        mode: 'CLASSIC',
      });
      await this.prisma.user.update({
        where: { id: winner },
        data: {
          Wins: { increment: 1 },
          Played: { increment: 1 },
          matchHistory: { push: matchplayed.id },
        },
      });
      await this.prisma.user.update({
        where: { id: loser },
        data: {
          Losses: { increment: 1 },
          Played: { increment: 1 },
          matchHistory: { push: matchplayed.id },
        },
      });

      const player1 = await this.prisma.user.findUnique({
        where: { id: this.Rooms[parseInt(data.room)].players[0].username },
      });
      const player2 = await this.prisma.user.findUnique({
        where: { id: this.Rooms[parseInt(data.room)].players[1].username },
      });
      const winrate1 = (player1.Wins / player1.Played) * 100;
      const winrate2 = (player2.Wins / player2.Played) * 100;

      await this.prisma.user.update({
        where: { id: this.Rooms[parseInt(data.room)].players[0].username },
        data: { winrate: winrate1 },
      });
      await this.prisma.user.update({
        where: { id: this.Rooms[parseInt(data.room)].players[1].username },
        data: { winrate: winrate2 },
      });
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
      this.Rooms[parseInt(gameId)].players[0].minimized = false;
      this.Rooms[parseInt(gameId)].players[1].minimized = false;
      this.Rooms[parseInt(gameId)].players[0].minimized = false;
      this.Rooms[parseInt(gameId)].players[1].minimized = false;
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
          minimized: false,
        },
        {
          username: userIds[1],
          playerNo: 2,
          minimized: false,
        },
      ],
      winner: '',
      finished: false,
    };
    this.Rooms.push(room);
    this.Rooms[room.roomId].players[0].minimized = true;
    this.Rooms[room.roomId].players[0].minimized = true;
    return room.roomId.toString();
  }
}
