let config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'todoist',
  password: 'todoist',
  database: 'todoist',
  entities: ['src/entity/*.ts'],
  migrations: ['migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'migration',
  },
  charset: 'utf8mb4',
}

if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    ...require('./ormconfig.test'),
  }
}

module.exports = config
