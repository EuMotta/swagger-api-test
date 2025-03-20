import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from 'src/db/pagination/page.dto';

export class ApiResponseSuccess {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Lista obtida com sucesso!' })
  message: string;
}

export class ApiResponseBasePaginated<T> {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Lista obtida com sucesso!' })
  message: string;

  @ApiProperty()
  data: PageDto<T> | undefined;

  constructor(error: boolean, message: string, data?: PageDto<T>) {
    this.error = error;
    this.message = message;
    this.data = data;
  }
}
