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
import { GameInviteQueue } from './models/GameInviteQueue'; //* nizz
import { Server, Socket } from 'socket.io';
import { MatchMode } from '@prisma/client';
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
  private inviteQueue: GameInviteQueue = new GameInviteQueue(); //* nizz
  private inGame: string[] = [];
  //interface room
  private Rooms: IRoom[] = [] as IRoom[];
  private usersConnected: string[] = [];

  async handleConnection(client: Socket) {
    const parseId = this.queue.parseJwt(client.handshake.auth.token);
    const userId = parseId.id;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (user){
      client.data.userId = userId;
      client.data.username = user.username;
    }
    if (!userId) {
      // Close the connection if no userId is provided
      client.disconnect();
      return;
    }
    const message = `Welcome to the game, ${userId}`;
    client.emit('welcome', message);
    // Attach the userId to the socket for future use
    this.usersConnected.push(userId);
	await this.prisma.user.update({
		where: { id: userId },
		data: { isOnline: true },
	});
  }

  //* ------------------------------- nizz start ------------------------------- */
// inviare game id e metterci denrtro i due utenti
	@SubscribeMessage('joinGameInviteQueue')
	handleGameInvite(@ConnectedSocket() client: Socket, invite:string): void {
		if (this.inGame.includes(client.data.userId))
			return;
		this.inviteQueue.add(client);
		this.checkGameInvteQueue(invite);
	}

	//! from here on the functions should be placed in the unMounted
	@SubscribeMessage('removeAcceptedInvite')
  handleLeaveInviteQueue(@ConnectedSocket() client: Socket): void {
    this.inviteQueue.remove(client);
  }

	@SubscribeMessage('readyInvite')
  handleReadyInvite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.server.to(data.room).emit('start', data.player);
  }

