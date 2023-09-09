// import {
// 	SubscribeMessage,
// 	WebSocketGateway,
// 	WebSocketServer,
// 	ConnectedSocket,
// 	MessageBody,
//   } from '@nestjs/websockets';
//   import { Injectable } from '@nestjs/common';
//   import { PrismaService } from 'src/prisma/prisma.service';
//   import { Server, Socket } from 'socket.io';
//   @WebSocketGateway({
// 	namespace: '/notifiction',
// 	cors: {
// 	  origin: '*',
// 	  methods: ['GET', 'POST'],
// 	  transports: ['websocket', 'polling'],
// 	  credentials: false,
// 	},
// 	allowEIO3: true,
//   })
//   @Injectable()
//   export class NotiGateway {
// 	constructor(
// 	  private prisma: PrismaService,
// 	) {}
// 	@WebSocketServer()
// 	server: Server;

// 	handleConnection(client: Socket) {
// 		console.log('Client user connected:', client.id);
// 		// const parseId = this.queue.parseJwt(client.handshake.auth.token);
// 		// const userId = parseId.id;
// 		// client.data.userId = userId;
// 		// if (!userId) {
// 		// 	// Close the connection if no userId is provided
// 		// 	client.disconnect();
// 		// 	console.log('Client game disconnectedddd');
// 		// 	return;
// 		// }
// 		// const message = `Welcome to the game, ${userId}`;
// 		// client.emit('welcome', message);
// 		// // Attach the userId to the socket for future use
// 		// this.usersConnected.push(userId);
// 		// console.log('User connected:', userId);
// 		// console.log('Users in server are ', this.usersConnected);
// 		}

// 		handleDisconnect(client: Socket) {
// 			console.log('Client disconnected:', client.id);
// 			// You can access the attached username if needed
// 			const username = client.data.userId;
// 			if (username) {
// 			  console.log('User disconnected:', username);
// 			}
// 		  }
//   }