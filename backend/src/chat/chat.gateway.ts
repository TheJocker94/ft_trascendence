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
import { ChannelDto, MessageDto, ChannelMembershipDto } from './dto/channel.dto';
import { ClassTransformOptions,plainToClass } from 'class-transformer';
import { subscribe } from 'diagnostics_channel';

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
  // text: msg.value, id: currentChannelId.value, sender: userStore.value.userId
  @SubscribeMessage('messageToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    await this.prisma.message.create({
      data: {
        content: data.text,
        senderId: data.sender,
        channelId: data.id,
      }
    })
    client.join(data.id);
    this.server.to(data.id).emit('messageFromServer', data.id);
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
          members:{
            select: {
              userId: true,
              role: true,
              status: true,
              muteEndTime: true,
            }
          },
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
    @SubscribeMessage('getChannel')
    async handleSingleChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: any,
    ): Promise<void> {
      const channel = await this.prisma.channel.findUnique({ 
        where: {id: data.id},
        include: {
          messages: {
            select: {
              content: true,
              time: true,
              read: true,
              sender: {
                select: {
                  id: true,
                  username: true,
                  profilePicture: true,
                  isOnline: true,
                  }
                }
              }
            },
            members: {
              select: {
                userId: true,
                role: true,
                status: true,
                muteEndTime: true
              }
            }
          }
      });
      client.emit('singleChannelServer', channel);
    }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    if (data.password === '') {
      try {
        const newUser = await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: data.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
      })
    }
      catch (error) {
        console.error('Error creating channel:', error);
      }}
      else {
        try {
        const newUser = await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: data.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
        })
      }
        catch (error) {
          console.error('Error creating channel:', error);
        }
      } 
    client.join(data.sender);
    this.server.to(data.sender).emit('joinChannelServer', data.sender);
  }

  @SubscribeMessage('createGroup')
  async handleCreateGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,

  ): Promise<void> {
    // console.log('client.data.userId: ', client.data.userId);
    // console.log('client.id: ', client.id);
    const existingChannel = await this.prisma.channel.findFirst({where: {name: data.text}});
    if (existingChannel) {
      console.log('Channel already exists');
      client.emit('channelAlreadyExists', data.text);
      return;
    }
	// const channel = new Channel(1, 'PUBLIC', data.sender, data.text);
  if (data.password === '') {
  try {const newChannel = await this.prisma.channel.create({
    data: { type: data.type, name: data.text},
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
      data: { type: data.type, name: data.text, password: data.password},
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

const transformationOptions: ClassTransformOptions = {
  strategy: 'excludeAll',
};

