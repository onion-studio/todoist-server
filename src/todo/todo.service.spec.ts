import { Connection, createConnection, EntityManager } from 'typeorm'
import { withTx } from '../testUtil'
import { TodoRepository } from './todo.service'

let conn: Connection

beforeAll(async () => {
  conn = await createConnection()
})

afterAll(async () => {
  await conn.close()
})

describe('TodoRepository', () => {
  describe('findAll', () => {
    test(
      'should return nothing with fresh database',
      withTx(async m => {
        const repo = m.getCustomRepository(TodoRepository)
        const todos = await repo.findAll()
        expect(todos).toHaveLength(0)
      }),
    )

    test(
      'should return two todos with basic fixture',
      withTx(async m => {
        const repo = m.getCustomRepository(TodoRepository)
        await basicFixture(m)
        const todos = await repo.findAll()
        expect(todos).toHaveLength(2)
      }),
    )
  })
})

async function basicFixture(m: EntityManager) {
  const repo = m.getCustomRepository(TodoRepository)
  const todo1 = await repo.saveFromPayload({
    title: 'todo1',
  })
  const todo2 = await repo.saveFromPayload({
    title: 'todo2',
  })
  return {
    todo1,
    todo2,
  }
}
