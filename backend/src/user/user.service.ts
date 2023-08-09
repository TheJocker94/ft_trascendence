import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import { ClassTransformOptions, TransformOptions, plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

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
            console.log('dtoUser : ', dtoUser);
            return dtoUser;
        } catch (error) {
            throw new ForbiddenException('getUser error : ' + error);
        }
    }

}

const transformationOptions: ClassTransformOptions = {
    strategy: 'excludeAll'
};