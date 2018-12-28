import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger'

import { DatabaseProvider } from '../database/database.provider'
import Todo from '../entity/Todo'
import { NewTodoPayload } from './todo.interface'
import { TodoRepository } from './todo.repository'

@ApiUseTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(AuthGuard('bearer'))
export class TodoController {
  constructor(private databaseProvider: DatabaseProvider) {}

  get repo() {
    return this.databaseProvider
      .getEntityManager()
      .getCustomRepository(TodoRepository)
  }

  @ApiOperation({
    title: '할 일 목록 가져오기',
  })
  @Get()
  findAll() {
    return this.repo.findAll()
  }

  @ApiOperation({
    title: '할 일 등록하기',
  })
  @Post()
  create(@Body() newTodoPayload: NewTodoPayload): Promise<Todo> {
    return this.repo.saveFromPayload(newTodoPayload)
  }

  @ApiOperation({
    title: '할 일 항목 가져오기',
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.repo.findOneById(parseInt(id, 10))
  }
}
