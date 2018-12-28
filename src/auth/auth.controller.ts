import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiUseTags } from '@nestjs/swagger'

import { DatabaseProvider } from '../database/database.provider'
import { LoginPayload } from './auth.interface'
import { UserRepository } from './user.repository'

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  get repo() {
    return this.databaseProvider
      .getEntityManager()
      .getCustomRepository(UserRepository)
  }

  @ApiOperation({
    title: '사용자 등록',
  })
  @Post('register')
  async register(@Body() payload: LoginPayload): Promise<string> {
    // FIXME: LoginPayload 노노
    // TODO: Recaptcha
    const user = await this.repo.insertUser(payload)
    return this.repo.getTokenFromUser(user)
  }

  @ApiOperation({
    title: '토큰 발급',
  })
  @Post('sign_in')
  async signIn(@Body() payload: LoginPayload): Promise<string> {
    const user = await this.repo.getUserFromLoginPayload(payload)
    return this.repo.getTokenFromUser(user)
  }
}
