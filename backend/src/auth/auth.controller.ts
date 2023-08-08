import { Body, Controller, Get, HttpCode, HttpStatus, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { FortyTwoAuthGuard, RtGuard } from './common/guards';
import { GetCurrUser, GetCurrUserId, Public } from './common/decorators';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private prisma: PrismaService, private authService: AuthService) { }

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }

    @Public()
    @ApiResponse({ status: 403, description: 'Invalid Credentials' })
    @Post('local/signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
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
        console.log('42 API signin');
    }

    // auth.controller.ts

    @Public()
    @UseGuards(FortyTwoAuthGuard)
    @Get('42')
    async callback_42(@Req() request: any, @Res() response: Response) {
        const profile = request.user;
        const tokens = await this.authService.signin42(profile);
        response.send(tokens);
    }


}

