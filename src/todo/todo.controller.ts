import {
  Body,
  Controller,
  ForbiddenException,
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
    status: 200,
    description: '프로젝트 목록',
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
  @ApiResponse({
    status: 403,
    description: '접근할 수 없는 프로젝트',
  })
  @Get('projects/:projectId')
  async getProjectById(@Param('projectId') projectIdStr: string, @Req() req) {
    const projectId = parseInt(projectIdStr, 10)
    if (await this.repo.authorizeProject(req.user.id, projectId)) {
      return this.repo.findProjectById(projectId)
    } else {
      throw new ForbiddenException()
    }
  }

  @ApiOperation({
    title: '특정 프로젝트의 할 일 목록 가져오기',
    description: 'TODO: 순서 변경, 기한, 라벨, 우선순위',
  })
  @ApiResponse({
    description: '할 일 목록',
    status: 200,
    type: [TodoPayload],
  })
  @ApiResponse({
    status: 403,
    description: '접근할 수 없는 프로젝트',
  })
  @Get('projects/:projectId/todos')
  async getTodosByProjectId(
    @Param('projectId') projectIdStr: string,
    @Req() req,
  ) {
    const projectId = parseInt(projectIdStr, 10)
    if (await this.repo.authorizeProject(req.user.id, projectId)) {
      return this.repo.findTodosByProjectId(projectId)
    } else {
      throw new ForbiddenException()
    }
  }

  @ApiOperation({
    title: '특정 프로젝트의 할 일 생성하기',
  })
  @ApiResponse({
    description: '생성된 할 일',
    status: 200,
    type: TodoPayload,
  })
  @ApiResponse({
    status: 403,
    description: '접근할 수 없는 프로젝트',
  })
  @Post('projects/:projectId/todos')
  async createTodo(
    @Param('projectId') projectIdStr: string,
    @Body() newTodoPayload: NewTodoPayload,
    @Req() req,
  ): Promise<Todo> {
    const projectId = parseInt(projectIdStr, 10)
    if (await this.repo.authorizeProject(req.user.id, projectId)) {
      return this.repo.saveTodoFrom(newTodoPayload, projectId)
    } else {
      throw new ForbiddenException()
    }
  }

  @ApiOperation({
    title: '전체 할 일 목록 가져오기',
  })
  @ApiResponse({
    description: '할 일 목록',
    status: 200,
    type: [TodoPayload],
  })
  @Get('todos')
  getAllTodos(@Req() req) {
    return this.repo.findTodosByUserId(req.user.id)
  }

  @ApiOperation({
    title: '할 일 항목 가져오기',
  })
  @ApiResponse({
    description: '할 일',
    status: 200,
    type: TodoPayload,
  })
  @ApiResponse({
    status: 403,
    description: '접근할 수 없는 할 일',
  })
  @Get('todos/:todoId')
  getTodoById(@Param('todoId') todoIdStr: string, @Req() req) {
    const todoId = parseInt(todoIdStr, 10)
    if (this.repo.authorizeTodo(req.user.id, todoId)) {
      return this.repo.findTodoById(todoId)
    } else {
      // TODO: ForbiddenException 테스트
      throw new ForbiddenException()
    }
  }
}
