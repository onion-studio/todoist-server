import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy } from 'passport-http-bearer'
import { UserRepository } from './user.repository'

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {
    super()
  }

  async validate(token: string) {
    const user = await this.userRepo.getUserFromToken(token)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
