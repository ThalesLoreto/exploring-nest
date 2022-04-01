import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { IUserPayload } from './interfaces/user-payload.interface';
import { IUserToken } from './interfaces/user-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(email: string, password: string): Promise<IUserToken> {
    const user: User = await this.validateUser(email, password);

    const payload: IUserPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const matchPassword = await compare(pass, user.password);
      if (matchPassword) {
        return {
          ...user,
          password: undefined,
        };
      }
    }
    throw new UnauthorizedException('Email or password incorrect');
  }
}
