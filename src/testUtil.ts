import { EntityManager, getConnection } from 'typeorm'

import { AuthRepository } from './auth/auth.repository'
import { TodoRepository } from './todo/todo.repository'

export const withTx = (f: (manager: EntityManager) => Promise<any>) => {
  return async () => {
    const connection = getConnection()
    const qr = connection.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      await f(qr.manager)
    } finally {
      await qr.rollbackTransaction()
      await qr.release()
    }
  }
}

export async function basicFixture(m: EntityManager) {
  const userRepo = m.getCustomRepository(AuthRepository)
  const todoRepo = m.getCustomRepository(TodoRepository)
  const user1 = await userRepo.saveUserFrom({
    email: 'user1@example.com',
    password: 'mypassword',
  })
  const project1 = await todoRepo.saveProjectFrom(
    {
      title: 'project1',
    },
    user1.id,
  )
  const todo1 = await todoRepo.saveTodoFrom(
    {
      title: 'todo1',
    },
    project1.id,
  )
  const todo2 = await todoRepo.saveTodoFrom(
    {
      title: 'todo2',
    },
    project1.id,
  )

  const user2 = await userRepo.saveUserFrom({
    email: 'user2@example.com',
    password: 'mypassword',
  })

  const project2 = await todoRepo.saveProjectFrom(
    {
      title: 'project2',
    },
    user2.id,
  )

  const todo3 = await todoRepo.saveTodoFrom(
    {
      title: 'todo3',
    },
    project2.id,
  )

  const todo4 = await todoRepo.saveTodoFrom(
    {
      title: 'todo4',
    },
    project2.id,
  )

  return {
    user1,
    project1,
    todo1,
    todo2,
    user2,
    project2,
    todo3,
    todo4,
  }
}
