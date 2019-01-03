import { EntityManager, EntityRepository } from 'typeorm'

import Project from '../entity/Project'
import ProjectAuthority, { ProjectPermission } from '../entity/ProjectAuthority'
import Todo from '../entity/Todo'
import {
  NewProjectPayload,
  NewTodoPayload,
  UpdateTodosOrderItem,
} from './todo.interface'

@EntityRepository()
export class TodoRepository {
  constructor(private readonly manager: EntityManager) {}

  async findTodosByUserId(userId: number): Promise<Todo[]> {
    return this.manager
      .createQueryBuilder(Todo, 'todo')
      .leftJoin('todo.project', 'project')
      .leftJoin('project.authorities', 'authority')
      .where('authority.userId = :userId', { userId })
      .getMany()
  }

  async findTodoById(id: number): Promise<Todo> {
    return this.manager.findOneOrFail(Todo, id)
  }

  async findTodosByProjectId(projectId: number): Promise<Todo[]> {
    return this.manager.find(Todo, {
      projectId,
    })
  }

  async saveTodoFrom(
    payload: NewTodoPayload,
    projectId: number,
  ): Promise<Todo> {
    await this.manager.findOneOrFail(Project, projectId)

    // https://www.lesstif.com/display/DBMS/MySQL+Error+1093+%3A+You+can%27t+specify+target+table+%27cwd_group%27+for+update+in+FROM+clause
    const insertQuery = this.manager
      .createQueryBuilder()
      .insert()
      .into(Todo)
      .values({
        ...payload,
        projectId,
        order: () =>
          `(SELECT COALESCE(MAX(t.order), 0) maxOrder FROM todo t WHERE t.projectId = :projectId) + 1`,
      })
      .setParameters({ projectId })
    // const rawSql = insertQuery.getQuery()
    const {
      identifiers: [todoId],
    } = await insertQuery.execute()
    return this.manager.findOneOrFail(Todo, todoId)
  }

  async findProjectById(id: number): Promise<Project> {
    return this.manager.findOneOrFail(Project, id)
  }

  async findProjectsByUserId(userId): Promise<Project[]> {
    return this.manager
      .createQueryBuilder(Project, 'project')
      .leftJoin('project.authorities', 'authority')
      .where('authority.userId = :userId', { userId })
      .getMany()
  }

  async saveProjectFrom(
    payload: NewProjectPayload,
    userId: number,
  ): Promise<Project> {
    // FIXME: 이미 존재하는 id가 입력된 경우
    const p = this.manager.create(Project, payload)
    await this.manager.save(p)
    const authority = this.manager.create(ProjectAuthority, {
      projectId: p.id,
      userId,
    })
    await this.manager.save(authority)
    return p
  }

  async authorizeTodo(
    userId: number,
    todoId: number,
  ): Promise<ProjectPermission | false> {
    const project = await this.manager
      .createQueryBuilder(Project, 'project')
      .leftJoin('project.todos', 'todo')
      .where('todo.id = :todoId', { todoId })
      .getOne()
    return this.authorizeProject(userId, project.id)
  }

  async authorizeProject(
    userId: number,
    projectId: number,
  ): Promise<ProjectPermission | false> {
    const authority = await this.manager.findOne(ProjectAuthority, {
      userId,
      projectId,
    })
    return authority ? authority.permission : false
  }

  async updateTodosOrderFrom(
    todos: Todo[],
    todosOrderList: UpdateTodosOrderItem[],
  ): Promise<Todo[]> {
    todosOrderList.forEach(to => {
      const todo = todos.find(t => t.id === to.id)
      // 반드시 찾았다고 가정
      todo!!.order = to.order
    })
    return this.manager.save(todos)
  }
}
