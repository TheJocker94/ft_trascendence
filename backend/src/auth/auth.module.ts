import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategy/at.strategy';
import { RtStrategy } from './strategy/rt.strategy';
import { FortyTwoStrategy } from './strategy/42strategy';
import { JwtModule } from '@nestjs/jwt';
import { configDotenv } from 'dotenv';
import { AtGuard } from './common/guards';
import { SendEmailService } from './2fa/2fa.service';

configDotenv();
@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, })],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, FortyTwoStrategy, SendEmailService]
})
export class AuthModule {}