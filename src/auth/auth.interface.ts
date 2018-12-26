import User from '../entity/User'

export class LoginPayload implements Pick<User, 'email'> {
  readonly email: string
  readonly password: string
}

export class TokenPayload {
  readonly id: number
  // email
  readonly em: string
}
