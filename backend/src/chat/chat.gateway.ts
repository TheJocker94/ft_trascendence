import{
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChannelType, UserRole, UserStatus } from '@prisma/client';
import { ClassTransformOptions,plainToClass } from 'class-transformer';
import { Cron, CronExpression, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { time } from 'console';
import { UserService } from 'src/user/user.service';

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
  constructor(private prisma: PrismaService, private userService: UserService, private schedulerRegistry: SchedulerRegistry) {}
  @WebSocketServer()
  server: Server;
  users = 0;

  async handleConnection(client: Socket) {
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

    console.log('User connected chat:', username);
	await this.prisma.user.update({
		where: { username: username },
		data: { isOnline: true },
	});
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

  @SubscribeMessage('isBanFluid')
  async handleIsBanFluid(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const bannedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.uId,
        channelId: data.chId,
        status: UserStatus.BANNED,
      }
    })
    if (bannedUser) {
      console.log('User is banned');
      client.emit('isBanFluidRet', true);
      return;
    }
    else {
      client.emit('isBanFluid', false);
    }
  }

  @SubscribeMessage('checkIfBan')
  async handleCheckIfBan(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const bannedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.uId,
        channelId: data.chId,
        status: UserStatus.BANNED,
      }
    })
    if (bannedUser) {      
      client.emit('isBanChan', data.uId, data.chId, true);  
      console.log('User is banned');    
    }
    else {
      client.emit('isBanChan', data.uId, data.chId, false);
      console.log('User is not banned');
    }
  }

  @SubscribeMessage('checkIfMute')
  async handleCheckIfMute(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const mutedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.uId,
        channelId: data.chId,
        status: UserStatus.MUTED,
      }
    })
    if (mutedUser) {
      console.log('User is muted');
      client.emit('isMuteChan', true);
    }
    else {
      client.emit('isMuteChan', false);
      console.log('User is not muted');
    }
  }

  @SubscribeMessage('checkIfAdmin')
  async handleCheckIfAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const adminUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.uId,
        channelId: data.chId,
        role: UserRole.ADMIN,
      }
    })
    if (adminUser) {
      console.log('User is admin');
      client.emit('isAdminChan', true);
    }
    else {
      client.emit('isAdminChan', false);
      console.log('User is not admin');
    }
  }

  @SubscribeMessage('setAdmin')
  async handleSetAdmin(
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
        role: UserRole.ADMIN,
      }
    })
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
    this.handleCheckIfAdmin(client, data);
  }
  @SubscribeMessage('unSetAdmin')
  async handleUnSetAdmin(
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
        role: UserRole.MEMBER,
      }
    })
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
    this.handleCheckIfAdmin(client, data);
  }



  // text: msg.value, id: currentChannelId.value, sender: userStore.value.userId
  @SubscribeMessage('messageToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const isUserBanned = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.sender,
        channelId: data.id,
        }
        })
    if (isUserBanned.status === UserStatus.BANNED || isUserBanned.status === UserStatus.MUTED) {
      console.log('User is banned or muted');
      client.emit('userIsMuted', data.sender);
      return;
    }
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
    // cerca se gia kickato
    const kickedUser = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.uId,
        channelId: data.chId,
      }
    })
    if (!kickedUser || kickedUser.role === UserRole.OWNER) {
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
      return;
    }
    // elimino tutti i messaggi dell'utente
    await this.prisma.message.deleteMany({
      where: {
        senderId: data.uId,
        channelId: data.chId,
      }
    })
    await this.prisma.channelMembership.delete({
      where: {
        userId_channelId: {
          userId: data.uId,
          channelId: data.chId,
        }
      }
    })
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
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
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
  }


  @SubscribeMessage('unbanChannel')
  async handleUnbanChannel(
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
        status: UserStatus.ACTIVE,
      }
    })
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
    
  }

  @SubscribeMessage('muteUser')
  async handleMuteUser(
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
        status: UserStatus.MUTED,
      }
    });
    // Chiamare la funzione addTimeout con i parametri appropriati
    this.addTimeout(data.uId, data.time, data.chId);
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
  }

  addTimeout(name: string, milliseconds: number, channelId: string) {
    const timeout = setTimeout(() => {
      console.log(`Timeout ${name} executing after (${milliseconds})!`);
      this.smuteUserFromChannel(name, channelId);
    }, milliseconds);    
    
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  @SubscribeMessage('checkIfPassword')
  async handleCheckIfPassword(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: data.id,
      },
    });
    if (channel.password === '' || channel.password === null) {
      console.log('Channel is not password protected');
      client.emit('isPassOn', false);
    }
    else {
      console.log('Channel is password protected');
      client.emit('isPassOn', true);
    }
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
    const canale = await this.prisma.channel.findUnique({
      where: {
        id: data.id,
      },
    });

    if (canale.password === '' || canale.password === null) {
      try {
        await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: data.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
      })
      client.join(data.id);
      console.log('Ho joinato nel backend' + data.id);
      this.server.to(data.id).emit('gettingSingleChannel', data.id);
    }
      catch (error) {
        console.error('Error creating channel:', error);
      }}
    else if(canale.password === data.password) {
        try {
        await this.prisma.channelMembership.create({
          data: { userId: data.sender, channelId: data.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
        })
      }
        catch (error) {
          console.error('Error creating channel:', error);
        }
        client.join(data.id);
        console.log('Ho joinato nel backend' + data.id);
        this.server.to(data.id).emit('gettingSingleChannel', data.id);
      }
    else {
      console.log('Password is wrong');
      this.handleCheckIfPassword(client, data);
    }
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
    if (data.password === '' || data.password === null) {
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
  
  async handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // You can access the attached username if needed
    const username = client['username'];
    if (username) {
      console.log('User disconnected chat: ', username);
    }
	await this.prisma.user.update({
		where: { username: username },
		data: { isOnline: false },
	});
  }
}

const transformationOptions: ClassTransformOptions = {
  strategy: 'excludeAll',
};

