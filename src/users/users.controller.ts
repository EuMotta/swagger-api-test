import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserResponse, UpdateUserResponse, UpdateUserStatusResponse, UserDto } from './user.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseData } from 'src/interfaces/api';
import { PageDto } from 'src/db/pagination/page.dto';
import { PageOptionsDto } from 'src/db/pagination/page-options.dto';
import { AdminOnly } from 'src/guards/role.guard';

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
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ApiResponseData<PageDto<UserDto>>> {
    return this.usersService.getAll(pageOptionsDto);
  }

  @Get('/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Get User With Email',
    operationId: 'getUserByEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get User With Email successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Get User With Email Fail',
  })
  @ApiBody({ type: UserDto })
  /* swagger end */
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByUserEmail(email);
  }

  @UseGuards(AdminOnly)
  @Put('/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Update User With Email',
    operationId: 'updateUserByEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update User With Email successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update User With Email Fail',
  })
  @ApiBody({ type: UserDto })
  /* swagger end */
  update(@Body() user: UpdateUserResponse) {
    return this.usersService.update(user);
  }

  @UseGuards(AdminOnly)
  @Put('update_status/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Update user status',
    operationId: 'updateUserStatus',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update User status successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update User status Fail',
  })
  @ApiBody({ type: UserDto })
  /* swagger end */
  updateStatus(
    @Param('email') email: string, 
    @Body() data: UpdateUserStatusResponse
  ) {
    return this.usersService.updateStatus(email, data);
  }
}
