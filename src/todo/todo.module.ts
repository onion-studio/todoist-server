import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { TodoController } from './todo.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
})
export class TodoModule {}
