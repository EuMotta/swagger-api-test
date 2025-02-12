import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserResponse, UserDto } from './user.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseData } from 'src/interfaces/api';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Throttle({ default: { limit: 1, ttl: 500 } })
  @Post()
  @HttpCode(HttpStatus.OK)

  /* swagger start */
  @ApiOperation({ summary: 'Create a new User', operationId: 'createUser' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Register Fail',
  })
  @ApiBody({ type: CreateUserResponse })
  /* swagger end */
  async create(
    @Body() user: CreateUserResponse,
  ): Promise<ApiResponseData<CreateUserResponse>> {
    return this.usersService.create(user);
  }

  @Throttle({ default: { limit: 1, ttl: 500 } })
  @Get()

  /* swagger start */
  @ApiOperation({ summary: 'Get All Users', operationId: 'getAllUsers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Get all users Fail',
  })
  @ApiBody({ type: UserDto })
  /* swagger end */
  async getAll(): Promise<ApiResponseData<UserDto[]>> {
    return this.usersService.getAll();
  }

  @Get('/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Get User With Email',
    operationId: 'getUserByEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Get all users Fail',
  })
  @ApiBody({ type: UserDto })
  /* swagger end */
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByUserEmail(email);
  }
}
