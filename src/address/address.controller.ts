import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { AxiosErrorResponseDto } from 'src/utils/error.dto';
import { CreateAddressDto } from './address.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { TokenPayload } from 'src/interfaces/token.interface';

@UseGuards(AuthGuard)
@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new Address',
    operationId: 'createAddress',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Address created successfully',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
    type: AxiosErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: AxiosErrorResponseDto,
  })
  @ApiBody({ type: CreateAddressDto })
  async create(
    @Body() addressData: CreateAddressDto,
    @GetUser() user: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    return this.addressService.create(user.sub, addressData);
  }
}
