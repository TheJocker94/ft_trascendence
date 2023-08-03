import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/common/guards';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [{
    provide: 'APP_GUARD',
    useClass: AtGuard,
  }]
})
export class AppModule { }
