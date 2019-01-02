import { compare, hash } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { EntityManager, EntityRepository } from 'typeorm'
import { promisify } from 'util'
import Project from '../entity/Project'
import ProjectAuthority, { ProjectPermission } from '../entity/ProjectAuthority'
import Todo from '../entity/Todo'
import User from '../entity/User'
import { LoginPayload, TokenPayload } from './auth.interface'

@EntityRepository()
export class AuthRepository {
  constructor(private readonly manager: EntityManager) {}

  async findAllUsers(): Promise<User[]> {
    return this.manager.find(User)
  }

  async findOneById(id: number): Promise<User> {
    return this.manager.findOneOrFail(User, id)
  }

  async saveUserFrom(payload: LoginPayload, initialize = false): Promise<User> {
    const m = this.manager

    // TODO: 올바른 비밀번호 양식이 아닐 때 에러
    const hashedPassword = await hash(payload.password, 10)

    const user = m.create(User, {
      email: payload.email,
      hashedPassword,
    })
    await m.save(user)
    expect(user.id).not.toBeUndefined()

    if (initialize) {
      const inbox = m.create(Project, {
        title: '관리함',
      })
      const welcome = m.create(Project, {
        title: '환영합니다\u{1F44B}',
      })
      await m.save([inbox, welcome])

      const inboxAuth = m.create(ProjectAuthority, {
        permission: ProjectPermission.Owner,
        user,
        project: inbox,
      })
      const welcomeAuth = m.create(ProjectAuthority, {
        permission: ProjectPermission.Owner,
        user,
        project: welcome,
      })
      await m.save([inboxAuth, welcomeAuth])

      const todos = await m.save([
        m.create(Todo, {
          title: 'Todoist에 오신걸 환영합니다 👋 몇 가지 팁과 함께 시작하세요:',
          project: welcome
        }),
        m.create(Todo, {
          title: '새 작업을 생성하세요 ➕',
          project: welcome
        }),
        m.create(Todo, {
          title: '이 작업의 일정을 정하세요 📅',
          project: welcome
        }),
        m.create(Todo, {
          title: '당신의 프로젝트를 생성하세요 🗒',
          project: welcome
        }),
        m.create(Todo, {
          title: '[템플릿과 함께 프로젝트 시작하기 →](https://todoist.com/templates)',
          project: welcome
        }),
        m.create(Todo, {
          title: '[가이드와 함께 Todoist 이용 방법 알아보기 →](https://todoist.com/guide/getting-started)',
          project: welcome
        }),
        m.create(Todo, {
          title: '[앱과 함께 어디에서나 체계적으로 일하기 →](https://todoist.com/downloads?focus=desktop)',
          project: welcome
        }),
        m.create(Todo, {
          title: '[문의사항이 있습니까? 팁이 필요합니까? 도움말 센터를 방문하세요 →](https:// get.todoist.help)',
          project: welcome
        }),
      ])

      await m.save(m.create(Todo, {
        title: '드래그 및 들여쓰기하여 하위 작업을 만드세요 ✅',
        project: welcome,
        parent: todos[2]
      }))
    }

    return user
  }

  async getUserFrom(payload: LoginPayload): Promise<User> {
    const user = await this.manager.findOneOrFail(User, {
      email: payload.email,
    })
    // 비밀번호가 일치하면 true, 아니면 false
    const matched = (await promisify(compare)(
      payload.password,
      user.hashedPassword,
    )) as boolean
    if (matched) {
      return user
    } else {
      // TODO: 적절한 에러
      throw new Error('비밀번호가 일치하지 않습니다.')
    }
  }

  async getTokenFromUser(user: User): Promise<string> {
    const tokenPayload = generateTokenPayloadFromUser(user)
    return (await promisify(sign)(tokenPayload, 'mysecret')) as string
  }

  async getUserFromToken(token: string): Promise<User> {
    const tokenPayload = (await promisify(verify)(
      token,
      'mysecret',
    )) as TokenPayload
    return this.manager.findOneOrFail(User, tokenPayload.id)
  }
}

function generateTokenPayloadFromUser(user: User): TokenPayload {
  return {
    id: user.id,
    em: user.email,
  }
}
