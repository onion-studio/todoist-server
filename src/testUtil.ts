import { EntityManager, getConnection } from 'typeorm'

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
