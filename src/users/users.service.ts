import {
  ConflictException,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserResponse,
  UpdateUserResponse,
  UpdateUserStatusResponse,
  UserDto,
} from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { ApiResponseData } from 'src/interfaces/api';
import { createApiResponse } from 'src/db/db-response';
import { PageOptionsDto } from 'src/db/pagination/page-options.dto';
import { PageDto } from 'src/db/pagination/page.dto';
import { PageMetaDto } from 'src/db/pagination/page-meta.dto';
import { AuditRepository } from 'src/audit/audit.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private auditRepository: AuditRepository,
  ) {}

  async create(
    newUser: CreateUserResponse,
  ): Promise<ApiResponseData<CreateUserResponse>> {
    try {
      const userAlreadyRegistered = await this.findByUserEmail(newUser.email);
      if (userAlreadyRegistered) {
        throw new ConflictException('Email já cadastrado');
      }

      if (!Object.values(UserRole).includes(newUser.role as UserRole)) {
        throw new BadRequestException('O cargo informado é inválido.');
      }

      const dbUser = new UserEntity();
      dbUser.name = newUser.name;
      dbUser.last_name = newUser.last_name;
      dbUser.email = newUser.email;
      dbUser.role = newUser.role as UserRole;
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

      await this.usersRepository.save(dbUser);

      return createApiResponse({
        message: 'Usuário criado com sucesso',
        error: false,
      });
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

  async update(
    data: UpdateUserResponse,
  ): Promise<ApiResponseData<UpdateUserResponse>> {
    try {
      const userToUpdate = await this.usersRepository.findOne({
        where: { email: data.email },
      });

      if (!userToUpdate) {
        throw new NotFoundException('Usuário não encontrado');
      }

      if (
        data.role &&
        !Object.values(UserRole).includes(data.role as UserRole)
      ) {
        throw new BadRequestException('O cargo informado é inválido.');
      }

      userToUpdate.name = data.name ?? userToUpdate.name;
      userToUpdate.last_name = data.last_name ?? userToUpdate.last_name;
      userToUpdate.role = (data.role as UserRole) ?? userToUpdate.role;
      userToUpdate.image = data.image ?? userToUpdate.image;

      if (data.password) {
        userToUpdate.password = bcryptHashSync(data.password, 10);
      }

      const errors = await validate(userToUpdate);

      if (errors.length > 0) {
        const messages = errors
          .map((error) =>
            error.constraints ? Object.values(error.constraints) : [],
          )
          .flat();

        throw new BadRequestException(messages);
      }

      await this.usersRepository.save(userToUpdate);

      return {
        error: false,
        message: 'Usuário atualizado com sucesso!',
        data: null,
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o usuário',
      );
    }
  }

  async updateStatus(
    userEmail: string,
    data: UpdateUserStatusResponse,
  ): Promise<ApiResponseData<UpdateUserStatusResponse>> {
    try {
      const userToUpdate = await this.usersRepository.findOne({
        where: { email: userEmail },
      });

      if (!userToUpdate) {
        throw new NotFoundException('Usuário não encontrado');
      }

      const oldData = userToUpdate.is_active;

      if (data.status === true) {
        userToUpdate.is_active = !userToUpdate.is_active;
      }

      const errors = await validate(userToUpdate);
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        throw new BadRequestException(messages);
      }

      await this.usersRepository.save(userToUpdate);

      await this.auditRepository.logAudit({
        user_id: userToUpdate.id,
        method: 'PATCH',
        path: `/users/update_status/${userToUpdate.email}`,
        old_data: oldData,
        new_data: userToUpdate.is_active,
      });

      return {
        error: false,
        message: `Usuário ${userToUpdate.is_active ? 'Ativado' : 'Desativado'} com sucesso!`,
        data: null,
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o usuário:',
        error,
      );
    }
  }

  async getAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<ApiResponseData<PageDto<UserDto>>> {
    try {
      const { page, limit, search, status, order, orderBy } = pageOptionsDto;
      const offset = (page - 1) * limit;

      const queryBuilder = this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.name',
          'user.last_name',
          'user.email',
          'user.image',
          'user.is_active',
          'user.created_at',
          'user.is_banned',
        ])
        .limit(limit)
        .offset(offset);

      if (search) {
        queryBuilder.andWhere(
          '(user.name LIKE :search OR user.email LIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (status) {
        const isActive = status === 'true';
        queryBuilder.andWhere('user.is_active = :status', { status: isActive });
      }

      if (orderBy) {
        const validColumns = ['name', 'last_name', 'email', 'created_at'];
        if (!validColumns.includes(orderBy)) {
          throw new BadRequestException(
            `Campo de ordenação inválido: ${orderBy}`,
          );
        }
        queryBuilder.orderBy(`user.${orderBy}`, order || 'ASC');
      } else {
        queryBuilder.orderBy('user.created_at', order || 'ASC');
      }

      const itemCount = await queryBuilder.getCount();
      const users = await queryBuilder.getMany();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      const pageDto = new PageDto(users, pageMetaDto);

      return {
        error: false,
        message: 'Usuários encontrados com sucesso!',
        data: pageDto,
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

  async findByUserEmailAuth(
    email: string,
  ): Promise<ApiResponseData<UserDto | null> | null> {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Formato de email inválido');
    }

    const userFound = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.last_name',
        'user.email',
        'user.image',
        'user.role',
        'user.is_active',
        'user.created_at',
        'user.is_banned',
        'user.password',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!userFound) {
      return null;
    }

    return {
      error: false,
      message: 'Usuário encontrado com sucesso!',
      data: userFound,
    };
  }

  async findByUserEmail(
    email: string,
  ): Promise<ApiResponseData<UserDto | null> | null> {
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Formato de email inválido');
    }

    const userFound = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.last_name',
        'user.email',
        'user.image',
        'user.is_active',
        'user.created_at',
        'user.is_banned',
      ])
      .where('user.email = :email', { email })
      .getOne();
    if (!userFound) {
      return null;
    }

    return {
      error: false,
      message: 'Usuário encontrado com sucesso!',
      data: userFound,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
