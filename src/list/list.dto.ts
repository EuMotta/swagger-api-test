import { 
    IsNotEmpty, 
    IsString, 
    IsBoolean, 
    IsOptional, 
    IsNumber, 
    ValidateNested, 
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  class DataSourceDto {
    @ApiPropertyOptional({ description: 'Se há um filtro aplicado na fonte de dados', example: false })
    @IsOptional()
    @IsBoolean({ message: 'O filtro deve ser um valor booleano' })
    filter?: boolean;
  }
  
  class CardLimitDto {
    @ApiProperty({ description: 'Status da limitação', example: 'ok' })
    @IsNotEmpty({ message: 'O status da limitação é obrigatório' })
    @IsString({ message: 'O status deve ser uma string' })
    status: string;
  
    @ApiProperty({ description: 'Número de cartões que desabilita a lista', example: 5000 })
    @IsNotEmpty({ message: 'O limite de desativação é obrigatório' })
    @IsNumber({}, { message: 'O limite de desativação deve ser um número' })
    disable_at: number;
  
    @ApiProperty({ description: 'Número de cartões que gera um aviso', example: 4000 })
    @IsNotEmpty({ message: 'O limite de aviso é obrigatório' })
    @IsNumber({}, { message: 'O limite de aviso deve ser um número' })
    warn_at: number;
  }
  
  class CardLimitsDto {
    @ApiProperty({ description: 'Limite de cartões abertos na lista' })
    @ValidateNested()
    @Type(() => CardLimitDto)
    open_per_list: CardLimitDto;
  
    @ApiProperty({ description: 'Limite total de cartões na lista' })
    @ValidateNested()
    @Type(() => CardLimitDto)
    total_per_list: CardLimitDto;
  }
  
  class LimitsDto {
    @ApiProperty({ description: 'Configuração de limite de cartões' })
    @ValidateNested()
    @Type(() => CardLimitsDto)
    cards: CardLimitsDto;
  }
  
  export class CreateListDto {
    @ApiProperty({ description: 'ID único da lista', example: '65d5452077ecd05767f30331' })
    @IsNotEmpty({ message: 'O ID da lista é obrigatório' })
    @IsString({ message: 'O ID deve ser uma string' })
    id: string;
  
    @ApiProperty({ description: 'Nome da lista', example: 'Product Backlog' })
    @IsNotEmpty({ message: 'O nome da lista é obrigatório' })
    @IsString({ message: 'O nome deve ser uma string' })
    name: string;
  
    @ApiPropertyOptional({ description: 'Se a lista está fechada', example: false })
    @IsOptional()
    @IsBoolean({ message: 'O valor de "closed" deve ser booleano' })
    closed?: boolean;
  
    @ApiPropertyOptional({ description: 'Cor da lista', example: null })
    @IsOptional()
    @IsString({ message: 'A cor deve ser uma string' })
    color?: string | null;
  
    @ApiPropertyOptional({ description: 'Método de criação', example: null })
    @IsOptional()
    @IsString({ message: 'O método de criação deve ser uma string' })
    creation_method?: string | null;
  
    @ApiPropertyOptional({ description: 'Fonte de dados da lista' })
    @ValidateNested()
    @Type(() => DataSourceDto)
    datasource?: DataSourceDto;
  
    @ApiProperty({ description: 'ID do quadro ao qual a lista pertence', example: '65d544ffce24be2813a3d265' })
    @IsNotEmpty({ message: 'O ID do quadro é obrigatório' })
    @IsString({ message: 'O ID do quadro deve ser uma string' })
    id_board: string;
  
    @ApiPropertyOptional({ description: 'Limites de cartões dentro da lista' })
    @ValidateNested()
    @Type(() => LimitsDto)
    limits?: LimitsDto;
  
    @ApiPropertyOptional({ description: 'Posição da lista no quadro', example: 65536 })
    @IsOptional()
    @IsNumber({}, { message: 'A posição deve ser um número' })
    pos?: number;
  
    @ApiPropertyOptional({ description: 'Limite de cartões sugerido para a lista', example: null })
    @IsOptional()
    @IsNumber({}, { message: 'O soft_limit deve ser um número' })
    soft_limit?: number | null;
  
    @ApiPropertyOptional({ description: 'Se o usuário está inscrito na lista', example: false })
    @IsOptional()
    @IsBoolean({ message: 'O valor de "subscribed" deve ser booleano' })
    subscribed?: boolean;
  
    @ApiPropertyOptional({ description: 'Tipo da lista', example: null })
    @IsOptional()
    @IsString({ message: 'O tipo deve ser uma string' })
    type?: string | null;
  }
  