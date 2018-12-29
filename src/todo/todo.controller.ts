import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger'

import { DatabaseProvider } from '../database/database.provider'
import Project from '../entity/Project'
import Todo from '../entity/Todo'

import {
  NewProjectPayload,
  NewTodoPayload,
  ProjectPayload,
  TodoPayload,
} from './todo.interface'
import { TodoRepository } from './todo.repository'

@ApiUseTags('todos')
@ApiBearerAuth()
@Controller()
@UseGuards(AuthGuard('bearer'))
export class TodoController {
  constructor(private databaseProvider: DatabaseProvider) {}

  get repo(): TodoRepository {
    return this.databaseProvider
      .getEntityManager()
      .getCustomRepository(TodoRepository)
  }

  @ApiOperation({
    title: '프로젝트 목록 가져오기',
  })
  @ApiResponse({
    description: '프로젝트 목록',
    status: 200,
    type: [ProjectPayload],
  })
  @Get('projects')
  getAllProjects(@Req() req) {
    return this.repo.findProjectsByUserId(req.user.id)
  }

  @ApiOperation({
    title: '프로젝트 생성하기',
  })
  @ApiResponse({
    description: '생성된 프로젝트',
    status: 200,
    type: ProjectPayload,
  })
  @Post('projects')
  createProject(
    @Req() req,
    @Body() newProjectPayload: NewProjectPayload,
  ): Promise<Project> {
    return this.repo.saveProjectFrom(newProjectPayload, req.user.id)
  }

  @ApiOperation({
    title: '프로젝트 항목 가져오기',
  })
  @ApiResponse({
    description: '프로젝트',
    status: 200,
    type: ProjectPayload,
  })
  @Get('projects/:projectId')
  getProjectById(@Param('projectId') projectId: string) {
    return this.repo.findProjectById(parseInt(projectId, 10))
  }

  @ApiOperation({
    title: '특정 프로젝트의 할 일 목록 가져오기',
  })
  @ApiResponse({
    description: '할 일 목록',
    status: 200,
    type: [TodoPayload],
  })
  @Get('projects/:projectId/todos')
  getAllTodos(@Param('projectId') projectId: string) {
    return this.repo.findTodosByProjectId(parseInt(projectId, 10))
  }

  @ApiOperation({
    title: '특정 프로젝트의 할 일 생성하기',
  })
  @ApiResponse({
    description: '생성된 할 일',
    status: 200,
    type: TodoPayload,
  })
  @Post('projects/:projectId/todos')
  createTodo(
    @Param('projectId') projectId: string,
    @Body() newTodoPayload: NewTodoPayload,
  ): Promise<Todo> {
    return this.repo.saveTodoFrom(newTodoPayload, parseInt(projectId, 10))
  }

  @ApiOperation({
    title: '할 일 항목 가져오기',
  })
  @ApiResponse({
    description: '할 일',
    status: 200,
    type: TodoPayload,
  })
  @Get('todos/:todoId')
  getTodoById(@Param('todoId') todoId: string) {
    return this.repo.findTodoById(parseInt(todoId, 10))
  }
}
