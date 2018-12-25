import { JsonWebTokenError } from 'jsonwebtoken'
import { Connection, createConnection, EntityManager } from 'typeorm'
import { withTx } from '../testUtil'
import { UserRepository } from './user.repository'

let conn: Connection

beforeAll(async () => {
  conn = await createConnection()
})

afterAll(async () => {
  await conn.close()
})

describe('UserRepository', () => {
  describe('insertUser', () => {
    test(
      'should insert user with proper email/password',
      withTx(async m => {
        const repo = m.getCustomRepository(UserRepository)
        expect(await repo.findAll()).toHaveLength(0)
        const user = await repo.insertUser({
          email: 'myusername',
          password: 'mypassword',
        })
        expect(user.email).toBe('myusername')
        expect(await repo.findAll()).toHaveLength(1)
      }),
    )

    test.skip('should throw error if a user with the same email exists', () => {})
  })

  describe('getTokenFromUser', () => {
    test(
      'should generate token from existing user',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(UserRepository)
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
        const repo = m.getCustomRepository(UserRepository)
        const token = await repo.getTokenFromUser(user1)

        const returned = await repo.getUserFromToken(token)
        expect(returned.id).toBe(user1.id)
      }),
    )

    test(
      'should throw error if invalid token is given',
      withTx(async m => {
        const repo = m.getCustomRepository(UserRepository)
        return expect(repo.getUserFromToken('INVALID_TOKEN')).rejects.toThrow(
          JsonWebTokenError, // 'jwt malformed'
        )
      }),
    )
  })

  describe('getUserFromLoginPayload', () => {
    test(
      'should return user from proper payload',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(UserRepository)

        const returned = await repo.getUserFromLoginPayload({
          email: 'myusername',
          password: 'mypassword',
        })

        expect(returned.id).toBe(user1.id)
      }),
    )

    test(
      'should throw error with invalid password',
      withTx(async m => {
        const { user1 } = await basicFixture(m)
        const repo = m.getCustomRepository(UserRepository)
        return expect(
          repo.getUserFromLoginPayload({
            email: 'myusername',
            password: 'INVALID_PASSWORD',
          }),
        ).rejects.toThrow('비밀번호가 일치하지 않습니다.')
      }),
    )
  })
})

async function basicFixture(m: EntityManager) {
  const repo = m.getCustomRepository(UserRepository)
  const user1 = await repo.insertUser({
    email: 'myusername',
    password: 'mypassword',
  })
  return {
    user1,
  }
}
