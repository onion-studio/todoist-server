import { Injectable } from '@nestjs/common'
import { AbstractRepository, EntityRepository } from 'typeorm'
import Todo from '../entity/Todo'
import { NewTodoPayload } from './todo.interface'

@Injectable()
@EntityRepository(Todo)
export class TodoRepository extends AbstractRepository<Todo> {
  async findOneById(id: number): Promise<Todo> {
    return this.repository.findOneOrFail(id)
  }

  async findAll(): Promise<Todo[]> {
    return this.repository.find()
  }

  async saveFromPayload(payload: NewTodoPayload): Promise<Todo> {
    const newTodo = this.repository.create(payload)
    return this.repository.save(newTodo)
  }
}
