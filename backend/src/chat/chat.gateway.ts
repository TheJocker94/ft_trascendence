import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { GetCurrUserId } from 'src/auth/common/decorators';
import { Body, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: false,
  },
  allowEIO3: true,
})
@Injectable()
export class ChatGateway {
  constructor(private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;
  users = 0;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    const username = client.handshake.auth.username;
    const message = `Welcome to the chat, ${username}`;
    this.server.emit('welcome', message);

    if (!username) {
      client.disconnect();
      console.log('Client disconnectedddd');
      return;
    }

    client['username'] = username;

    console.log('User connected:', username);
  }
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
  @SubscribeMessage('messageToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: any,
  ): void {
    console.log('Received data from client:');
    console.log(text.text);
    console.log('Username client :', client['username']);
    this.server.emit('messageFromServer', {
      text: text.text,
      username: client['username'],
    });
  }
  @SubscribeMessage('createGroup')
  handleCreateGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() text: any,
    @GetCurrUserId() userId: string,
  ): void {
    console.log('client.data.userId: ', client.data.userId);
    console.log('client.id: ', client.id);
    console.log('userId:', userId);
    this.prisma.channel.create({
      data: { ownerId: userId, type: 'GROUP', name: text.text },
    });
    this.server.emit('messageFromServer', {
      text: text.text,
      username: client['username'],
    });
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // You can access the attached username if needed
    const username = client['username'];
    if (username) {
      console.log('User disconnected:', username);
    }
  }
}
