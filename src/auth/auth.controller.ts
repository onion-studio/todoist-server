import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiUseTags, ApiOperation } from '@nestjs/swagger'

import { InjectRepository } from '@nestjs/typeorm'
import { LoginPayload } from './auth.interface'
import { UserRepository } from './user.repository'

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  @ApiOperation({
    title: '사용자 등록',
  })
  @Post('register')
  async register(@Body() payload: LoginPayload): Promise<string> {
    // FIXME: LoginPayload 노노
    // TODO: Recaptcha
    const user = await this.userRepo.insertUser(payload)
    return this.userRepo.getTokenFromUser(user)
  }

  @ApiOperation({
    title: '토큰 발급',
  })
  @Post('signin')
  async signin(@Body() payload: LoginPayload): Promise<string> {
    const user = await this.userRepo.getUserFromLoginPayload(payload)
    return this.userRepo.getTokenFromUser(user)
  }
}
