import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger'

import { DatabaseProvider } from '../database/database.provider'
import { LoginPayload } from './auth.interface'
import { AuthRepository } from './auth.repository'

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly databaseProvider: DatabaseProvider) {}

  get repo() {
    return this.databaseProvider
      .getEntityManager()
      .getCustomRepository(AuthRepository)
  }

  @ApiOperation({
    title: '사용자 등록',
  })
  @ApiResponse({
    description: '인증 토큰',
    status: 201,
    type: String,
  })
  @Post('register')
  async register(@Body() payload: LoginPayload): Promise<string> {
    // FIXME: LoginPayload 노노
    // TODO: Recaptcha
    const user = await this.repo.saveUserFrom(payload, true)
    return this.repo.getTokenFromUser(user)
  }

  @ApiOperation({
    title: '토큰 발급',
  })
  @ApiResponse({
    description: '인증 토큰',
    status: 201,
    type: String,
  })
  @Post('sign_in')
  async signIn(@Body() payload: LoginPayload): Promise<string> {
    const user = await this.repo.getUserFrom(payload)
    return this.repo.getTokenFromUser(user)
  }
}
