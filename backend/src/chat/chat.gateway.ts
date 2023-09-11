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
    const username = client.handshake.auth.username;
    const message = `Welcome to the chat, ${username}`;
    this.server.emit('welcome', message);

    if (!username) {
      client.disconnect();
      return;
    }

    client['username'] = username;

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
    }
    else {
      client.emit('isBanChan', data.uId, data.chId, false);
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
      client.emit('isAdminChan', true);
    }
    else {
      client.emit('isAdminChan', false);
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
    this.handleGrouplList(client, data);
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
    this.handleGrouplList(client, data);
  }



  // text: msg.value, id: currentChannelId.value, sender: userStore.value.userId
  @SubscribeMessage('messageToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const isUserBanned = await this.prisma.channelMembership.findFirst({
      where: {
        userId: data.uId,
        channelId: data.chId,
        }
        })
    if (isUserBanned.status === UserStatus.BANNED || isUserBanned.status === UserStatus.MUTED) {
      console.log('User is banned or muted');
      client.emit('userIsMuted', data.uId);
      return;
    }
    await this.prisma.message.create({
      data: {
        content: data.text,
        senderId: data.uId,
        channelId: data.chId,
      }
    })
    this.server.to(data.chId).emit('messageFromServer', data.chId);

	const channel = await this.prisma.channel.findUnique({ 
		where: {id: data.chId}});
	channel.notInRoom.forEach(async member => {
		await this.prisma.channelMembership.update({
			where: { userId_channelId: { userId: member, channelId: data.chId } },
			data: { notRead: { increment: 1 } },
		});
	});
  }

  @SubscribeMessage('messageToDirect')
  async handleDirectMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const isUserBlocked = await this.prisma.blockedUser.findFirst({
      where: {
        AND: [
          {blockerId: data.chatId},
          {blockedId: data.mioId},
        ]
      }
    })
    if (isUserBlocked) {
      client.emit('userIsBlocked', data.chatId);
      return;
    }
    await this.prisma.message.create({
      data: {
        content: data.text,
        senderId: data.mioId,
        channelId: data.chId,
      }
    })
    this.server.to(data.chId).emit('messageFromDirect', data);

	const channel = await this.prisma.channel.findUnique({ 
		where: {id: data.chId}});
	channel.notInRoom.forEach(async member => {
		await this.prisma.channelMembership.update({
			where: { userId_channelId: { userId: member, channelId: data.chId } },
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
          members: channel.members,
          notInRoom: channel.notInRoom,
        }
      });
      client.emit('groupListServer', ChannelsList);
    }

    @SubscribeMessage('friendList')
    async handleFriendslList(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: any,
    ): Promise<void> {
        const channels = await this.prisma.channel.findMany({
          where:{
            OR: [
              {type: ChannelType.DIRECT},
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
            members: channel.members,
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
        userId: data.uId,
        channelId: data.chId,
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
          userId: data.uId,
          channelId: data.chId,
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

    @SubscribeMessage('refreshDirectChat')
    async handleRefreshDirectChat(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: any,
    ): Promise<void> {
      const channel = await this.prisma.channel.findFirst({
        where: {
          AND: [
            {type: ChannelType.DIRECT},
            {id: data.chanId},
          ]
        },
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

    @SubscribeMessage('getChannel')
    async handleSingleChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: any,
    ): Promise<void> {
      if(data.chatId)
      {
        let channel = null;
        channel = await this.prisma.channel.findFirst({ 
          where: {
            AND: [
              {type: ChannelType.DIRECT},
              {members: {some: {userId: data.chatId}}},
              {members: {some: {userId: data.mioId}}}
            ]
          },
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
        if(!channel)
        {
            channel = await this.prisma.channel.create({
            data: { type: ChannelType.DIRECT},
            })
            await this.prisma.channelMembership.create({
              data: { userId: data.chatId, channelId: channel.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
            })
            await this.prisma.channelMembership.create({
              data: { userId: data.mioId, channelId: channel.id, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
            })
        }
        client.join(channel.id);
        client.emit('singleChannelServer', channel);
      }
      else
      {
        const channel = await this.prisma.channel.findUnique({ 
          where: {id: data.chId},
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
    }

  @SubscribeMessage('enterRoom')
  async handleEnterRoom(
	@ConnectedSocket() client: Socket,
	@MessageBody() data: any,
  ): Promise<void> {
	const channel = await this.prisma.channel.findUnique({ 
	  where: {id: data.chId}});
	client.leave(data.currentChannelId);
	client.join(data.chId);
	
	const newNotInRoom: string[] = [];
	for (let i = 0; i < channel.notInRoom.length; i++) {
			  if (channel.notInRoom[i] !== data.uId) {
				newNotInRoom.push(channel.notInRoom[i]);
			  }
			}
	await this.prisma.channel.update({
		where: {
			id: data.chId,
		},
		data: {
			notInRoom: newNotInRoom,
		},
	})
	await this.prisma.channelMembership.update({
		where: { userId_channelId: { userId: data.uId, channelId: data.chId } },
		data: { notRead: 0 },
	});
	if (data.currentChannelId !== '') {
	  await this.prisma.channel.update({
	  	where: {
	  	  id: data.currentChannelId,
	  	},
	  	data: {
	  	  notInRoom: {
	  		push: data.uId,
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
    this.handleGrouplList(client, data);
      return;
    }
    await this.prisma.channelMembership.delete({
      where: {
        userId_channelId: {
          userId: data.uId,
          channelId: data.chId,
        }
      }
    })
    this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
    this.handleGrouplList(client, data);
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
    this.handleGrouplList(client, data);
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
    this.handleGrouplList(client, data);
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
    this.handleGrouplList(client, data);
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
        id: data.chId,
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

  @SubscribeMessage('checkIfPrivate')
  async handleCheckIfPrivate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: data.chId,
      },
    });
    if (channel.type === ChannelType.PRIVATE) {
      client.emit('isPrivOn', true);
    }
    else {
      client.emit('isPrivOn', false);
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
        userId: data.uId,
        channelId: data.chId,
        status: UserStatus.BANNED,
      }
    })
    if (bannedUser) {
      console.log('User is banned');
      client.emit('userIsBanned', data.chId);
      return;
    }
    const canale = await this.prisma.channel.findUnique({
      where: {
        id: data.chId,
      },
    });
    if (canale.type === ChannelType.PRIVATE && data.invited === false) {
      console.log('Channel is private');
      return;
    }
    if (canale.type === ChannelType.PRIVATE && data.invited === true) {
      try {
        await this.prisma.channelMembership.create({
          data: { userId: data.uId, channelId: data.chId, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
      })
      client.join(data.chId);
      console.log('Ho joinato nel backend 1' + data.chId);
      this.handleGrouplList(client, data);
      this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
    }
      catch (error) {
        console.error('Error creating channel:', error);
      }
      return;
    }
    if (canale.password === '' || canale.password === null) {
      try {
        await this.prisma.channelMembership.create({
          data: { userId: data.uId, channelId: data.chId, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
      })
      client.join(data.chId);
      console.log('Ho joinato nel backend 2' + data.chId);
      this.handleGrouplList(client, data);
      this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
    }
      catch (error) {
        console.error('Error creating channel:', error);
      }}
    else if(canale.password === data.password) {
        try {
        await this.prisma.channelMembership.create({
          data: { userId: data.uId, channelId: data.chId, role: UserRole.MEMBER, status: UserStatus.ACTIVE}
        })
      }
        catch (error) {
          console.error('Error creating channel:', error);
        }
        client.join(data.chId);
        this.handleGrouplList(client, data);
        this.server.to(data.chId).emit('gettingSingleChannel', data.chId);
      }
      else {
        console.log('Password is wrong');
        this.handleCheckIfPassword(client, data);
      }
    //  this.handleGrouplList(client, data);
  }


  @SubscribeMessage('joinDirect')
  async handleJoinDirect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {

    client.join(data.chId);
    console.log('Ho joinato nel backend diretto 4' + data.chId);
  }

  @SubscribeMessage('createGroup')
  async handleCreateGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,

  ): Promise<void> {
    const existingChannel = await this.prisma.channel.findFirst({where: {name: data.text}});
    if (existingChannel) {
      console.log('Channel already exists');
      client.emit('channelAlreadyExists', data.text);
      return;
    }
    if (data.password === '' || data.password === null) {
      try {
        const newChannel = await this.prisma.channel.create({
          data: { type: data.type, name: data.text},
        })
        await this.prisma.channelMembership.create({
          data: { userId: data.uId, channelId: newChannel.id, role: UserRole.OWNER, status: UserStatus.ACTIVE}
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
          data: { userId: data.uId, channelId: newChannel.id, role: UserRole.OWNER, status: UserStatus.ACTIVE}
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

