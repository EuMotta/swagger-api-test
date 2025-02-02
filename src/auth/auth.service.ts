import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +(
      this.configService.get<number>('JWT_EXPIRATION_TIME') ?? '3600'
    );
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<AuthResponseDto> {
    const findUser = await this.usersService.findByUserEmail(email);
    const foundUser = findUser.data;

    if (!email || !password) {
      throw new UnauthorizedException('Credenciais não fornecidas');
    }

    if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    if (!foundUser.is_active) {
      throw new UnauthorizedException('Sua conta foi desativada');
    }
    if (foundUser.is_banned) {
      throw new UnauthorizedException('Sua conta está banida.');
    }

    const payload = { sub: foundUser.id, email: foundUser.email };
    const token = this.jwtService.sign(payload);

    const user = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      last_name: foundUser.last_name,
    };

    return {
      error: false,
      message: 'Login realizado com sucesso',
      data: {
        token,
        expiresIn: this.jwtExpirationTimeInSeconds,
        user,
      },
    };
  }
}
