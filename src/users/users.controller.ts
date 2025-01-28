import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserResponse, UserDto } from './user.dto';
import { ApiResponse } from 'src/interfaces/api';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Throttle({ default: { limit: 1, ttl: 500 } })
  @Post()
  async create(
    @Body() user: UserDto,
  ): Promise<ApiResponse<CreateUserResponse>> {
    return this.usersService.create(user);
  }
  @Throttle({ default: { limit: 1, ttl: 500 } })
  @Get()
  async getAll(): Promise<ApiResponse<UserDto[]>> {
    return this.usersService.getAll();
  }

  @Get('/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByUserEmail(email);
  }
}
