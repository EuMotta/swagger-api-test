import {
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    MaxLength,
  } from 'class-validator';
  
  export class CreateBoardDto {
    @IsString()
    @MaxLength(200, {
      message: 'O nome do quadro pode ter no máximo 200 caracteres',
    })
    name: string;
  
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'A descrição pode ter no máximo 500 caracteres' })
    description?: string;
  
    @IsArray()
    @IsOptional()
    members: string[];
  
    @IsArray()
    @IsOptional()
    lists: string[];
  
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'O short_link pode ter no máximo 100 caracteres' })
    short_link?: string;
  
    @IsBoolean()
    @IsOptional()
    archived: boolean;
  
    @IsBoolean()
    @IsOptional()
    is_private: boolean;
  
    @IsOptional()
    @IsString({ message: 'owner_id must be a string' })
    owner_id?: string;
  }
  