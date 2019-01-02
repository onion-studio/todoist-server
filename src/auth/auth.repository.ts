import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { AbstractRepository, EntityManager, EntityRepository } from 'typeorm'
import { promisify } from 'util'

import User from '../entity/User'
import { LoginPayload, TokenPayload } from './auth.interface'

@EntityRepository()
export class AuthRepository {
  constructor(private readonly manager: EntityManager) {}

  async findAllUsers(): Promise<User[]> {
    return this.manager.find(User)
  }

  async findOneById(id: number): Promise<User> {
    return this.manager.findOneOrFail(User, id)
  }

  async saveUserFrom(payload: LoginPayload): Promise<User> {
    // TODO: 올바른 비밀번호 양식이 아닐 때 에러
    const hashedPassword = await hash(payload.password, 10)
    const user = this.manager.create(User, {
      email: payload.email,
      hashedPassword,
    })
    return this.manager.save(user)
  }

  async getUserFrom(payload: LoginPayload): Promise<User> {
    const user = await this.manager.findOneOrFail(User, {
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
    return this.manager.findOneOrFail(User, tokenPayload.id)
  }
}

function generateTokenPayloadFromUser(user: User): TokenPayload {
  return {
    id: user.id,
    em: user.email,
  }
}
