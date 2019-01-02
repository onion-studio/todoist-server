import { createConnection, getConnectionOptions } from 'typeorm'

// http://typeorm.io/#/using-ormconfig/overriding-options-defined-in-ormconfig
export async function createDefaultConnection() {
  const options = await getConnectionOptions()
  Object.assign(options, {
    type: 'mysql',
    entities: ['src/entity/*.ts'],
    migrations: ['migration/**/*.ts'],
    charset: 'utf8mb4',
  })
  return createConnection(options)
}
