import{
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChannelType, UserRole, UserStatus } from '@prisma/client';
import { ChannelDto } from './dto/channel.dto';

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

  @SubscribeMessage('channelList')
  async handleGrouplList(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
      const channels = await this.prisma.channel.findMany({
        where:{
          OR: [
            {type: ChannelType.PUBLIC},
            {type: ChannelType.PRIVATE}
          ]
        },
        include: {
          messages: {
            select: {
              content: true,
              time: true,
            }
          }
        }
      });
      const ChannelsList = channels.map(channel => {
        return {
          id: channel.id,
          name: channel.name,
          messages: channel.messages,
          type: channel.type,
        }
      });
      
      client.emit('groupListServer', ChannelsList);
    }


  @SubscribeMessage('createGroup')
  async handleCreateGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,

  ): Promise<void> {
    // console.log('client.data.userId: ', client.data.userId);
    // console.log('client.id: ', client.id);
    console.log('userId:', data.sender);
    console.log("data.text: ", data.text);
    console.log("FindFirst: ", this.prisma.channel.findFirst({where: {name: data.text}}));
    const existingChannel = await this.prisma.channel.findFirst({where: {name: data.text}});
    if (existingChannel) {
      console.log('Channel already exists');
      client.emit('channelAlreadyExists', data.text);
      return;
    }
	// const channel = new Channel(1, 'PUBLIC', data.sender, data.text);
  if (data.password === '') {
  try {const newChannel = await this.prisma.channel.create({
    data: { ownerId: data.sender, type: data.type, name: data.text},
  })
  const newUser = await this.prisma.channelMembership.create({
    data: { userId: data.sender, channelId: newChannel.id, role: UserRole.OWNER, status: UserStatus.ACTIVE}
  })
}
  catch (error) {
    console.error('Error creating channel:', error);
  }}
  else {
    try {const newChannel = await this.prisma.channel.create({
      data: { ownerId: data.sender, type: data.type, name: data.text, password: data.password},
    })
    const newUser = await this.prisma.channelMembership.create({
      data: { userId: data.sender, channelId: newChannel.id, role: UserRole.OWNER, status: UserStatus.ACTIVE}
    })
  }
    catch (error) {
      console.error('Error creating channel:', error);
    }
  }
  

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
