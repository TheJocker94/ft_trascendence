import { Controller, Post, Body, Get, Param, Put, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '.prisma/client';
import {
  AddFriendDto,
  UserDto,
  userListDto,
  userUpdateImageDto,
  userUpdateMailDto,
  userUpdateNameDto,
} from './dto';
import { GetCurrUserId } from 'src/auth/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  getUsers(): Promise<userListDto[]> {
    return this.userService.getListUsers();
  }

  @Post('update_username')
  updateUsername(
    @Body() userData: userUpdateNameDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<UserDto> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateUsername({ ...userData, id: idToUse });
  }

  @Post('update_email')
  updateEmail(
    @Body() userData: userUpdateMailDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<UserDto> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateEmail({ ...userData, id: idToUse });
  }

  @Post('update_image')
  updateImage(
    @Body() userData: userUpdateImageDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<UserDto> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateImage({ ...userData, id: idToUse });
  }


  @Post('add-friend')
  @HttpCode(HttpStatus.CREATED)
  async addFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrUserId() senderId: string,
    @Res() res: Response,
  ): Promise<any> {
    const { friendId } = addFriendDto;
    await this.userService.addFriend(senderId, friendId);
    return {
      success: true, message: 'Friend request sent successfully!'
    };
  }

  @Post('delete')
  deleteUser(@Body() userData): Promise<User> {
    return this.userService.deleteUser(userData);
  }

  @Get('/:userId')
  getUser(@Param('userId') userId: string): Promise<UserDto | null> {
    return this.userService.getUser(userId);
  }
}
