import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { AbstractRepository, EntityRepository } from 'typeorm'
import { promisify } from 'util'

import User from '../entity/User'
import { LoginPayload, TokenPayload } from './auth.interface'

@Injectable()
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  async findAll(): Promise<User[]> {
    return this.repository.find()
  }

  async findOneById(id: number): Promise<User> {
    return this.repository.findOneOrFail(id)
  }

  async insertUser(payload: LoginPayload): Promise<User> {
    // TODO: 올바른 비밀번호 양식이 아닐 때 에러
    const hashedPassword = await hash(payload.password, 10)
    const user = this.repository.create({
      email: payload.email,
      hashedPassword,
    })
    return this.repository.save(user)
  }

  async getUserFromLoginPayload(payload: LoginPayload): Promise<User> {
    const user = await this.repository.findOneOrFail({
      email: payload.email,
    })
    // 비밀번호가 일치하면 true, 아니면 false
    const matched = (await promisify(compare)(
      payload.password,
      user.hashedPassword,
    )) as boolean
    if (matched) {
      return user
    } else {
      // TODO: 적절한 에러
      throw new Error('비밀번호가 일치하지 않습니다.')
    }
  }

  async getTokenFromUser(user: User): Promise<string> {
    const tokenPayload = generateTokenPayloadFromUser(user)
    return (await promisify(sign)(tokenPayload, 'mysecret')) as string
  }

  async getUserFromToken(token: string): Promise<User> {
    const tokenPayload = (await promisify(verify)(
      token,
      'mysecret',
    )) as TokenPayload
    return this.repository.findOneOrFail(tokenPayload.id)
  }
}

function generateTokenPayloadFromUser(user: User): TokenPayload {
  return {
    id: user.id,
    em: user.email,
  }
}
