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
import { ClassTransformOptions,plainToClass } from 'class-transformer';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { time } from 'console';

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

  @SubscribeMessage('checkIfBan')
  async handleCheckIfBan(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const bannedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.sender,
        channelId: data.id,
        status: UserStatus.BANNED,
      }
    })
    if (bannedUser) {      
      client.emit('isBanChan', data.sender, data.id, true);  
      console.log('User is banned');    
    }
    else {
      client.emit('isBanChan', data.sender, data.id, false);
      console.log('User is not banned');
    }
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
    this.server.to(data.id).emit('messageFromServer', data.id);

	const channel = await this.prisma.channel.findUnique({ 
		where: {id: data.id}});
	channel.notInRoom.forEach(async member => {
		await this.prisma.channelMembership.update({
			where: { userId_channelId: { userId: member, channelId: data.id } },
			data: { notRead: { increment: 1 } },
		});
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
          members:{
            select: {
              userId: true,
              role: true,
              status: true,
              muteEndTime: true,
              notRead: true,
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
          notInRoom: channel.notInRoom,
        }
      });
      client.emit('groupListServer', ChannelsList);
    }
	
    @SubscribeMessage('isUserInCh')
    async handleSingleChannelList(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<any> {
      //check banned users
    const bannedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.sender,
        channelId: data.id,
        status: UserStatus.BANNED,
      }
    })
    if (bannedUser) {
      console.log('User is banned');
      client.emit('isUserInChannel', 'BANNED')
      return;
    }
      const channelMembership = await this.prisma.channelMembership.findFirst({
        where: { 
          userId: data.sender,
          channelId: data.id,
        },
      });
      if (channelMembership) {
        console.log('channelMembership true ', channelMembership);
        client.emit('isUserInChannel', true);
      } else {
        console.log('channelMembership false');
        client.emit('isUserInChannel', false);
      }
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

  @SubscribeMessage('enterRoom')
  async handleEnterRoom(
	@ConnectedSocket() client: Socket,
	@MessageBody() data: any,
  ): Promise<void> {
	const channel = await this.prisma.channel.findUnique({ 
	  where: {id: data.id}});
	client.leave(data.currentChannelId);
	client.join(data.id);
	
	const newNotInRoom: string[] = [];
	for (let i = 0; i < channel.notInRoom.length; i++) {
			  if (channel.notInRoom[i] !== data.sender) {
				newNotInRoom.push(channel.notInRoom[i]);
			  }
			}
	await this.prisma.channel.update({
		where: {
			id: data.id,
		},
		data: {
			notInRoom: newNotInRoom,
		},
	})
	await this.prisma.channelMembership.update({
		where: { userId_channelId: { userId: data.sender, channelId: data.id } },
		data: { notRead: 0 },
	});
	if (data.currentChannelId !== '') {
	  await this.prisma.channel.update({
	  	where: {
	  	  id: data.currentChannelId,
	  	},
	  	data: {
	  	  notInRoom: {
	  		push: data.sender,
	  	  },
	  	},
	    })
	}
  }

  // sul front: socket.emit('leftRoom', {currentChannelId: currentChannelId.value, sender: userStore.value.userId});
  @SubscribeMessage('leftRoom')
  async handleLeftRoom(
	@ConnectedSocket() client: Socket,
	@MessageBody() data: any,
  ): Promise<void> {
	client.leave(data.currentChannelId);
	if (data.currentChannelId !== '') {
	  await this.prisma.channel.update({
	  	where: {
	  	  id: data.currentChannelId,
	  	},
	  	data: {
	  	  notInRoom: {
	  		push: data.sender,
	  	  },
	  	},
	    })
	}
  }

  @SubscribeMessage('kickChannel')
  async handleKickChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    // elimino tutti i messaggi dell'utente
    await this.prisma.message.deleteMany({
      where: {
        senderId: data.userId,
        channelId: data.channelId,
      }
    })
    await this.prisma.channelMembership.delete({
      where: {
        userId_channelId: {
          userId: data.userId,
          channelId: data.channelId,
        }
      }
    })
    this.server.to(data.channelId).emit('gettingSingleChannel', data.channelId);
  }

  @SubscribeMessage('banChannel')
  async handleBanChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {    
    await this.prisma.channelMembership.update({
      where: {
        userId_channelId: {
          userId: data.uId,
          channelId: data.chId,
        }
      },
      data: {
        status: UserStatus.BANNED,
      }
    })
    this.server.to(data.chId).emit('gettingSingleChannel', data.channelId);
  }


  @SubscribeMessage('unbanChannel')
  async handleUnbanChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    await this.prisma.channelMembership.update({
      where: {
        userId_channelId: {
          userId: data.userId,
          channelId: data.channelId,
        }
      },
      data: {
        status: UserStatus.ACTIVE,
      }
    })
    this.server.to(data.channelId).emit('gettingSingleChannel', data.channelId);
  }

  @SubscribeMessage('muteChannel')
  async handleMuteChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    await this.prisma.channelMembership.update({
      where: {
        userId_channelId: {
          userId: data.userId,
          channelId: data.channelId,
        }
      },
      data: {
        status: UserStatus.MUTED,
        muteEndTime: data.muteEndTime,
      }
    })
    this.server.to(data.channelId).emit('gettingSingleChannel', data.channelId);
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    //check banned users
    const bannedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.sender,
        channelId: data.id,
        status: UserStatus.BANNED,
      }
    })
    if (bannedUser) {
      console.log('User is banned');
      client.emit('userIsBanned', data.id);
      return;
    }
    if (data.password === '') {
      try {
        await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: data.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
      })
    }
      catch (error) {
        console.error('Error creating channel:', error);
      }}
      else {
        try {
        await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: data.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
        })
      }
        catch (error) {
          console.error('Error creating channel:', error);
        }
      } 
    client.join(data.id);
    console.log('Ho joinato nel backend' + data.id);
    this.server.to(data.id).emit('gettingSingleChannel', data.id);
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
      try {
        const newChannel = await this.prisma.channel.create({
          data: { type: data.type, name: data.text},
        })
        await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: newChannel.id, role: UserRole.OWNER, status: UserStatus.ACTIVE}
        })
      }
      catch (error) {
        console.error('Error creating channel:', error);
      }
    }
    else {
      try {
        const newChannel = await this.prisma.channel.create({
          data: { type: data.type, name: data.text, password: data.password},
        })
        await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: newChannel.id, role: UserRole.OWNER, status: UserStatus.ACTIVE}
        })
      }
      catch (error) {
        console.error('Error creating channel:', error);
      }
    }
    this.server.emit('updateChannelList');
  }

  addTimeout(name: string, milliseconds: number, channelId: string) {
    const callback = () => {
      this.smuteUserFromChannel(name, channelId);
    };
  }
  

  async smuteUserFromChannel(userId: string, channelId: string){
      await this.prisma.channelMembership.update({
        where: {
          userId_channelId: {
            userId: userId,
            channelId: channelId,
          }
        },
        data: {
          status: UserStatus.ACTIVE,
        }
      })
      this.server.to(channelId).emit('gettingSingleChannel', channelId);
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

