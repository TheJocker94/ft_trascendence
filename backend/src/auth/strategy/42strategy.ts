import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { User_42 } from '../interfaces';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42auth') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK,
      profileFields: {
        id: 'id',
        username: 'login',
        email: 'email',
      },
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    const rawProfile = JSON.parse(profile._raw);
    const avatar = rawProfile.image?.link;
    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      avatar: avatar,
    };
  }

}