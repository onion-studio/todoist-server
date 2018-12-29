import { ApiModelProperty } from '@nestjs/swagger'

import User from '../entity/User'

export class LoginPayload implements Pick<User, 'email'> {
  @ApiModelProperty({
    description: '이메일',
  })
  readonly email: string

  @ApiModelProperty({
    description: '비밀번호',
  })
  readonly password: string
}

export class TokenPayload {
  readonly id: number
  // email
  readonly em: string
}
