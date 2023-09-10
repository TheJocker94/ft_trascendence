import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ChatGateway, UserService],
  exports: [ChatGateway],
})
export class ChatModule {}
