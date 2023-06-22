import { UseGuards, Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'

import { UserService } from './user.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { AccessTokenGuard } from '../../common/guards'
import { CurrentUserId } from '../../common/decorators'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  public findAll() {
    return this.userService.findAll()
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  public profile(@CurrentUserId() id: number) {
    return this.userService.profile(Number(id))
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id))
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  public update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.userService.remove(Number(id))
  }
}
