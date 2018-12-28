import { EntityManager, EntityRepository } from 'typeorm'
import Todo from '../entity/Todo'
import { NewTodoPayload } from './todo.interface'

@EntityRepository()
export class TodoRepository {
  constructor(private readonly manager: EntityManager) {}

  async findOneById(id: number): Promise<Todo> {
    return this.manager.findOneOrFail(Todo, id)
  }

  async findAll(): Promise<Todo[]> {
    return this.manager.find(Todo)
  }

  async saveFromPayload(payload: NewTodoPayload): Promise<Todo> {
    const newTodo = this.manager.create(Todo, payload)
    return this.manager.save(newTodo)
  }
}
