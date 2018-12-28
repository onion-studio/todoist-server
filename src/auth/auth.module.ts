import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { AuthController } from './auth.controller'
import { HttpStrategy } from './http.strategy'

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [HttpStrategy],
  exports: [HttpStrategy],
})
export class AuthModule {}
