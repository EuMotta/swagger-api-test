import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { BaseEntity } from './base.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
  FOUNDER = 'FOUNDER',
}

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(2, 25, { message: 'O nome deve ter entre 2 e 25 caracteres.' })
  name: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty({ message: 'O sobrenome é obrigatório.' })
  @IsString({ message: 'O sobrenome deve ser uma string.' })
  @Length(6, 150, { message: 'O sobrenome deve ter entre 6 e 150 caracteres.' })
  last_name: string;

  @Column({ type: 'varchar', default: null })
  image: string;

  @Column({ type: 'varchar', unique: true })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  @Length(6, 100, { message: 'O email deve ter entre 6 e 100 caracteres.' })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsNotEmpty({ message: 'O cargo é obrigatório.' })
  @IsEnum(UserRole, { message: 'O cargo deve ser um valor válido do enum.' })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: true })
  is_banned: boolean;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'varchar', name: 'password' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve conter pelo menos 8 caracteres. Sendo uma maiúscula, uma minúscula, um numero e um símbolo',
    },
  )
  password: string;
}
