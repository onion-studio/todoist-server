import { Module } from '@nestjs/common'
import { TodoController } from './todo.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [TodoController],
})
export class TodoModule {}
