import {
  ConflictException,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserResponse, UserDto } from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { ApiResponse } from 'src/interfaces/api';
import { createApiResponse } from 'src/db/db-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserDto): Promise<ApiResponse<CreateUserResponse>> {
    try {
      const userAlreadyRegistered = await this.findByUserEmail(newUser.email);
      if (userAlreadyRegistered) {
        throw new ConflictException('Email já cadastrado');
      }

      const dbUser = new UserEntity();
      dbUser.name = newUser.name;
      dbUser.last_name = newUser.last_name;
      dbUser.image = newUser.image;
      dbUser.email = newUser.email;
      dbUser.password = newUser.password;

      const errors = await validate(dbUser);

      if (errors.length > 0) {
        const messages = errors
          .map((error) => {
            return error.constraints ? Object.values(error.constraints) : [];
          })
          .flat();

        throw new BadRequestException(messages);
      }

      dbUser.password = bcryptHashSync(newUser.password, 10);

      const savedUser = await this.usersRepository.save(dbUser);
      console.log('Usuario salvo:', savedUser);

      return createApiResponse({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar usuário:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o usuário',
      );
    }
  }
  async getAll(): Promise<ApiResponse<UserDto[]>> {
    try {
      const users = await this.usersRepository.find();
      if (!users) {
        throw new HttpException(
          `nenhum usuário encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Lista de usuários encontrada com sucesso!',
        data: users,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao procurar lista de usuários:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao procurar os usuários',
      );
    }
  }

  async findByUserEmail(email: string): Promise<ApiResponse<UserDto | null>> {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Formato de email inválido');
    }

    const userFound = await this.usersRepository.findOne({
      where: { email },
    });

    if (!userFound) {
      throw new NotFoundException(`Usuário não encontrado.`);
    }

    return {
      message: 'Usuário encontrado com sucesso!',
      data: {
        id: userFound.id,
        name: userFound.name,
        last_name: userFound.last_name,
        image: userFound.image,
        email: userFound.email,
        is_active: userFound.is_active,
        is_banned: userFound.is_banned,
        password: userFound.password,
      },
    };
  }
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
