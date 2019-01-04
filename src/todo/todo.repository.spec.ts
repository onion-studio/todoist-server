import { Connection, createConnection } from 'typeorm'
import Project from '../entity/Project'
import Todo from '../entity/Todo'
import { basicFixture, withTx } from '../testUtil'
import { TodoRepository } from './todo.repository'

let conn: Connection

beforeAll(async () => {
  conn = await createConnection()
})

afterAll(async () => {
  await conn.close()
})

describe('TodoRepository', () => {
  describe('saveTodoFrom', () => {
    test(
      'should increase the order for each insert',
      withTx(async m => {
        const { project1, todo1, todo2, todo3, todo4 } = await basicFixture(m)
        expect(todo1.order).toBe(1)
        expect(todo2.order).toBe(2)
        expect(todo3.order).toBe(1)
        expect(todo4.order).toBe(2)

        const repo = m.getCustomRepository(TodoRepository)
        const todo = await repo.saveTodoFrom(
          {
            title: 'test',
          },
          project1.id,
        )

        expect(todo.order).toBe(3)
      }),
    )
  })
  describe('findTodosByProjectId', () => {
    test(
      'should return two todos with basic fixture',
      withTx(async m => {
        const repo = m.getCustomRepository(TodoRepository)
        const { project1 } = await basicFixture(m)
        const todos = await repo.findTodosByProjectId(project1.id)
        expect(todos).toHaveLength(2)
      }),
    )

    test(
      'should return todos in order',
      withTx(async m => {
        const { project1, todo1, todo2 } = await basicFixture(m)
        const repo = m.getCustomRepository(TodoRepository)
        await repo.updateTodosOrderFrom(
          [todo1, todo2],
          [
            {
              id: todo1.id,
              order: 2,
            },
            {
              id: todo2.id,
              order: 1,
            },
          ],
        )
        const todos = await repo.findTodosByProjectId(project1.id)
        expect(todos).toHaveLength(2)
        expect(todos[0].id).toBe(todo2.id)
        expect(todos[1].id).toBe(todo1.id)
      }),
    )
  })

  describe('findTodosByUserId', () => {
    test(
      'works',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(TodoRepository)
        const todos = await repo.findTodosByUserId(user1.id)
        expect(todos).toHaveLength(2)
      }),
    )
  })

  describe('saveProjectFrom', () => {
    test(
      'should return project with proper authority',
      withTx(async m => {
        const { user1, project1 } = await basicFixture(m)

        const repo = m.getCustomRepository(TodoRepository)
        // NOTE: basicFixture에서 saveProjectFrom이 사용되고 있음

        const projects = await repo.findProjectsByUserId(user1.id)
        expect(projects).toHaveLength(1)
        expect(projects[0].id).toBe(project1.id)
      }),
    )
  })

  describe('updateTodosOrderFrom', () => {
    test(
      'works',
      withTx(async m => {
        const { project1, todo1, todo2 } = await basicFixture(m)
        const repo = m.getCustomRepository(TodoRepository)

        // 순서를 반대로 바꾼 후, 인스턴스의 속성이 제대로 변경되었는지 확인
        const todos = await repo.updateTodosOrderFrom(
          [todo1, todo2],
          [{ id: todo1.id, order: 2 }, { id: todo2.id, order: 1 }],
        )

        expect(todos[0].id).toBe(todo1.id)
        expect(todos[0].order).toBe(2)
        expect(todos[1].id).toBe(todo2.id)
        expect(todos[1].order).toBe(1)
      }),
    )
  })

  describe('updateTodoFrom', () => {
    test(
      'works',
      withTx(async m => {
        const { todo1 } = await basicFixture(m)
        const repo = m.getCustomRepository(TodoRepository)
        const updated = await repo.updateTodoFrom(
          { complete: true, title: 'new title' },
          todo1.id,
        )
        expect(updated.title).toBe('new title')
        expect(updated.complete).toBe(true)
      }),
    )
  })
})
