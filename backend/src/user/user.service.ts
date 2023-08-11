import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import {
  ClassTransformOptions,
  TransformOptions,
  plainToClass,
} from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { userListDto } from './dto/userList.dto';
import {
  userUpdateImageDto,
  userUpdateMailDto,
  userUpdateNameDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async getUser(userId: string): Promise<UserDto> {
    if (userId === undefined) {
      throw new BadRequestException('User not found');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
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
      if (!updatedUser) {
        console.log('No user was updated for ID:', userData.id);
      }
      const updatedtoUser = plainToClass(UserDto, updatedUser, transformationOptions);
      console.log('Updated user:', updatedtoUser);
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
      if (!updatedUser) {
        console.log('No mail was updated for ID:', userData.id);
      }
      const updatedtoUser = plainToClass(UserDto, updatedUser, transformationOptions);
      console.log('Updated user:', updatedtoUser);
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
    console.log('Updated user:', updatedtoUser);
    return updatedtoUser;
  }

  async addFriend(senderId: string, receiverId: string): Promise<any> {
    if (senderId === receiverId) {
      throw new Error('You cannot send a friend request to yourself.');
    }
    if (await this.isUserBlocked(senderId, receiverId) || await this.isUserBlocked(receiverId, senderId)) {
      throw new Error('Friend request cannot be sent as one user has blocked the other.');
    }

    if (await this.areUsersFriends(senderId, receiverId)) {
      throw new Error('Friendship already exists or is pending.');
    }

    await this.prisma.friendship.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        status: 'PENDING'
      }
    });
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
}

const transformationOptions: ClassTransformOptions = {
  strategy: 'excludeAll',
};
