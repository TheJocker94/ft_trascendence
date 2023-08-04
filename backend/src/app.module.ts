import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/common/guards';
import { SocketTestModule } from './socket-test/socket-test.module';

@Module({
  imports: [PrismaModule, AuthModule, SocketTestModule],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AtGuard,
  }]
})
export class AppModule { }
