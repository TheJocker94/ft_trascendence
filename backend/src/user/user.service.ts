import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import {
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { matchHistoryDto, userListDto } from './dto/userList.dto';
import {
  BlockedUserResponseDto,
  FriendsDto,
  InviteFriendsDto,
  InvitedProfileDto,
  userUpdateImageDto,
  userUpdateMailDto,
  userUpdateNameDto,
} from './dto';
import { stat } from 'fs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async getUser(userId: string): Promise<UserDto> {
    if (userId === undefined) {
      throw new BadRequestException('User not found');
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const dtoUser = plainToClass(UserDto, user, transformationOptions);
      return dtoUser;
    } catch (error) {
      throw new ForbiddenException('getUser error : ' + error);
    }
  }

  async getListUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { username: 'asc' },
    });
    const userListDtos: userListDto[] = [];
    for (const user_ of users) {
      const user = await this.prisma.user.findUnique({
        where: {
          username: user_.username,
        },
      });
      const dtoUser = plainToClass(userListDto, user, transformationOptions);
      userListDtos.push(dtoUser);
    }
    return userListDtos;
  }

  async setOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    
    if (isOnline)
    {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isOnline: isOnline,
        },
      });
    }
    else
    {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isOnline: isOnline,
          isPlaying: false
        },
      });
    }
  }

  async updateUsername(userData: userUpdateNameDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: userData.newUsername,
      },
    });
    if (user) {
      throw new BadRequestException('Username already exists');
    }
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userData.id,
        },
        data: {
          username: userData.newUsername,
        },
      });
      const updatedtoUser = plainToClass(UserDto, updatedUser, transformationOptions);
      return updatedtoUser;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  }

  async updateEmail(userData: userUpdateMailDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userData.newEmail,
      },
    });
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userData.id,
        },
        data: {
          email: userData.newEmail,
        },
      });
      const updatedtoUser = plainToClass(UserDto, updatedUser, transformationOptions);
      return updatedtoUser;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  async updateImage(userData: userUpdateImageDto): Promise<UserDto> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        profilePicture: userData.newImage,
      },
    });
    const updatedtoUser = plainToClass(UserDto, updatedUser, transformationOptions);

    return updatedtoUser;
  }

  async getLeaderboard(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        winrate: 'desc'
      }
    });
    const dtoUsers = plainToClass(UserDto, users, transformationOptions);
    return dtoUsers;
  }


  async getMatchHistory (): Promise<any> {

    const matches = await this.prisma.matchHistory.findMany({
      orderBy: {
        createdAt: 'desc'
      },
    });

    const dtoMatches: matchHistoryDto[] = [];
    for(const match of matches) {
      const user1 = await this.prisma.user.findUnique({
        where: {
          id: match.User1Id,
        },
        select: {
          id: true,
          username: true,
          profilePicture: true,
          isOnline: true,
          isPlaying: true
        }
      });
      const user2 = await this.prisma.user.findUnique({
        where: {
          id: match.User2Id,
        },
        select: {
          id: true,
          username: true,
          profilePicture: true,
          isOnline: true,
          isPlaying: true
        }
      });
      let winner;
      if (user1.id === match.winner)
        winner = user1.username;
      else
        winner = user2.username;
      const dtoMatch = plainToClass(matchHistoryDto, match, transformationOptions);
      dtoMatch.user1Id = user1;
      dtoMatch.user2Id = user2;
      dtoMatch.winnerUsername = winner;
      dtoMatches.push(dtoMatch);
    }
    return dtoMatches;
  }

  async addFriend(senderId: string, receiverId: string): Promise<any> {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot send a friend request to yourself.');
    }
    if (await this.isUserBlocked(senderId, receiverId) || await this.isUserBlocked(receiverId, senderId)) {
      throw new BadRequestException('Friend request cannot be sent as one user has blocked the other.');
    }

    if (await this.areUsersFriends(senderId, receiverId)) {
      throw new BadRequestException('Friendship already exists or is pending.');
    }

    await this.prisma.friendship.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        status: 'PENDING'
      }
    });
  }


  async change2fa(userId: string): Promise<boolean> {
    const status = await this.prisma.user.findUnique({ where: { id: userId } });
    if (status.is2faEnabled) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { is2faEnabled: false },
      });
      return false;
    }
    else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { is2faEnabled: true },
      });
      return true;
    }
  }
  
  async acceptFriendRequest(senderId: string, receiverId: string): Promise<void> {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId, status: 'PENDING' },
          { senderId: receiverId, receiverId: senderId, status: 'PENDING' }
        ]
      }
    });

    if (!friendship) {
      throw new BadRequestException('No pending friend request found.');
    }
    if (friendship.senderId !== receiverId) {
      throw new BadRequestException('You cannot accept a friend request that you sent.');
    }

    if (await this.isUserBlocked(senderId, receiverId) || await this.isUserBlocked(receiverId, senderId)) {
      throw new BadRequestException('Friend request cannot be accepted as one user has blocked the other.');
    }

    await this.prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'ACCEPTED' }
    });
  }

  async removeFriendship(senderId: string, receiverId: string): Promise<void> {
    await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });
  }

  async getFriends(userId: string): Promise<FriendsDto[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isOnline: true,
            isPlaying: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isOnline: true,
            isPlaying: true
          }
        }
      }
    });

    const friends = friendships.map(friendship => {
      if (friendship.senderId === userId) {
        return friendship.receiver;
      } else {
        return friendship.sender;
      }
    });
    return friends;
  }

  async getSentFriendRequests(userId: string): Promise<FriendsDto[]> {
    const friendship = await this.prisma.friendship.findMany({
      where: {
        senderId: userId,
        status: 'PENDING'
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isOnline: true,
            isPlaying: true
          }
        }
      }
    });

    const friends = friendship.map(friendship => friendship.receiver);
    return friends;
  }

  async blockUser(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) {
      throw new Error('You cannot block yourself.');
    }
    if (await this.isUserBlocked(blockerId, blockedId)) {
      throw new Error('User is already blocked.');
    }
    if (await this.areUsersFriends(blockerId, blockedId)) {
      await this.removeFriendship(blockerId, blockedId);
    }

    await this.prisma.blockedUser.create({
      data: {
        blockerId: blockerId,
        blockedId: blockedId
      }
    });
    await this.prisma.blockedUser.deleteMany({
      where: {
        blockerId: blockedId,
        blockedId: blockerId
      }
    });
  }

  async removeBlockedUser(blockerId: string, blockedId: string): Promise<void> {
    if (!await this.isUserBlocked(blockerId, blockedId)) {
      throw new BadRequestException('User is not blocked.');
    }
    await this.prisma.blockedUser.delete({
      where: {
        blockerId_blockedId: {
          blockerId: blockerId,
          blockedId: blockedId
        }
      }
    });
  }
  async getReceivedFriendRequests(userId: string): Promise<FriendsDto[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isOnline: true,
            isPlaying: true
          }
        }
      }
    });

    const friendRequests = friendships.map(friendship => friendship.sender);
    return friendRequests;
  }


  async getBlockedUsers(userId: string): Promise<BlockedUserResponseDto[]> {
    const blockedRelations = await this.prisma.blockedUser.findMany({
      where: {
        blockerId: userId
      },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isOnline: true,
            isPlaying: true
          }
        }
      }
    });
    return blockedRelations.map(relation => relation.blocked);
  }

  private async areUsersFriends(userId1: string, userId2: string): Promise<boolean> {
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            senderId: userId1,
            receiverId: userId2
          },
          {
            senderId: userId2,
            receiverId: userId1
          }
        ]
      }
    });
    return !!existingFriendship;
  }

  private async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const blockCheck = await this.prisma.blockedUser.findFirst({
      where: {
        blockerId: blockerId,
        blockedId: blockedId
      }
    });
    return !!blockCheck;
  }

  async deleteUser(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  	//* ---------------------------------- nizz ---------------------------------- */

	  async inviteGame(senderId: string, receiverId: string): Promise<any> {
      const user = await this.prisma.user.findUnique({
        where: {
          id: receiverId,
        },
      });
      if(user.isPlaying || !user.isOnline)
        throw new BadRequestException('User is already playing or is offline');
      if (senderId === receiverId) {
        throw new BadRequestException('You cannot send a game request to yourself.');
      }
      await this.prisma.gameinvite.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
          status: 'PENDING'
        }
      });
	  }
	
    //questa e' quando accetti la richiesta di gioco
	  async acceptInviteGameRequest(senderId: string, receiverId: string): Promise<void> {
      const gameship = await this.prisma.gameinvite.findFirst({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId, status: 'PENDING' },
            { senderId: receiverId, receiverId: senderId, status: 'PENDING' }
        ]
        }
      });
      
      await this.prisma.gameinvite.update({
        where: { id: gameship.id },
        data: { status: 'ACCEPTED' }
      });
	  }
	
    // questo e' il waiting, chi ha inviato la richiesta (sender)
	  async getWaitingGame(userId: string): Promise<any[]> {
      const gameships = await this.prisma.gameinvite.findMany({
        where: {
          receiverId: userId,
          status: 'PENDING'
          },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
              isOnline: true,
              isPlaying: true
          }
        }
        }
      });
      return gameships;
	  }
	
    // questo e' il thinking, chi ha ricevuto la richiesta (receiver)
	  async getThinkingGame(userId: string): Promise<any[]> {
		const gameships = await this.prisma.gameinvite.findMany({
		  where: {
        senderId: userId,
        status: 'PENDING'
      },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isOnline: true,
            isPlaying: true
          }
        }
		    }
		  });
      return gameships;
	  }
	
	  async getAccepted(userId: string): Promise<any[]> {
      const gameships = await this.prisma.gameinvite.findMany({
        where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
        },
        include: {
        sender: {
          select: {
          id: true,
          username: true,
          profilePicture: true,
          isOnline: true,
          isPlaying: true
          }
        },
        receiver: {
          select: {
          id: true,
          username: true,
          profilePicture: true,
          isOnline: true,
          isPlaying: true
          }
        }
        }
      });
      return gameships;
	  }
	
	  async removeInvited(inviteId: string): Promise<void> {
      await this.prisma.gameinvite.deleteMany({
        where: {
          id: inviteId
        }
      });
	  }
}

const transformationOptions: ClassTransformOptions = {
  strategy: 'excludeAll',
};
