import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/common/guards';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ChatModule, GameModule, ScheduleModule.forRoot()],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AtGuard,
    },
  ],
})

export class AppModule {}
