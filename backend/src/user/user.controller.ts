import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '.prisma/client';
import {
  UserDto,
  userListDto,
  userUpdateImageDto,
  userUpdateMailDto,
  userUpdateNameDto,
} from './dto';
import { GetCurrUserId } from 'src/auth/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() userData): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  getUsers(): Promise<userListDto[]> {
    return this.userService.getListUsers();
  }

  @Post('update_username')
  updateUsername(
    @Body() userData: userUpdateNameDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<User> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateUsername({ ...userData, id: idToUse });
  }

  @Post('update_email')
  updateEmail(
    @Body() userData: userUpdateMailDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<User> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateEmail({ ...userData, id: idToUse });
  }

  @Post('update_image')
  updateImage(
    @Body() userData: userUpdateImageDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<User> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateImage({ ...userData, id: idToUse });
  }

  @Post('delete')
  deleteUser(@Body() userData): Promise<User> {
    return this.userService.deleteUser(userData);
  }
  @Get('/id:userId')
  getUser(@Param('userId') userId: string): Promise<UserDto | null> {
    return this.userService.getUser(userId);
  }
}
