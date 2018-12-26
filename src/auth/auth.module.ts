import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthController } from './auth.controller'
import User from '../entity/User'
import { HttpStrategy } from './http.strategy'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  controllers: [AuthController],
  providers: [HttpStrategy],
  exports: [HttpStrategy],
})
export class AuthModule {}
