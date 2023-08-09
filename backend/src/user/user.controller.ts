import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '.prisma/client';
import { UserDto } from './dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    createUser(@Body() userData): Promise<User> {
        return this.userService.createUser(userData);
    }

    @Post('update')
    updateUser(@Body() userData): Promise<User> {
        return this.userService.updateUser(userData);
    }

    @Get(':userId')
    getUser(@Param('userId') userId: string): Promise<UserDto | null> {
        return this.userService.getUser(userId);
    }
}