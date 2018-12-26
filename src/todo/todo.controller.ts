import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import Todo from '../entity/Todo'
import { NewTodoPayload } from './todo.interface'
import { TodoRepository } from './todo.service'

@ApiUseTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(AuthGuard('bearer'))
export class TodoController {
  constructor(
    @InjectRepository(TodoRepository) private todoRepository: TodoRepository,
  ) {}

  @ApiOperation({
    title: '할 일 목록 가져오기',
  })
  @Get()
  findAll() {
    return this.todoRepository.findAll()
  }

  @ApiOperation({
    title: '할 일 등록하기',
  })
  @Post()
  create(@Body() newTodoPayload: NewTodoPayload): Promise<Todo> {
    return this.todoRepository.saveFromPayload(newTodoPayload)
  }

  @ApiOperation({
    title: '할 일 항목 가져오기',
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.todoRepository.findOneById(parseInt(id, 10))
  }
}
