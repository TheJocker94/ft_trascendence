import { randomBytes } from 'crypto';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }
    const hash = await this.hashData(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
        username: dto.username,
      },
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    let user;

    // Check if the input is an email
    if (dto.email) {
        user = await this.prisma.user.findFirst({
            where: { email: dto.email }
        });
    } 
    // If not, check if it's a username
    else if (dto.username) {
        user = await this.prisma.user.findFirst({
            where: { username: dto.username }
        });
    }
	// const user = await this.prisma.user.findFirst({
    //   where: {
    //     OR: [{ email: dto.email }, { username: dto.username }],
    //   },
    // });
    if (!user || !(await bcrypt.compare(dto.password, user.hash))) {
      throw new Error('Invalid credentials');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async getEmailFromUsername(username: string): Promise<string | null> {
    const user = await this.prisma.user.findFirst({
        where: { username: username }
    });
    return user ? user.email : null;
}

  async signin42(profile: any): Promise<Tokens> {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          hash: this.generateRandomPassword(),
          username: profile.username,
          profilePicture: profile.avatar,
        },
      });
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true },
    });
    console.log(profile);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRt: null,
        isOnline: false,
      },
    });
  }
  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.hashedRt) {
      throw new Error('Access Denied');
    }
    const isRtValid = await bcrypt.compare(rt, user.hashedRt);
    if (!isRtValid) {
      throw new Error('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async getTokens(userId: string, email: string) {
    const atSecret = process.env.AT_SECRET;
    const rtSecret = process.env.RT_SECRET;
    const accessToken = await this.jwtService.signAsync(
      { id: userId, email },
      { secret: atSecret, expiresIn: '15m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: userId, email },
      { secret: rtSecret, expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }

  generateRandomPassword(length = 16): string {
    return randomBytes(length).toString('hex');
  }
}