//* -------------------------------- nizz end -------------------------------- */

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket): void {
    if (this.inGame.includes(client.data.userId)) {
      return;
    }
    this.queue.add(client);
    this.checkQueue();
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@ConnectedSocket() client: Socket): void {
    this.queue.remove(client);
  }
  // player ready to play
  @SubscribeMessage('ready')
  handleReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
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
    this.server
      .to(data.room)
      .emit('powerupServer', { power: random, room: data.room });
  }

  @SubscribeMessage('pause')
  handlePause(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.Rooms[parseInt(data.room)].players[data.player - 1].minimized = true;
    this.server.to(data.room).emit('pauseServer', data);
  }

  @SubscribeMessage('unpause')
  handleUnPause(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.Rooms[parseInt(data.room)].players[data.player - 1].minimized = false;
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
    this.server.to(data.room).emit('ballUpdateServer', data);
    // }
  }

  @SubscribeMessage('restart')
  handleRestart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.Rooms[parseInt(data.room)].finished = false;
    this.server.to(data.room).emit('restartServer', data.player);
  }

  @SubscribeMessage('powerballUpdate')
  handlePowerBallUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    this.server.to(data.room).emit('powerballUpdateServer', data);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: any,
  ): void {
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
        await this.prisma.gameinvite.deleteMany({
          where: { 
            OR:[
              {senderId: this.Rooms[parseInt(data.room)].players[0].userId, receiverId:this.Rooms[parseInt(data.room)].players[1].userId},
              {senderId: this.Rooms[parseInt(data.room)].players[1].userId, receiverId:this.Rooms[parseInt(data.room)].players[0].userId}
            ] 
          },
        });
      let winner: string;
      let loser: string;
      if (data.score1 === 5) {
        winner = this.Rooms[parseInt(data.room)].players[0].userId;
        loser = this.Rooms[parseInt(data.room)].players[1].userId;
      } else if (data.score2 === 5) {
        winner = this.Rooms[parseInt(data.room)].players[1].userId;
        loser = this.Rooms[parseInt(data.room)].players[0].userId;
      }
      let modeGame = null;
      if  (data.mode === 'POWERUP')
        modeGame = MatchMode.POWERUP
      else
        modeGame = MatchMode.CLASSIC
      const matchplayed = await this.gameService.createHistory({
        user1Id: this.Rooms[parseInt(data.room)].players[0].userId,
        user2Id: this.Rooms[parseInt(data.room)].players[1].userId,
        winnerId: winner,
        score: data.score1 + '-' + data.score2,
        mode: modeGame,
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
        where: { id: this.Rooms[parseInt(data.room)].players[0].userId },
      });
      const player2 = await this.prisma.user.findUnique({
        where: { id: this.Rooms[parseInt(data.room)].players[1].userId },
      });
      const winrate1 = (player1.Wins / player1.Played) * 100;
      const winrate2 = (player2.Wins / player2.Played) * 100;

      await this.prisma.user.update({
        where: { id: this.Rooms[parseInt(data.room)].players[0].userId },
        data: { winrate: winrate1 },
      });
      await this.prisma.user.update({
        where: { id: this.Rooms[parseInt(data.room)].players[1].userId },
        data: { winrate: winrate2 },
      });
    }
    this.server.to(data.room).emit('updateScoreServer', data);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
	await this.prisma.user.update({
		where: { id: client.data.userId },
		data: { isPlaying: false },
	  });
    this.queue.remove(client);
    this.inGame = this.inGame.filter((user) => user !== client.data.userId);
  }

  @SubscribeMessage('exitGame')
  async handleExitGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): Promise<void> {
    console.log('Exit game received');
    this.server.to(data).emit('playerDisconnected', data);
	await this.prisma.user.update({
		where: { id: client.data.userId },
		data: { isPlaying: false },
	  });
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // You can access the attached username if needed
    const userId = client.data.userId;
	await this.prisma.user.update({
		where: { id: userId },
		data: { isPlaying: false },
	  });
    if (userId) {
      console.log('User disconnected game:', userId);
    }
	await this.prisma.user.update({
		where: { id: userId },
		data: { isOnline: false },
	});
    this.queue.remove(client);
    if (this.inGame.includes(userId)) {
      this.inGame = this.inGame.filter((user) => user !== userId);

      const room = this.Rooms.reverse().find((room) =>
        room.players.find((player) => player.userId === userId),
      );
      if (room) {
        this.server
          .to(room.roomId.toString())
          .emit('playerDisconnected', room.roomId.toString());
        // this.Rooms = this.Rooms.filter((room) => room !== room);
      }
    }

    this.usersConnected = this.usersConnected.filter(
      (user) => user !== userId,
    );
    console.log('Users connected are ', this.usersConnected);
  }

  // Utility function to start the game

	//* ------------------------------- start nizz ------------------------------- */


  @SubscribeMessage('removeGameInvited')
  async handleRemoveGameInvited(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const user1 = await this.prisma.user.findUnique({
      where: { username: data.username1 },
    });
    const user2 = await this.prisma.user.findUnique({
      where: { username: data.username2 },
    });
    await this.prisma.gameinvite.deleteMany({
      where: { 
        OR:[
          {senderId: user1.id, receiverId: user2.id},
          {senderId: user2.id, receiverId:user1.id}
        ] 
      },
    });
  }

	private async checkGameInvteQueue(invite: string) {
		let playersSockets: Socket[];
		if (this.inviteQueue.size() < 2)
		{
			return;
		}
		else {
		  playersSockets = this.inviteQueue.pop2();
		  this.inGame.push(playersSockets[0].data.userId);
		  this.inGame.push(playersSockets[1].data.userId);
		  const gameId = await this.createGameInvite(playersSockets, invite);
		  playersSockets[0].emit('playerInviteNo', { player: 1, room: gameId.roomId.toString(), username1: gameId.players[0].username, username2: gameId.players[1].username });
		  playersSockets[1].emit('playerInviteNo', { player: 2, room: gameId.roomId.toString(), username1: gameId.players[0].username, username2: gameId.players[1].username });
      await this.prisma.user.update({
        where: { id: playersSockets[0].data.userId },
        data: { isPlaying: true },
      });
      await this.prisma.user.update({
        where: { id: playersSockets[1].data.userId },
        data: { isPlaying: true },
      });
      playersSockets[0].join(gameId.roomId.toString());
		  playersSockets[1].join(gameId.roomId.toString());
		  this.server.to(gameId.roomId.toString()).emit('startingInviteGame', this.Rooms[parseInt(gameId.roomId.toString())]);
				this.Rooms[parseInt(gameId.roomId.toString())].players[0].minimized = false;
				this.Rooms[parseInt(gameId.roomId.toString())].players[1].minimized = false;
		}
	}
	
	//* -------------------------------- end nizz -------------------------------- */

  private async checkQueue() {
    let playersSockets: Socket[];
    if (this.queue.size() < 2) return;
    else {
      playersSockets = this.queue.pop2();
      this.inGame.push(playersSockets[0].data.userId);
      this.inGame.push(playersSockets[1].data.userId);
      const gameId = await this.createGame(playersSockets);
      playersSockets[0].emit('playerNo', { player: 1, room: gameId.roomId.toString(), username1: gameId.players[0].username, username2: gameId.players[1].username });
      playersSockets[1].emit('playerNo', { player: 2, room: gameId.roomId.toString(), username1: gameId.players[0].username, username2: gameId.players[1].username });
	  await this.prisma.user.update({
        where: { id: playersSockets[0].data.userId },
        data: { isPlaying: true },
      });
      await this.prisma.user.update({
        where: { id: playersSockets[1].data.userId },
        data: { isPlaying: true },
      });
      playersSockets[0].join(gameId.roomId.toString());
      playersSockets[1].join(gameId.roomId.toString());
      this.server.to(gameId.roomId.toString()).emit('startingGame', this.Rooms[parseInt(gameId.roomId.toString())]);
      this.Rooms[parseInt(gameId.roomId.toString())].players[0].minimized = false;
      this.Rooms[parseInt(gameId.roomId.toString())].players[1].minimized = false;
    }
  }

  private async createGame(userIds: Socket[]) {
    const room: IRoom = {
      roomId: this.Rooms.length,
      players: [
        {
          userId: userIds[0].data.userId,
          username: userIds[0].data.username,
          playerNo: 1,
          minimized: false,
        },
        {
          userId: userIds[1].data.userId,
          username: userIds[1].data.username,
          playerNo: 2,
          minimized: false,
        },
      ],
      winner: '',
      finished: false,
    };
    this.Rooms.push(room);
    this.Rooms[room.roomId].players[0].minimized = true;
    this.Rooms[room.roomId].players[1].minimized = true;
    return room;
  }

  private async createGameInvite(userIds: Socket[], inviteId: string) {
    const room: IRoom = {
      roomId: this.Rooms.length,
      players: [
        {
          userId: userIds[0].data.userId,
          username: userIds[0].data.username,
          playerNo: 1,
          minimized: false,
        },
        {
          userId: userIds[1].data.userId,
          username: userIds[1].data.username,
          playerNo: 2,
          minimized: false,
        },
      ],
      winner: '',
      finished: false,
      inviteId: inviteId,
    };
    this.Rooms.push(room);
    this.Rooms[room.roomId].players[0].minimized = true;
    this.Rooms[room.roomId].players[1].minimized = true;
    return room;
  }

}
