let config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'todoist',
  password: 'todoist',
  database: 'todoist',
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['migration/**/*.ts'],
  cli: {
    'entitiesDir': 'src/entity',
    'migrationsDir': 'migration',
  },
}

if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    ...require('./ormconfig.test')
  }
}

module.exports = config
