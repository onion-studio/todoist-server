import { Connection } from 'typeorm'
import { createDefaultConnection } from '../connection'
import { basicFixture, withTx } from '../testUtil'
import { TodoRepository } from './todo.repository'

let conn: Connection

beforeAll(async () => {
  conn = await createDefaultConnection()
})

afterAll(async () => {
  await conn.close()
})

describe('TodoRepository', () => {
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
})
