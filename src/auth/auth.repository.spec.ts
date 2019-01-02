import { JsonWebTokenError } from 'jsonwebtoken'
import { Connection, createConnection, EntityManager } from 'typeorm'
import Project from '../entity/Project'

import { withTx } from '../testUtil'
import { AuthRepository } from './auth.repository'

let conn: Connection

beforeAll(async () => {
  conn = await createConnection()
})

afterAll(async () => {
  await conn.close()
})

describe('AuthRepository', () => {
  describe('saveUserFrom', () => {
    test(
      'should insert user with proper email/password',
      withTx(async m => {
        const repo = m.getCustomRepository(AuthRepository)
        expect(await repo.findAllUsers()).toHaveLength(0)
        const user = await repo.saveUserFrom({
          email: 'myusername',
          password: 'mypassword',
        })
        expect(user.email).toBe('myusername')
        expect(await repo.findAllUsers()).toHaveLength(1)
      }),
    )

    test.skip('should throw error if a user with the same email exists', () => {})

    test(
      'should insert user with initial projects',
      withTx(async m => {
        const repo = m.getCustomRepository(AuthRepository)
        const user = await repo.saveUserFrom({
          email: 'myusername',
          password: 'mypassword'
        }, true)

        const authedProjects = await m.createQueryBuilder(Project, 'project')
          .leftJoinAndSelect('project.todos', 'todo')
          .leftJoin('project.authorities', 'authority')
          .where({
            userId: user.id
          })
          .getMany()

        expect(authedProjects).toHaveLength(2)
        expect(authedProjects[1].title).toMatch('환영합니다')
        expect(authedProjects[1].todos).toHaveLength(9)
      })
    )
  })

  describe('getTokenFromUser', () => {
    test(
      'should generate token from existing user',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(AuthRepository)
        const token = await repo.getTokenFromUser(user1)
        expect(typeof token).toBe('string')
      }),
    )
  })

  describe('getUserFromToken', () => {
    test(
      'should return user from valid token',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(AuthRepository)
        const token = await repo.getTokenFromUser(user1)

        const returned = await repo.getUserFromToken(token)
        expect(returned.id).toBe(user1.id)
      }),
    )

    test(
      'should throw error if invalid token is given',
      withTx(async m => {
        const repo = m.getCustomRepository(AuthRepository)
        return expect(repo.getUserFromToken('INVALID_TOKEN')).rejects.toThrow(
          JsonWebTokenError, // 'jwt malformed'
        )
      }),
    )
  })

  describe('getUserFrom', () => {
    test(
      'should return user from proper payload',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(AuthRepository)

        const returned = await repo.getUserFrom({
          email: 'myusername',
          password: 'mypassword',
        })

        expect(returned.id).toBe(user1.id)
      }),
    )

    test(
      'should throw error with invalid password',
      withTx(async m => {
        await basicFixture(m)
        const repo = m.getCustomRepository(AuthRepository)
        return expect(
          repo.getUserFrom({
            email: 'myusername',
            password: 'INVALID_PASSWORD',
          }),
        ).rejects.toThrow('비밀번호가 일치하지 않습니다.')
      }),
    )
  })
})

async function basicFixture(m: EntityManager) {
  const repo = m.getCustomRepository(AuthRepository)
  const user1 = await repo.saveUserFrom({
    email: 'myusername',
    password: 'mypassword',
  })
  return {
    user1,
  }
}
