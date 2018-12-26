import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import Todo from '../entity/Todo'
import { TodoController } from './todo.controller'
import { TodoRepository } from './todo.service'

@Module({
  imports: [TypeOrmModule.forFeature([Todo, TodoRepository])],
  controllers: [TodoController],
})
export class TodoModule {}
