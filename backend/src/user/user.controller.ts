import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Res,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Friendship } from '.prisma/client';
import {
  AddFriendDto,
  BlockedUserResponseDto,
  FriendsDto,
  UserDto,
  blockUserDto,
  removeBlockedDto,
  userListDto,
  userUpdateImageDto,
  userUpdateMailDto,
  userUpdateNameDto,
} from './dto';
import { GetCurrUserId } from 'src/auth/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getUsers(): Promise<userListDto[]> {
    return this.userService.getListUsers();
  }

  @Post('update_username')
  @HttpCode(HttpStatus.CREATED)
  updateUsername(
    @Body() userData: userUpdateNameDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<UserDto> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateUsername({ ...userData, id: idToUse });
  }

  @Post('update_email')
  @HttpCode(HttpStatus.CREATED)
  updateEmail(
    @Body() userData: userUpdateMailDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<UserDto> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateEmail({ ...userData, id: idToUse });
  }

  @Post('update_image')
  @HttpCode(HttpStatus.CREATED)
  updateImage(
    @Body() userData: userUpdateImageDto,
    @GetCurrUserId() currentUserId: string,
  ): Promise<UserDto> {
    const idToUse = userData.id || currentUserId;
    return this.userService.updateImage({ ...userData, id: idToUse });
  }

  @Post('add_friend')
  @HttpCode(HttpStatus.CREATED)
  async addFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrUserId() senderId: string,
  ): Promise<any> {
    const { friendId } = addFriendDto;
    await this.userService.addFriend(senderId, friendId);
    return 'Friend request sent successfully!';
  }

  @Post('accept_friend_request')
  @HttpCode(HttpStatus.OK)
  async acceptFriendRequest(
    @Body() dto: AddFriendDto,
    @GetCurrUserId() userId: string,
  ): Promise<any> {
    await this.userService.acceptFriendRequest(userId, dto.friendId);
    return 'Friend request accepted!';
  }

  @Delete('remove_friend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFriendship(
    @Body() dto: AddFriendDto,
    @GetCurrUserId() userId: string,
  ): Promise<any> {
    await this.userService.removeFriendship(userId, dto.friendId);
    return 'Friend removed!';
  }

  @Get('friends')
  @HttpCode(HttpStatus.OK)
  async getFriends(@GetCurrUserId() userId: string): Promise<FriendsDto[]> {
    return this.userService.getFriends(userId);
  }

  @Get('friendships')
  @HttpCode(HttpStatus.OK)
  async getFriendships(@Body() dto: AddFriendDto): Promise<FriendsDto[]> {
    return this.userService.getFriends(dto.friendId);
  }

  @Get('received_friend_requests')
  @HttpCode(HttpStatus.OK)
  async getReceivedFriendsRequests(
    @GetCurrUserId() userId: string,
  ): Promise<FriendsDto[]> {
    return this.userService.getReceivedFriendRequests(userId);
  }

  @Get('sent_friend_requests')
  @HttpCode(HttpStatus.OK)
  async getSentFriendsRequests(
    @GetCurrUserId() userId: string,
  ): Promise<FriendsDto[]> {
    return this.userService.getSentFriendRequests(userId);
  }

  @Post('block_user')
  @HttpCode(HttpStatus.CREATED)
  async blockUser(
    @Body() blockUserDto: blockUserDto,
    @GetCurrUserId() blockerId: string,
  ): Promise<any> {
    await this.userService.blockUser(blockerId, blockUserDto.blockedId);
    return 'User blocked successfully!';
  }

  @Post('block_remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unblockUser(
    @Body() removeBlockedDto: removeBlockedDto,
    @GetCurrUserId() blockerId: string,
  ): Promise<any> {
    const { userIdToUnblock } = removeBlockedDto;
    await this.userService.removeBlockedUser(blockerId, userIdToUnblock);
    return 'User unblocked successfully!';
  }

  @Get('blocked_users')
  @HttpCode(HttpStatus.OK)
  async getBlockedUsers(
    @GetCurrUserId() userId: string,
  ): Promise<BlockedUserResponseDto[]> {
    return this.userService.getBlockedUsers(userId);
  }

  @Post('delete')
  deleteUser(@Body() userData): Promise<User> {
    return this.userService.deleteUser(userData);
  }

  @Get('/:userId')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('userId') userId: string): Promise<UserDto | null> {
    return this.userService.getUser(userId);
  }
}
