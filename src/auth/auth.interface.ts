import User from './entities/User.entity'

export class LoginPayload implements Pick<User, 'email'> {
  readonly email: string
  readonly password: string
}

export class TokenPayload {
  readonly id: number
  // email
  readonly em: string
}
