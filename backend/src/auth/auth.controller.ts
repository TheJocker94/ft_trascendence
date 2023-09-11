import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignInDto, TwoFaDto } from './dto';
import { Tokens } from './types';
import { FortyTwoAuthGuard, RtGuard } from './common/guards';
import { GetCurrUser, GetCurrUserId, Public } from './common/decorators';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @ApiResponse({ status: 403, description: 'Invalid Credentials' })
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<any> {
    return this.authService.signinLocal(dto);
  }

  @Public()
  @Post('local/signin/2fa')
  @HttpCode(HttpStatus.OK)
  async signin2FA(
    @Body() dto: TwoFaDto,
  ): Promise<Tokens> {
    return this.authService.verify2fa(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrUserId() userId,
    @GetCurrUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42/signin')
  signin_42() {
  }

  // auth.controller.ts

  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42')
  async callback_42(@Req() request: any, @Res() response: Response) {
    const profile = request.user;
    
    const tokens = await this.authService.signin42(profile);
    const script = `
        <script>
		window.opener.postMessage(${JSON.stringify(tokens)}, '*');
		window.close(); // Close the popup after sending the message
        </script>`;
    response.send(script);
    return tokens;
  }
}
