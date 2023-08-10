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
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(data): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

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

  async updateUsername(userData: userUpdateNameDto): Promise<User> {
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
      } else {
        console.log('Updated user:', updatedUser);
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  }

  async updateEmail(userData: userUpdateMailDto): Promise<User> {
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
      } else {
        console.log('Updated mail:', updatedUser);
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  }

  async updateImage(userData: userUpdateImageDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        profilePicture: userData.newImage,
      },
    });
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
