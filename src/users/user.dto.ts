import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/db/entities/user.entity';

export class UserDto {
  @IsUUID()
  @ApiProperty({
    description: 'User unique identifier',
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'User last name',
    example: 'Motta',
  })
  last_name: string;

  @IsString()
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Profile image URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  image: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'User role',
    example: 'Admin',
  })
  role: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
    required: false,
  })
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the user email is verified',
    example: true,
    required: false,
  })
  is_email_verified: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indicates if the user is banned',
    example: false,
    required: false,
  })
  is_banned?: boolean;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'User account creation timestamp',
    example: '2024-02-08T12:00:00Z',
    required: false,
  })
  created_at?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-02-08T12:30:00Z',
    required: false,
  })
  updated_at?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: 'User deletion timestamp (if soft deleted)',
    example: null,
    required: false,
  })
  deleted_at?: Date;

  @IsString()
  @ApiProperty({
    description: 'User password (hashed)',
    example: '$2b$10$XXXXXXXXXXXXXXXXXXXXX',
  })
  password: string;
}

export class CreateUserResponse {
  @IsString()
  @IsNotEmpty({ message: 'O sobrenome não pode estar vazio' })
  @MaxLength(80, { message: 'O sobrenome pode ter no máximo 80 caracteres' })
  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
    minLength: 1,
    maxLength: 80,
  })
  last_name: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  name: string;

  @IsNotEmpty({ message: 'O cargo é obrigatório.' })
  @IsEnum(UserRole, { message: 'O cargo deve ser um valor válido do enum.' })
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Editar cargo do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  role: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  @MaxLength(256, { message: 'O e-mail pode ter no máximo 256 caracteres' })
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'minhasenha123',
    minLength: 6,
  })
  password: string;
}

export class UpdateUserResponse {
  @IsString()
  @IsOptional()
  @MaxLength(80, { message: 'O sobrenome pode ter no máximo 80 caracteres' })
  @ApiProperty({
    description: 'Editar Sobrenome do usuário',
    example: 'Silva',
    minLength: 1,
    maxLength: 80,
  })
  last_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Editar Nome do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Editar Nome do usuário',
    example: 'João',
    minLength: 1,
    maxLength: 30,
  })
  image: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'O cargo deve ser um valor válido do enum.' })
  @MaxLength(30, { message: 'O nome pode ter no máximo 30 caracteres' })
  @ApiProperty({
    description: 'Editar Cargo do usuário',
    example: 'ADMIN',
    minLength: 1,
    maxLength: 30,
  })
  role: string;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsOptional()
  @MaxLength(256, { message: 'O e-mail pode ter no máximo 256 caracteres' })
  @ApiProperty({
    description: 'Editar E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @ApiProperty({
    description: 'Editar Senha do usuário (mínimo 6 caracteres)',
    example: 'minhasenha123',
    minLength: 6,
  })
  password: string;
}

export class UpdateUserStatusResponse {
  @IsBoolean()
  @ApiProperty({
    description: 'Atualizar status do usuário',
    example: true,
  })
  status: boolean;

  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsOptional()
  @ApiProperty({
    description: 'Email para atualizar o status E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;
}
export class UpdateUserEmailResponse {
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsOptional()
  @ApiProperty({
    description: 'Email para atualizar o E-mail do usuário',
    example: 'joao@email.com',
    format: 'email',
    minLength: 1,
    maxLength: 256,
  })
  email: string;
}
