let config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'todoist',
  password: 'todoist',
  database: 'todoist',
  entities: ['src/entity/*.ts'],
  migrations: ['migration/**/*.ts'],
  charset: 'utf8mb4',
  cli: {
    migrationsDir: 'migration',
  },
}

if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    ...require('./ormconfig.test'),
  }
} else {
}

module.exports = config
