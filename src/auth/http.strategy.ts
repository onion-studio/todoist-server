import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-http-bearer'

import { DatabaseProvider } from '../database/database.provider'
import { AuthRepository } from './auth.repository'

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly databaseProvider: DatabaseProvider

  get repo() {
    return this.databaseProvider
      .getEntityManager()
      .getCustomRepository(AuthRepository)
  }

  async validate(token: string) {
    const user = await this.repo.getUserFromToken(token)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
