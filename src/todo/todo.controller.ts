import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import Todo from './entities/Todo.entity'
import { NewTodoPayload } from './todo.interface'
import { TodoRepository } from './todo.service'

@ApiUseTags('todos')
@ApiBearerAuth()
@Controller('todos')
export class TodoController {
  constructor(
    @InjectRepository(TodoRepository) private todoRepository: TodoRepository,
  ) {}

  @Get()
  findAll() {
    return this.todoRepository.findAll()
  }

  @Post()
  create(@Body() newTodoPayload: NewTodoPayload): Promise<Todo> {
    return this.todoRepository.saveFromPayload(newTodoPayload)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.todoRepository.findOneById(parseInt(id, 10))
  }
}
