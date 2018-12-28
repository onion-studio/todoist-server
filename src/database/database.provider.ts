import { Injectable } from '@nestjs/common'
import { getManager } from 'typeorm'

@Injectable()
export class DatabaseProvider {
  getEntityManager() {
    return getManager()
  }
}
